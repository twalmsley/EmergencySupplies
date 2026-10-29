import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CollapsiblePanel } from './CollapsiblePanel';
import { IconButton } from './IconButton';

export function ContactsPanel() {
  const { state, addContact, updateContact, deleteContact, markChecked } = useApp();
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');

  return (
    <CollapsiblePanel title="Contacts" badge={state.contacts.length}>
      <p className="muted">
        Keep paper copies too — phones may be unavailable in an outage.
      </p>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          if (!label.trim()) return;
          addContact(label.trim(), value.trim());
          setLabel('');
          setValue('');
        }}
      >
        <label>
          Label
          <input value={label} onChange={(e) => setLabel(e.target.value)} />
        </label>
        <label>
          Number / detail
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <IconButton type="submit" label="Add contact" icon={<Plus size={16} />} variant="primary" size="sm" />
      </form>
      <ul className="side-list" style={{ marginTop: '0.75rem' }}>
        {state.contacts.map((c) => (
          <li key={c.id}>
            <input
              value={c.label}
              aria-label="Contact label"
              onChange={(e) => updateContact(c.id, { label: e.target.value })}
            />
            <input
              value={c.value}
              aria-label="Contact value"
              onChange={(e) => updateContact(c.id, { value: e.target.value })}
            />
            <IconButton
              label={`Delete contact ${c.label}`}
              icon={<Trash2 size={14} />}
              variant="danger"
              size="sm"
              onClick={() => deleteContact(c.id)}
            />
          </li>
        ))}
      </ul>
      <div className="toolbar" style={{ marginTop: '0.75rem' }}>
        <IconButton
          label="Mark kit checked today"
          icon={<CheckCircle2 size={16} />}
          size="sm"
          onClick={markChecked}
        />
      </div>
      {state.settings.lastCheckedAt && (
        <p className="muted" style={{ marginTop: '0.35rem' }}>
          Last checked:{' '}
          {new Date(state.settings.lastCheckedAt).toLocaleString()}
        </p>
      )}
    </CollapsiblePanel>
  );
}
