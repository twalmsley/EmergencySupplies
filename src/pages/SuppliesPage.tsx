import {
  Check,
  Download,
  FileDown,
  FileUp,
  ListPlus,
  Minus,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Share2,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CategoryManager } from '../components/CategoryManager';
import { useConfirm } from '../components/ConfirmDialog';
import { ContactsPanel } from '../components/ContactsPanel';
import { HouseholdSettings } from '../components/HouseholdSettings';
import { IconButton } from '../components/IconButton';
import { ItemModal } from '../components/ItemModal';
import { NotesPanel } from '../components/NotesPanel';
import { useApp } from '../context/AppContext';
import { buildPdfRows, exportItemsPdf } from '../pdf';
import type { SortDir, SortKey, StockFilter, SupplyItem } from '../types';
import { PRIORITY_ORDER } from '../types';
import {
  effectiveRequired,
  formatDate,
  isExpired,
  isExpiringSoon,
  isUnderstocked,
  readinessStats,
} from '../utils';

export function SuppliesPage() {
  const {
    state,
    addItem,
    updateItem,
    deleteItem,
    adjustStock,
    markFullyStocked,
    markFullyStockedMany,
    preseedMerge,
    preseedReplace,
    exportJson,
    importJson,
    shareBackup,
  } = useApp();
  const confirm = useConfirm();
  const fileRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState(
    () => searchParams.get('category') || 'all',
  );
  const [stockFilter, setStockFilter] = useState<StockFilter>(() => {
    const filter = searchParams.get('filter');
    if (
      filter === 'all' ||
      filter === 'understocked' ||
      filter === 'expired' ||
      filter === 'expiring' ||
      filter === 'grabBag'
    ) {
      return filter;
    }
    return 'all';
  });
  const [locationFilter, setLocationFilter] = useState(
    () => searchParams.get('location') || 'all',
  );
  const [sortKey, setSortKey] = useState<SortKey>('category');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SupplyItem | null>(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    const filter = searchParams.get('filter');
    const location = searchParams.get('location');
    if (cat) setCategoryId(cat);
    if (
      filter === 'all' ||
      filter === 'understocked' ||
      filter === 'expired' ||
      filter === 'expiring' ||
      filter === 'grabBag'
    ) {
      setStockFilter(filter);
    }
    if (location) setLocationFilter(location);
  }, [searchParams]);

  const catName = useMemo(
    () => new Map(state.categories.map((c) => [c.id, c.name])),
    [state.categories],
  );
  const locations = useMemo(() => {
    const set = new Set<string>();
    for (const item of state.items) {
      const loc = item.storageLocation.trim();
      if (loc) set.add(loc);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [state.items]);

  const { people, days } = state.settings;
  const stats = readinessStats(state);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = state.items.filter((item) => {
      if (categoryId !== 'all' && item.categoryId !== categoryId) return false;
      if (
        locationFilter !== 'all' &&
        item.storageLocation.trim() !== locationFilter
      ) {
        return false;
      }
      if (q) {
        const hay =
          `${item.name} ${item.notes} ${item.storageLocation} ${catName.get(item.categoryId) ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      switch (stockFilter) {
        case 'understocked':
          return isUnderstocked(item, people, days);
        case 'expired':
          return isExpired(item);
        case 'expiring':
          return isExpiringSoon(item) && !isExpired(item);
        case 'grabBag':
          return item.grabBag;
        default:
          return true;
      }
    });

    const dir = sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      const reqA = effectiveRequired(a, people, days);
      const reqB = effectiveRequired(b, people, days);
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'category':
          cmp = (catName.get(a.categoryId) ?? '').localeCompare(
            catName.get(b.categoryId) ?? '',
          );
          if (cmp === 0) cmp = a.name.localeCompare(b.name);
          break;
        case 'priority':
          cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
          if (cmp === 0) cmp = a.name.localeCompare(b.name);
          break;
        case 'qtyRequired':
          cmp = reqA - reqB;
          break;
        case 'qtyInStock':
          cmp = a.qtyInStock - b.qtyInStock;
          break;
        case 'expiryDate':
          cmp = (a.expiryDate ?? '9999').localeCompare(b.expiryDate ?? '9999');
          break;
        case 'notes':
          cmp = a.notes.localeCompare(b.notes);
          break;
        case 'unit':
          cmp = a.unit.localeCompare(b.unit);
          break;
        case 'grabBag':
          cmp = Number(a.grabBag) - Number(b.grabBag);
          break;
        case 'storageLocation':
          cmp = a.storageLocation.localeCompare(b.storageLocation);
          break;
      }
      return cmp * dir;
    });
    return list;
  }, [
    state.items,
    search,
    categoryId,
    locationFilter,
    stockFilter,
    sortKey,
    sortDir,
    catName,
    people,
    days,
  ]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function sortMark(key: SortKey) {
    if (sortKey !== key) return '';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  }

  function renderStockControls(item: SupplyItem) {
    return (
      <div className="stock-stepper no-print">
        <IconButton
          label={`Decrease stock of ${item.name}`}
          icon={<Minus size={14} />}
          size="xs"
          onClick={() => adjustStock(item.id, -1)}
        />
        <span className="stock-stepper-value">{item.qtyInStock}</span>
        <IconButton
          label={`Increase stock of ${item.name}`}
          icon={<Plus size={14} />}
          size="xs"
          onClick={() => adjustStock(item.id, 1)}
        />
        <IconButton
          label={`Mark ${item.name} fully stocked`}
          icon={<Check size={14} />}
          size="xs"
          variant="edit"
          onClick={() => markFullyStocked(item.id)}
        />
      </div>
    );
  }

  function renderRowActions(item: SupplyItem) {
    return (
      <div className="row-actions">
        <IconButton
          label={`Edit ${item.name}`}
          icon={<Pencil size={14} />}
          variant="edit"
          size="sm"
          onClick={() => {
            setEditing(item);
            setModalOpen(true);
          }}
        />
        <IconButton
          label={`Delete ${item.name}`}
          icon={<Trash2 size={12} />}
          variant="danger-quiet"
          size="xs"
          onClick={async () => {
            const ok = await confirm({
              title: 'Delete item?',
              message: `Delete “${item.name}”? This cannot be undone.`,
              confirmLabel: 'Delete item',
              danger: true,
            });
            if (ok) deleteItem(item.id);
          }}
        />
      </div>
    );
  }

  return (
    <div className="layout-split">
      <div>
        <div className="panel">
          <div className="page-heading">
            <div>
              <h1>Supplies</h1>
              <p className="muted" style={{ margin: 0 }}>
                Planning for <strong>{people}</strong> people ×{' '}
                <strong>{days}</strong> days · weighted readiness{' '}
                <strong>{stats.percent}%</strong> · {stats.fullyStocked}/
                {stats.total} fully stocked
                {stats.shortfalls > 0 ? ` · ${stats.shortfalls} short` : ''}
                {stats.criticalGaps.length > 0
                  ? ` · ${stats.criticalGaps.length} high-priority gap${stats.criticalGaps.length === 1 ? '' : 's'}`
                  : ''}
                {stats.expired > 0 ? ` · ${stats.expired} expired` : ''}
              </p>
              {stats.criticalGaps.length > 0 && (
                <p className="muted critical-gaps" style={{ margin: '0.35rem 0 0' }}>
                  Critical gaps:{' '}
                  {stats.criticalGaps.map((g) => g.name).join(', ')}
                </p>
              )}
            </div>
            <div className="toolbar" style={{ margin: 0 }}>
              <IconButton
                label="Add item"
                icon={<Plus size={18} />}
                variant="primary"
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
              />
              <IconButton
                label="Preseed essentials (merge missing)"
                icon={<ListPlus size={18} />}
                onClick={() => {
                  const n = preseedMerge();
                  alert(
                    n > 0
                      ? `Added ${n} missing essential item${n === 1 ? '' : 's'}.`
                      : 'Your list already includes all seeded essentials.',
                  );
                }}
              />
              <IconButton
                label="Preseed essentials (replace all)"
                icon={<RefreshCw size={18} />}
                onClick={async () => {
                  const ok = await confirm({
                    title: 'Replace all items?',
                    message:
                      'Replace your entire item list with the seeded essentials? Current stock levels and notes on items will be lost.',
                    confirmLabel: 'Replace all',
                    danger: true,
                  });
                  if (ok) preseedReplace();
                }}
              />
            </div>
          </div>

          <div className="toolbar no-print mode-links">
            <Link className="btn" to="/shopping">
              Shopping list
            </Link>
            <Link className="btn" to="/grab-bag">
              Grab-bag packing
            </Link>
            {visible.some((i) => isUnderstocked(i, people, days)) && (
              <button
                type="button"
                className="btn"
                onClick={() =>
                  markFullyStockedMany(
                    visible
                      .filter((i) => isUnderstocked(i, people, days))
                      .map((i) => i.id),
                  )
                }
              >
                Mark visible shortfalls stocked
              </button>
            )}
          </div>

          <div className="toolbar no-print">
            <input
              type="search"
              placeholder="Search name, notes, location, category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search items"
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {state.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as StockFilter)}
              aria-label="Filter by stock status"
            >
              <option value="all">All items</option>
              <option value="understocked">Understocked</option>
              <option value="expired">Expired</option>
              <option value="expiring">Expiring soon</option>
              <option value="grabBag">Grab bag</option>
            </select>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              aria-label="Filter by storage location"
            >
              <option value="all">All locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <IconButton label="Export JSON" icon={<FileDown size={18} />} onClick={exportJson} />
            <IconButton
              label="Share or copy backup"
              icon={<Share2 size={18} />}
              onClick={async () => {
                const result = await shareBackup();
                if (!result.ok) {
                  if (result.error !== 'Share cancelled') alert(result.error);
                  return;
                }
                if (result.method === 'clipboard') {
                  alert('Backup JSON copied to the clipboard.');
                } else if (result.method === 'download') {
                  alert(
                    'Share/clipboard were unavailable, so a JSON backup file was downloaded instead.',
                  );
                }
              }}
            />
            <IconButton
              label="Import JSON"
              icon={<FileUp size={18} />}
              onClick={() => fileRef.current?.click()}
            />
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (!file) return;
                const text = await file.text();
                const result = importJson(text);
                if (!result.ok) alert(`Import failed: ${result.error}`);
                else alert('Import complete. A backup of your previous data was downloaded.');
              }}
            />
            <IconButton
              label="Export PDF"
              icon={<Download size={18} />}
              onClick={() => exportItemsPdf(state, buildPdfRows(state, visible))}
            />
            <IconButton
              label="Print list"
              icon={<Printer size={18} />}
              onClick={() => window.print()}
            />
          </div>

          {visible.length === 0 ? (
            <div className="empty">
              {state.items.length === 0 ? (
                <>
                  <p>No items yet. Preseed a comprehensive essentials list, or add your own.</p>
                  <IconButton
                    label="Preseed essentials (merge missing)"
                    icon={<ListPlus size={18} />}
                    variant="primary"
                    onClick={() => {
                      preseedMerge();
                    }}
                  />
                </>
              ) : (
                <p>No items match the current filters.</p>
              )}
            </div>
          ) : (
            <>
              <div className="table-wrap desktop-only">
                <table className="data">
                  <thead>
                    <tr>
                      {(
                        [
                          ['name', 'Name'],
                          ['category', 'Category'],
                          ['priority', 'Priority'],
                          ['unit', 'Unit'],
                          ['qtyRequired', 'Required'],
                          ['qtyInStock', 'In stock'],
                          ['expiryDate', 'Expiry'],
                          ['storageLocation', 'Location'],
                          ['grabBag', 'Grab bag'],
                          ['notes', 'Notes'],
                        ] as [SortKey, string][]
                      ).map(([key, label]) => (
                        <th key={key}>
                          <button type="button" onClick={() => toggleSort(key)}>
                            {label}
                            {sortMark(key)}
                          </button>
                        </th>
                      ))}
                      <th className="no-print">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((item) => {
                      const req = effectiveRequired(item, people, days);
                      const under = isUnderstocked(item, people, days);
                      const expired = isExpired(item);
                      const expiring = isExpiringSoon(item);
                      return (
                        <tr
                          key={item.id}
                          className={expired ? 'expired' : under ? 'understocked' : ''}
                        >
                          <td>
                            {item.name}
                            {under && (
                              <div>
                                <span className="badge warn">
                                  Need {req - item.qtyInStock}
                                </span>
                              </div>
                            )}
                          </td>
                          <td>{catName.get(item.categoryId) ?? '—'}</td>
                          <td>
                            <span className={`badge priority-${item.priority}`}>
                              {item.priority}
                            </span>
                          </td>
                          <td>{item.unit}</td>
                          <td>
                            {req}
                            {(item.scaleWithPeople || item.scaleWithDays) && (
                              <div className="muted">
                                base {item.qtyRequiredBase}
                                {item.scaleWithPeople ? ' ×N' : ''}
                                {item.scaleWithDays ? ' ×M' : ''}
                              </div>
                            )}
                          </td>
                          <td>
                            <span className="print-only">{item.qtyInStock}</span>
                            {renderStockControls(item)}
                          </td>
                          <td>
                            {formatDate(item.expiryDate)}
                            {expired && (
                              <div>
                                <span className="badge danger">Expired</span>
                              </div>
                            )}
                            {!expired && expiring && (
                              <div>
                                <span className="badge warn">Soon</span>
                              </div>
                            )}
                          </td>
                          <td>{item.storageLocation || '—'}</td>
                          <td>{item.grabBag ? 'Yes' : ''}</td>
                          <td>{item.notes}</td>
                          <td className="no-print">{renderRowActions(item)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="item-cards mobile-only" role="list">
                {visible.map((item) => {
                  const req = effectiveRequired(item, people, days);
                  const under = isUnderstocked(item, people, days);
                  const expired = isExpired(item);
                  const expiring = isExpiringSoon(item);
                  return (
                    <article
                      key={item.id}
                      className={`item-card ${expired ? 'expired' : under ? 'understocked' : ''}`}
                      role="listitem"
                    >
                      <div className="item-card-head">
                        <h3>{item.name}</h3>
                        <span className={`badge priority-${item.priority}`}>
                          {item.priority}
                        </span>
                      </div>
                      <p className="muted" style={{ margin: '0 0 0.5rem' }}>
                        {catName.get(item.categoryId)}
                        {item.storageLocation
                          ? ` · ${item.storageLocation}`
                          : ''}
                        {item.grabBag ? ' · grab bag' : ''}
                      </p>
                      <p style={{ margin: '0 0 0.5rem' }}>
                        Stock {item.qtyInStock} / {req} {item.unit}
                        {under && (
                          <>
                            {' '}
                            <span className="badge warn">
                              Need {req - item.qtyInStock}
                            </span>
                          </>
                        )}
                      </p>
                      {(expired || expiring) && (
                        <p style={{ margin: '0 0 0.5rem' }}>
                          Expiry {formatDate(item.expiryDate)}{' '}
                          {expired ? (
                            <span className="badge danger">Expired</span>
                          ) : (
                            <span className="badge warn">Soon</span>
                          )}
                        </p>
                      )}
                      {item.notes && (
                        <p className="muted" style={{ margin: '0 0 0.5rem' }}>
                          {item.notes}
                        </p>
                      )}
                      {renderStockControls(item)}
                      {renderRowActions(item)}
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <aside>
        <HouseholdSettings />
        <CategoryManager />
        <ContactsPanel />
        <NotesPanel />
      </aside>

      <ItemModal
        open={modalOpen}
        categories={state.categories}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={(draft, id) => {
          if (id) updateItem(id, draft);
          else addItem(draft);
        }}
      />
    </div>
  );
}
