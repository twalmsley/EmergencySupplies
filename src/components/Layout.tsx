import { CheckCircle2, Moon, Monitor, Sun } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { needsCheckReminder, readinessStats } from '../utils';
import { IconButton } from './IconButton';

export function Layout() {
  const { state, setPeople, setDays, setTheme, markChecked } = useApp();
  const stats = readinessStats(state);
  const remind = needsCheckReminder(state.settings.lastCheckedAt);

  function cycleTheme() {
    const order = ['system', 'light', 'dark'] as const;
    const idx = order.indexOf(state.settings.theme);
    setTheme(order[(idx + 1) % order.length]);
  }

  const themeLabel =
    state.settings.theme === 'light'
      ? 'Theme: light (click for dark)'
      : state.settings.theme === 'dark'
        ? 'Theme: dark (click for system)'
        : 'Theme: system (click for light)';

  const ThemeIcon =
    state.settings.theme === 'light'
      ? Sun
      : state.settings.theme === 'dark'
        ? Moon
        : Monitor;

  return (
    <div className="app-shell">
      <header className="site-header no-print">
        <div className="site-header-inner">
          <NavLink to="/" className="brand" end>
            <span className="brand-mark" aria-hidden="true">
              BR
            </span>
            <span className="brand-text">
              <span className="brand-title">Be Ready</span>
              <span className="brand-sub">Household emergency supplies</span>
            </span>
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
            <IconButton
              label={themeLabel}
              icon={<ThemeIcon size={18} />}
              onClick={cycleTheme}
            />
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
              <strong>Kit check due.</strong> Review expiry dates and household
              needs about every six months.
              {state.settings.lastCheckedAt
                ? ` Last checked: ${new Date(state.settings.lastCheckedAt).toLocaleDateString()}.`
                : ' Not checked yet.'}
            </div>
            <IconButton
              label="Mark kit checked today"
              icon={<CheckCircle2 size={18} />}
              variant="primary"
              onClick={markChecked}
            />
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
