import { useMemo, useRef, useState } from 'react';
import { CategoryManager } from '../components/CategoryManager';
import { ContactsPanel } from '../components/ContactsPanel';
import { ItemModal } from '../components/ItemModal';
import { useApp } from '../context/AppContext';
import { buildPdfRows, exportItemsPdf } from '../pdf';
import type { SortDir, SortKey, StockFilter, SupplyItem } from '../types';
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
    preseedMerge,
    preseedReplace,
    exportJson,
    importJson,
  } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('category');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SupplyItem | null>(null);

  const catName = useMemo(
    () => new Map(state.categories.map((c) => [c.id, c.name])),
    [state.categories],
  );
  const { people, days } = state.settings;
  const stats = readinessStats(state);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = state.items.filter((item) => {
      if (categoryId !== 'all' && item.categoryId !== categoryId) return false;
      if (q) {
        const hay = `${item.name} ${item.notes} ${catName.get(item.categoryId) ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      switch (stockFilter) {
        case 'understocked':
        case 'shopping':
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
      }
      return cmp * dir;
    });
    return list;
  }, [
    state.items,
    search,
    categoryId,
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

  return (
    <div className="layout-split">
      <div>
        <div className="panel">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '0.75rem',
              marginBottom: '0.75rem',
            }}
          >
            <div>
              <h1>Supplies</h1>
              <p className="muted" style={{ margin: 0 }}>
                Planning for <strong>{people}</strong> people ×{' '}
                <strong>{days}</strong> days · {stats.fullyStocked}/{stats.total}{' '}
                items fully stocked
                {stats.shortfalls > 0 ? ` · ${stats.shortfalls} short` : ''}
                {stats.expired > 0 ? ` · ${stats.expired} expired` : ''}
              </p>
            </div>
            <div className="toolbar" style={{ margin: 0 }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
              >
                Add item
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const n = preseedMerge();
                  alert(
                    n > 0
                      ? `Added ${n} missing essential item${n === 1 ? '' : 's'}.`
                      : 'Your list already includes all seeded essentials.',
                  );
                }}
              >
                Preseed (merge)
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  if (
                    confirm(
                      'Replace your entire item list with the seeded essentials? Current stock levels and notes on items will be lost.',
                    )
                  ) {
                    preseedReplace();
                  }
                }}
              >
                Preseed (replace)
              </button>
            </div>
          </div>

          <div className="toolbar no-print">
            <input
              type="search"
              placeholder="Search name, notes, category…"
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
              <option value="shopping">Shopping list (understocked)</option>
              <option value="understocked">Understocked</option>
              <option value="expired">Expired</option>
              <option value="expiring">Expiring soon</option>
              <option value="grabBag">Grab bag</option>
            </select>
            <button type="button" className="btn" onClick={exportJson}>
              Export JSON
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => fileRef.current?.click()}
            >
              Import JSON
            </button>
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
            <button
              type="button"
              className="btn"
              onClick={() => exportItemsPdf(state, buildPdfRows(state, visible))}
            >
              Export PDF
            </button>
            <button type="button" className="btn" onClick={() => window.print()}>
              Print
            </button>
          </div>

          {visible.length === 0 ? (
            <div className="empty">
              {state.items.length === 0 ? (
                <>
                  <p>No items yet. Preseed a comprehensive essentials list, or add your own.</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      preseedMerge();
                    }}
                  >
                    Preseed (merge)
                  </button>
                </>
              ) : (
                <p>No items match the current filters.</p>
              )}
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    {(
                      [
                        ['name', 'Name'],
                        ['category', 'Category'],
                        ['unit', 'Unit'],
                        ['qtyRequired', 'Required'],
                        ['qtyInStock', 'In stock'],
                        ['expiryDate', 'Expiry'],
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
                              <span className="badge warn">Need {req - item.qtyInStock}</span>
                            </div>
                          )}
                        </td>
                        <td>{catName.get(item.categoryId) ?? '—'}</td>
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
                        <td>{item.qtyInStock}</td>
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
                        <td>{item.grabBag ? 'Yes' : ''}</td>
                        <td>{item.notes}</td>
                        <td className="no-print">
                          <div className="row-actions">
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() => {
                                setEditing(item);
                                setModalOpen(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                if (confirm(`Delete “${item.name}”?`)) deleteItem(item.id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <aside>
        <CategoryManager />
        <ContactsPanel />
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
