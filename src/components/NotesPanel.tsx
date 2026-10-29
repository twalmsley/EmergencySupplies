import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CollapsiblePanel } from './CollapsiblePanel';
import { useConfirm } from './ConfirmDialog';
import { IconButton } from './IconButton';

export function NotesPanel() {
  const { state, addNote, updateNote, deleteNote } = useApp();
  const confirm = useConfirm();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  return (
    <CollapsiblePanel title="Notes" badge={state.notes.length}>
      <p className="muted">
        Meeting points, radio frequencies, medication summaries, and other household
        reminders.
      </p>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() && !body.trim()) return;
          addNote(title, body);
          setTitle('');
          setBody('');
        }}
      >
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Meeting point"
          />
        </label>
        <label>
          Note
          <textarea
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Details…"
          />
        </label>
        <IconButton type="submit" label="Add note" icon={<Plus size={16} />} variant="primary" size="sm" />
      </form>

      <ul className="side-list" style={{ marginTop: '0.75rem' }}>
        {state.notes.length === 0 && (
          <li className="muted">No notes yet.</li>
        )}
        {state.notes.map((n) => (
          <li key={n.id}>
            {editingId === n.id ? (
              <form
                className="form-grid"
                onSubmit={(e) => {
                  e.preventDefault();
                  updateNote(n.id, { title: editTitle, body: editBody });
                  setEditingId(null);
                }}
              >
                <label>
                  Title
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                  />
                </label>
                <label>
                  Note
                  <textarea
                    rows={3}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                  />
                </label>
                <div className="row-actions">
                  <IconButton type="submit" label="Save note" icon={<Check size={16} />} variant="primary" size="sm" />
                  <IconButton
                    label="Cancel editing note"
                    icon={<X size={16} />}
                    size="sm"
                    onClick={() => setEditingId(null)}
                  />
                </div>
              </form>
            ) : (
              <>
                <strong>{n.title}</strong>
                <p style={{ margin: '0.25rem 0', whiteSpace: 'pre-wrap' }}>{n.body}</p>
                <p className="muted" style={{ margin: 0 }}>
                  Updated {new Date(n.updatedAt).toLocaleString()}
                </p>
                <div className="row-actions">
                  <IconButton
                    label={`Edit note ${n.title}`}
                    icon={<Pencil size={14} />}
                    variant="edit"
                    size="sm"
                    onClick={() => {
                      setEditingId(n.id);
                      setEditTitle(n.title);
                      setEditBody(n.body);
                    }}
                  />
                  <IconButton
                    label={`Delete note ${n.title}`}
                    icon={<Trash2 size={12} />}
                    variant="danger-quiet"
                    size="xs"
                    onClick={async () => {
                      const ok = await confirm({
                        title: 'Delete note?',
                        message: `Delete note “${n.title}”?`,
                        confirmLabel: 'Delete note',
                        danger: true,
                      });
                      if (ok) deleteNote(n.id);
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
