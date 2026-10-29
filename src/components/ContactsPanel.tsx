import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function ContactsPanel() {
  const {
    state,
    addContact,
    updateContact,
    deleteContact,
    setHouseholdNotes,
    markChecked,
  } = useApp();
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');

  return (
    <div className="panel side-panel no-print">
      <h2>Contacts & notes</h2>
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
        <button type="submit" className="btn btn-sm btn-primary">
          Add contact
        </button>
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
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => deleteContact(c.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <label style={{ display: 'block', marginTop: '0.75rem' }}>
        <span className="muted">Household notes</span>
        <textarea
          rows={5}
          style={{ width: '100%', marginTop: '0.35rem' }}
          value={state.householdNotes}
          onChange={(e) => setHouseholdNotes(e.target.value)}
          placeholder="Meeting point, radio frequencies, medication summary…"
        />
      </label>
      <button
        type="button"
        className="btn btn-sm"
        style={{ marginTop: '0.5rem' }}
        onClick={markChecked}
      >
        Mark kit checked today
      </button>
      {state.settings.lastCheckedAt && (
        <p className="muted" style={{ marginTop: '0.35rem' }}>
          Last checked:{' '}
          {new Date(state.settings.lastCheckedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
