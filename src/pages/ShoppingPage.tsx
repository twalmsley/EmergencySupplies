import { Check, Download, Printer, RotateCcw, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '../components/IconButton';
import { useApp } from '../context/AppContext';
import { buildPdfRows, exportShoppingPdf } from '../pdf';
import {
  effectiveRequired,
  isUnderstocked,
  qtyNeeded,
} from '../utils';

export function ShoppingPage() {
  const { state, updateItem } = useApp();
  const { people, days } = state.settings;
  const [done, setDone] = useState<Set<string>>(() => new Set());

  const catName = useMemo(
    () => new Map(state.categories.map((c) => [c.id, c.name])),
    [state.categories],
  );

  const items = useMemo(() => {
    return state.items
      .filter((i) => isUnderstocked(i, people, days) && !done.has(i.id))
      .sort((a, b) => {
        const ca = catName.get(a.categoryId) ?? '';
        const cb = catName.get(b.categoryId) ?? '';
        return ca.localeCompare(cb) || a.name.localeCompare(b.name);
      });
  }, [state.items, people, days, done, catName]);

  const hiddenCount = done.size;

  return (
    <div className="panel">
      <div className="page-heading">
        <div>
          <h1>
            <ShoppingCart size={22} aria-hidden="true" style={{ verticalAlign: '-3px' }} />{' '}
            Shopping list
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            Items below the required quantity for {people} people × {days} days.
            Check off as you shop, or mark purchased to add the shortfall to stock.{' '}
            <Link to="/">Back to supplies</Link>
          </p>
        </div>
        <div className="toolbar" style={{ margin: 0 }}>
          <IconButton
            label="Export shopping PDF"
            icon={<Download size={18} />}
            onClick={() => exportShoppingPdf(state, buildPdfRows(state, items))}
          />
          <IconButton
            label="Print shopping list"
            icon={<Printer size={18} />}
            onClick={() => window.print()}
          />
          {hiddenCount > 0 && (
            <IconButton
              label="Show checked-off items again"
              icon={<RotateCcw size={18} />}
              onClick={() => setDone(new Set())}
            />
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <p>
            {state.items.some((i) => isUnderstocked(i, people, days))
              ? 'All shortfalls are checked off for this session.'
              : 'Nothing understocked — your shopping list is clear.'}
          </p>
        </div>
      ) : (
        <ul className="mode-list">
          {items.map((item) => {
            const need = qtyNeeded(item, people, days);
            const req = effectiveRequired(item, people, days);
            return (
              <li key={item.id} className="mode-list-item">
                <div>
                  <strong>{item.name}</strong>
                  <div className="muted">
                    {catName.get(item.categoryId)} · need {need} {item.unit} (have{' '}
                    {item.qtyInStock} / {req})
                    {item.notes ? ` · ${item.notes}` : ''}
                  </div>
                </div>
                <div className="row-actions">
                  <IconButton
                    label={`Check off ${item.name}`}
                    icon={<Check size={16} />}
                    size="sm"
                    onClick={() =>
                      setDone((prev) => new Set(prev).add(item.id))
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      updateItem(item.id, {
                        qtyInStock: roundStock(item.qtyInStock + need),
                      });
                      setDone((prev) => {
                        const next = new Set(prev);
                        next.delete(item.id);
                        return next;
                      });
                    }}
                  >
                    Mark purchased
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function roundStock(n: number): number {
  return Math.round(n * 100) / 100;
}
