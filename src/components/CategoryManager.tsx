import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CollapsiblePanel } from './CollapsiblePanel';
import { useConfirm } from './ConfirmDialog';
import { IconButton } from './IconButton';

export function CategoryManager() {
  const { state, addCategory, renameCategory, deleteCategory } = useApp();
  const confirm = useConfirm();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  return (
    <CollapsiblePanel title="Categories" badge={state.categories.length}>
      <form
        className="toolbar"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          addCategory(name);
          setName('');
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category"
          aria-label="New category name"
        />
        <IconButton type="submit" label="Add category" icon={<Plus size={16} />} variant="primary" size="sm" />
      </form>
      <ul className="side-list">
        {state.categories.map((c) => (
          <li key={c.id}>
            {editingId === c.id ? (
              <form
                className="toolbar"
                onSubmit={(e) => {
                  e.preventDefault();
                  renameCategory(c.id, editName);
                  setEditingId(null);
                }}
              >
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  aria-label="Rename category"
                />
                <IconButton type="submit" label="Save category name" icon={<Check size={16} />} variant="primary" size="sm" />
                <IconButton
                  label="Cancel rename"
                  icon={<X size={16} />}
                  size="sm"
                  onClick={() => setEditingId(null)}
                />
              </form>
            ) : (
              <>
                <strong>{c.name}</strong>
                <div className="row-actions">
                  <IconButton
                    label={`Rename ${c.name}`}
                    icon={<Pencil size={14} />}
                    variant="edit"
                    size="sm"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditName(c.name);
                    }}
                  />
                  <IconButton
                    label={`Delete ${c.name}`}
                    icon={<Trash2 size={12} />}
                    variant="danger-quiet"
                    size="xs"
                    disabled={state.categories.length < 2}
                    onClick={async () => {
                      const other = state.categories.find((x) => x.id !== c.id);
                      if (!other) return;
                      const ok = await confirm({
                        title: 'Delete category?',
                        message: `Delete “${c.name}”? Items will move to “${other.name}”.`,
                        confirmLabel: 'Delete category',
                        danger: true,
                      });
                      if (ok) deleteCategory(c.id, other.id);
                    }}
                  />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </CollapsiblePanel>
  );
}
