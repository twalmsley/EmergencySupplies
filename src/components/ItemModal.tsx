import { useEffect, useState } from 'react';
import type { Category, ItemPriority, SupplyItem } from '../types';

type Draft = Omit<SupplyItem, 'id'>;

const emptyDraft = (categoryId: string): Draft => ({
  name: '',
  categoryId,
  unit: 'each',
  qtyRequiredBase: 1,
  scaleWithPeople: false,
  scaleWithDays: false,
  qtyInStock: 0,
  expiryDate: null,
  notes: '',
  grabBag: false,
  priority: 'medium',
  storageLocation: '',
});

type Props = {
  open: boolean;
  categories: Category[];
  initial?: SupplyItem | null;
  onClose: () => void;
  onSave: (draft: Draft, id?: string) => void;
};

export function ItemModal({ open, categories, initial, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<Draft>(emptyDraft(categories[0]?.id ?? ''));

  useEffect(() => {
    if (!open) return;
    if (initial) {
      const { id: _id, ...rest } = initial;
      setDraft(rest);
    } else {
      setDraft(emptyDraft(categories[0]?.id ?? ''));
    }
  }, [open, initial, categories]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="item-modal-title">{initial ? 'Edit item' : 'Add item'}</h2>
        <form
          className="form-grid two"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.name.trim()) return;
            onSave(
              {
                ...draft,
                name: draft.name.trim(),
                expiryDate: draft.expiryDate || null,
              },
              initial?.id,
            );
            onClose();
          }}
        >
          <label>
            Name
            <input
              required
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </label>
          <label>
            Category
            <select
              value={draft.categoryId}
              onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Unit
            <input
              value={draft.unit}
              onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
              placeholder="each, L, pack…"
            />
          </label>
          <label>
            Base quantity required
            <input
              type="number"
              min={0}
              step="any"
              value={draft.qtyRequiredBase}
              onChange={(e) =>
                setDraft({ ...draft, qtyRequiredBase: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Quantity in stock
            <input
              type="number"
              min={0}
              step="any"
              value={draft.qtyInStock}
              onChange={(e) =>
                setDraft({ ...draft, qtyInStock: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Expiry date
            <input
              type="date"
              value={draft.expiryDate ?? ''}
              onChange={(e) =>
                setDraft({ ...draft, expiryDate: e.target.value || null })
              }
            />
          </label>
          <label>
            Priority
            <select
              value={draft.priority}
              onChange={(e) =>
                setDraft({ ...draft, priority: e.target.value as ItemPriority })
              }
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={draft.scaleWithPeople}
              onChange={(e) =>
                setDraft({ ...draft, scaleWithPeople: e.target.checked })
              }
            />
            Scale with people (N)
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={draft.scaleWithDays}
              onChange={(e) =>
                setDraft({ ...draft, scaleWithDays: e.target.checked })
              }
            />
            Scale with days (M)
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={draft.grabBag}
              onChange={(e) => setDraft({ ...draft, grabBag: e.target.checked })}
            />
            Grab-bag item
          </label>
          <label>
            Storage location
            <input
              value={draft.storageLocation}
              onChange={(e) =>
                setDraft({ ...draft, storageLocation: e.target.value })
              }
              placeholder="Cupboard, garage, car boot…"
            />
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            Notes
            <textarea
              rows={3}
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />
          </label>
          <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
