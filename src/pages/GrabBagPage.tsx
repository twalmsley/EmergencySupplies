import { Backpack, Check, Download, Printer, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '../components/IconButton';
import { useApp } from '../context/AppContext';
import { buildPdfRows, exportGrabBagPdf } from '../pdf';
import { effectiveRequired, isUnderstocked } from '../utils';

export function GrabBagPage() {
  const { state, updateItem } = useApp();
  const { people, days } = state.settings;
  const [packed, setPacked] = useState<Set<string>>(() => new Set());

  const catName = useMemo(
    () => new Map(state.categories.map((c) => [c.id, c.name])),
    [state.categories],
  );

  const items = useMemo(() => {
    return state.items
      .filter((i) => i.grabBag)
      .sort((a, b) => {
        const ca = catName.get(a.categoryId) ?? '';
        const cb = catName.get(b.categoryId) ?? '';
        return ca.localeCompare(cb) || a.name.localeCompare(b.name);
      });
  }, [state.items, catName]);

  const pending = items.filter((i) => !packed.has(i.id));

  return (
    <div className="panel">
      <div className="page-heading">
        <div>
          <h1>
            <Backpack size={22} aria-hidden="true" style={{ verticalAlign: '-3px' }} />{' '}
            Grab-bag packing
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            Checklist for items flagged as grab bag. Packing ticks are for this
            session only.{' '}
            <Link to="/">Back to supplies</Link>
          </p>
        </div>
        <div className="toolbar" style={{ margin: 0 }}>
          <IconButton
            label="Export grab-bag PDF"
            icon={<Download size={18} />}
            onClick={() =>
              exportGrabBagPdf(state, buildPdfRows(state, items))
            }
          />
          <IconButton
            label="Print grab-bag list"
            icon={<Printer size={18} />}
            onClick={() => window.print()}
          />
          {packed.size > 0 && (
            <IconButton
              label="Reset packing checks"
              icon={<RotateCcw size={18} />}
              onClick={() => setPacked(new Set())}
            />
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <p>
            No grab-bag items yet. Flag items from Supplies (edit → Grab-bag
            item).
          </p>
        </div>
      ) : (
        <>
          <p className="muted">
            Packed {packed.size}/{items.length}
            {pending.length === 0 ? ' — all checked for this session.' : ''}
          </p>
          <ul className="mode-list">
            {items.map((item) => {
              const req = effectiveRequired(item, people, days);
              const under = isUnderstocked(item, people, days);
              const isPacked = packed.has(item.id);
              return (
                <li
                  key={item.id}
                  className={`mode-list-item ${isPacked ? 'is-done' : ''} ${under ? 'understocked' : ''}`}
                >
                  <label className="check pack-check">
                    <input
                      type="checkbox"
                      checked={isPacked}
                      onChange={(e) => {
                        setPacked((prev) => {
                          const next = new Set(prev);
                          if (e.target.checked) next.add(item.id);
                          else next.delete(item.id);
                          return next;
                        });
                      }}
                    />
                    <span>
                      <strong>{item.name}</strong>
                      <div className="muted">
                        {catName.get(item.categoryId)} · stock {item.qtyInStock} /{' '}
                        {req} {item.unit}
                        {item.storageLocation
                          ? ` · ${item.storageLocation}`
                          : ''}
                        {under ? ' · understocked' : ''}
                        {item.notes ? ` · ${item.notes}` : ''}
                      </div>
                    </span>
                  </label>
                  <div className="row-actions">
                    {isPacked && (
                      <span className="badge ok">
                        <Check size={12} aria-hidden="true" /> Packed
                      </span>
                    )}
                    <button
                      type="button"
                      className="btn"
                      onClick={() => updateItem(item.id, { grabBag: false })}
                    >
                      Unflag
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
