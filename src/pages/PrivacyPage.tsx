import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <article className="prose panel">
      <h1>Privacy</h1>
      <p className="disclaimer">
        Be Prepared is a personal planning tool, not official emergency-service
        advice. If you or someone else is in immediate danger, call{' '}
        <strong>999</strong>.
      </p>

      <p>
        This app is built around a simple promise: help you prepare your
        household kit without exploiting your attention or your data.
      </p>

      <ul>
        <li>
          <strong>Free.</strong> There is no paid tier required to use the core
          planner.
        </li>
        <li>
          <strong>No signup.</strong> There are no accounts, passwords, or
          email addresses to create.
        </li>
        <li>
          <strong>No data collection.</strong> This project does not bundle
          analytics, tracking pixels, telemetry, or advertising SDKs.
        </li>
        <li>
          <strong>No ads.</strong> The interface is not funded by advertising.
        </li>
      </ul>

      <h2>Where your data lives</h2>
      <p>
        Your supplies list, contacts, notes, and settings are stored in this
        browser’s <strong>localStorage</strong> on your device. Nothing is sent
        to a Be Prepared server — there isn’t one.
      </p>
      <p>Data leaves your device only if:</p>
      <ul>
        <li>
          <strong>You</strong> export a JSON or PDF file, print, or use Share /
          copy backup; or
        </li>
        <li>
          Your browser or operating system syncs site data (for example browser
          profile sync) — that behaviour is outside this app’s control.
        </li>
      </ul>

      <h2>Backups and clearing data</h2>
      <p>
        Clearing site data for this origin deletes your kit list. Use{' '}
        <strong>Export JSON</strong> (or Share backup) regularly. See{' '}
        <Link to="/help#import-export">Help — import and export</Link> for
        details.
      </p>

      <h2>Optional local notifications</h2>
      <p>
        Kit-check and expiry reminders are opt-in and, when enabled, use the
        browser Notifications API locally. They do not require a push
        subscription service run by this project.
      </p>

      <p className="muted" style={{ marginTop: '2rem' }}>
        <Link to="/">← Supplies</Link>
        {' · '}
        <Link to="/help">Help</Link>
      </p>
    </article>
  );
}
