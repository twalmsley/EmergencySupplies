import { NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { needsCheckReminder, readinessStats } from '../utils';

export function Layout() {
  const { state, setPeople, setDays, setTheme, markChecked } = useApp();
  const stats = readinessStats(state);
  const remind = needsCheckReminder(state.settings.lastCheckedAt);

  return (
    <div className="app-shell">
      <header className="site-header no-print">
        <div className="site-header-inner">
          <NavLink to="/" className="brand" end>
            <span className="brand-title">Emergency Supplies</span>
            <span className="brand-sub">Local kit planner for your household</span>
          </NavLink>

          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/" end>
              Supplies
            </NavLink>
            <NavLink to="/help">Help</NavLink>
            <NavLink to="/advice">Advice</NavLink>
          </nav>

          <div className="header-controls">
            <div className="field-inline">
              <label htmlFor="people">People</label>
              <input
                id="people"
                type="number"
                min={1}
                value={state.settings.people}
                onChange={(e) => setPeople(Number(e.target.value))}
              />
            </div>
            <div className="field-inline">
              <label htmlFor="days">Days</label>
              <input
                id="days"
                type="number"
                min={1}
                value={state.settings.days}
                onChange={(e) => setDays(Number(e.target.value))}
              />
            </div>
            <div className="field-inline">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                value={state.settings.theme}
                onChange={(e) =>
                  setTheme(e.target.value as 'light' | 'dark' | 'system')
                }
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <span
              className={`chip ${stats.percent < 70 && stats.total > 0 ? 'warn' : ''}`}
              title="Share of items with enough stock for N×M"
            >
              Ready {stats.percent}%
            </span>
          </div>
        </div>
      </header>

      <main className="main">
        {remind && (
          <div className="banner no-print" role="status">
            <div>
              <strong>Kit check due.</strong> Be Ready suggests reviewing expiry
              dates and household needs about every six months.
              {state.settings.lastCheckedAt
                ? ` Last checked: ${new Date(state.settings.lastCheckedAt).toLocaleDateString()}.`
                : ' Not checked yet.'}
            </div>
            <button type="button" className="btn btn-primary" onClick={markChecked}>
              Mark checked today
            </button>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
