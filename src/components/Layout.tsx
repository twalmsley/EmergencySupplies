import { CheckCircle2, FileDown, Moon, Monitor, Sun } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  needsBackupReminder,
  needsCheckReminder,
  readinessStats,
} from '../utils';
import { IconButton } from './IconButton';

export function Layout() {
  const { state, setPeople, setDays, setTheme, markChecked, exportJson } =
    useApp();
  const stats = readinessStats(state);
  const remind = needsCheckReminder(state.settings.lastCheckedAt);
  const backupDue = needsBackupReminder(state.settings.lastExportedAt);
  const gapTitle =
    stats.criticalGaps.length > 0
      ? `Critical gaps: ${stats.criticalGaps.map((g) => g.name).join(', ')}`
      : 'Weighted readiness (priority + grab-bag aware)';

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
              BP
            </span>
            <span className="brand-text">
              <span className="brand-title">Be Prepared</span>
              <span className="brand-sub">Household emergency supplies</span>
            </span>
          </NavLink>

          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/" end>
              Supplies
            </NavLink>
            <NavLink to="/shopping">Shopping</NavLink>
            <NavLink to="/grab-bag">Grab bag</NavLink>
            <NavLink to="/help">Help</NavLink>
            <NavLink to="/advice">Advice</NavLink>
            <NavLink to="/privacy">Privacy</NavLink>
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
              title={gapTitle}
            >
              Ready {stats.percent}%
            </span>
          </div>
        </div>
      </header>

      <main className="main">
        {backupDue && (
          <div className="banner banner-info no-print" role="status">
            <div>
              <strong>Backup reminder.</strong> Export your kit JSON every couple
              of weeks (or after big edits). Clearing site data deletes local
              storage.
              {state.settings.lastExportedAt
                ? ` Last export: ${new Date(state.settings.lastExportedAt).toLocaleDateString()}.`
                : ' No export recorded yet.'}
            </div>
            <IconButton
              label="Export JSON backup now"
              icon={<FileDown size={18} />}
              variant="primary"
              onClick={exportJson}
            />
          </div>
        )}
        {remind && (
          <div className="banner no-print" role="status">
            <div>
              <strong>Kit check due.</strong> Review expiry dates and household
              needs about every six months.
              {state.settings.lastCheckedAt
                ? ` Last checked: ${new Date(state.settings.lastCheckedAt).toLocaleDateString()}.`
                : ' Not checked yet.'}
              {stats.criticalGaps.length > 0
                ? ` High-priority gaps: ${stats.criticalGaps.map((g) => g.name).join(', ')}.`
                : ''}
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
