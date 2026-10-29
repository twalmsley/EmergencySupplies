import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function CategoryManager() {
  const { state, addCategory, renameCategory, deleteCategory } = useApp();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  return (
    <div className="panel side-panel no-print">
      <h2>Categories</h2>
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
        <button type="submit" className="btn btn-sm btn-primary">
          Add
        </button>
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
                />
                <button type="submit" className="btn btn-sm btn-primary">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <strong>{c.name}</strong>
                <div className="row-actions">
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditName(c.name);
                    }}
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    disabled={state.categories.length < 2}
                    onClick={() => {
                      const other = state.categories.find((x) => x.id !== c.id);
                      if (!other) return;
                      if (
                        !confirm(
                          `Delete “${c.name}”? Items will move to “${other.name}”.`,
                        )
                      ) {
                        return;
                      }
                      deleteCategory(c.id, other.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
