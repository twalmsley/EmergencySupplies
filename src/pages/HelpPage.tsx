import { Link } from 'react-router-dom';
import { GRAB_BAG_WEIGHT_BONUS, PRIORITY_WEIGHTS } from '../types';

export function HelpPage() {
  return (
    <article className="prose panel">
      <h1>Help — how to use Be Prepared</h1>
      <p className="disclaimer">
        Be Prepared stores data only in your browser. It does not replace official
        emergency guidance. If you or someone else is in immediate danger, call{' '}
        <strong>999</strong>. See also the <Link to="/privacy">Privacy</Link>{' '}
        page (free, no signup, no tracking, no ads).
      </p>

      <nav className="toc" aria-label="Help contents">
        <strong>On this page</strong>
        <ol>
          <li>
            <a href="#household">Household size, days, and profile</a>
          </li>
          <li>
            <a href="#items">Items</a>
          </li>
          <li>
            <a href="#categories">Categories</a>
          </li>
          <li>
            <a href="#preseed">Preseed essentials</a>
          </li>
          <li>
            <a href="#filters">Sorting and filters</a>
          </li>
          <li>
            <a href="#modes">Shopping and grab bag</a>
          </li>
          <li>
            <a href="#readiness">Readiness, kit checks, and reminders</a>
          </li>
          <li>
            <a href="#contacts">Contacts and notes</a>
          </li>
          <li>
            <a href="#theme">Theme</a>
          </li>
          <li>
            <a href="#import-export">Import, export, backup, PDF, print</a>
          </li>
          <li>
            <a href="#pwa">Install and offline use</a>
          </li>
        </ol>
      </nav>

      <h2 id="household">Household size, days, and profile</h2>
      <p>
        Use <strong>People (N)</strong> and <strong>Days (M)</strong> in the
        header. Items marked to scale with people and/or days recalculate their{' '}
        <em>required</em> quantity as{' '}
        <code>base × (N if scaled) × (M if scaled)</code>. Example: drinking
        water at 3&nbsp;L per person per day for 2 people and 3 days requires
        18&nbsp;L.
      </p>
      <p>
        In the <strong>Household &amp; reminders</strong> side panel you can
        optionally set a household profile (infants, school-age children, pets,
        medical needs). When any profile option is on, preseed skips Baby/Pet
        categories unless you opted in, and Advice can highlight suggested
        topics.
      </p>

      <h2 id="items">Items</h2>
      <p>
        Each item has a name, category, priority (high / medium / low), unit,
        base quantity required, quantity in stock, optional expiry date, optional
        storage location, notes, grab-bag flag, and scaling options. Use the
        inline <strong>+/−</strong> controls to adjust stock without opening the
        editor, or the check icon to mark an item fully stocked. Deletes ask for
        confirmation in an in-app dialog.
      </p>

      <h2 id="categories">Categories</h2>
      <p>
        Default categories cover common kit areas (Food, Drinks, Medical, and
        so on). Rename or add categories in the side panel. Deleting a category
        moves its items to another category you choose.
      </p>

      <h2 id="preseed">Preseed essentials</h2>
      <p>
        <strong>Preseed (merge)</strong> and <strong>Preseed (replace)</strong>{' '}
        load a comprehensive starter list based on UK{' '}
        <a
          href="https://beready.campaign.gov.uk/be-ready-for-emergencies/"
          target="_blank"
          rel="noreferrer"
        >
          Be Ready
        </a>{' '}
        and{' '}
        <a
          href="https://www.redcross.org.uk/get-help/prepare-for-emergencies/prepare-an-emergency-kit"
          target="_blank"
          rel="noreferrer"
        >
          British Red Cross
        </a>{' '}
        guidance, plus extras such as water treatment and optional portable
        cooking gear. Merge adds only missing names; replace rebuilds the list
        after confirmation. Advice topics can also add missing essentials for
        related categories.
      </p>

      <h2 id="filters">Sorting and filters</h2>
      <p>
        Click any column header to sort. Search matches name, notes, location,
        and category. Filters include understocked, expired, expiring soon
        (within 90 days), grab-bag only, and storage location. Deep links from
        Advice can open Supplies with a category and understocked filter applied.
      </p>

      <h2 id="modes">Shopping and grab bag</h2>
      <p>
        <Link to="/shopping">Shopping</Link> lists items below required quantity
        with quantity still needed, session check-off, and “Mark purchased”
        (adds the shortfall to stock). It has its own PDF/print layout.
      </p>
      <p>
        <Link to="/grab-bag">Grab bag</Link> is a packing checklist for flagged
        items, with session ticks and a compact packing PDF.
      </p>

      <h2 id="readiness">Readiness, kit checks, and reminders</h2>
      <p>
        The header chip shows a <strong>weighted</strong> readiness percentage.
        Each item contributes weight{' '}
        <code>
          {PRIORITY_WEIGHTS.high} (high) / {PRIORITY_WEIGHTS.medium} (medium) /{' '}
          {PRIORITY_WEIGHTS.low} (low)
        </code>
        , plus <code>+{GRAB_BAG_WEIGHT_BONUS}</code> if it is a grab-bag item.
        Only fully stocked items count toward the numerator, so high-priority
        gaps hurt the score more. Critical (high-priority) shortfalls are listed
        under the Supplies heading and kit-check banner.
      </p>
      <p>
        A banner reminds you to review the kit about every six months — use{' '}
        <strong>Mark checked today</strong> when you have rotated stock. Optional{' '}
        <strong>local notifications</strong> (Household &amp; reminders panel)
        can also surface kit-check and expiry reminders when you open the app.
        They require an explicit opt-in and browser permission; behaviour depends
        on the browser/OS. There is no push server.
      </p>

      <h2 id="contacts">Contacts and notes</h2>
      <p>
        The side panels for <strong>Categories</strong>, <strong>Contacts</strong>,
        and <strong>Notes</strong> start collapsed — expand them when you need
        them. Contacts hold phone numbers and similar details. Notes are a list
        you can add, edit, and delete. Keep a paper copy somewhere easy to find
        in a power cut.
      </p>

      <h2 id="theme">Theme</h2>
      <p>
        Choose light, dark, or system. The preference is saved with your other
        local data.
      </p>

      <h2 id="import-export">Import, export, backup, PDF, print</h2>
      <ul>
        <li>
          <strong>Export JSON</strong> downloads your full app state and records
          the export time for the backup reminder (about every 14 days).
        </li>
        <li>
          <strong>Share / copy backup</strong> uses the system share sheet with a
          file when available, otherwise copies JSON to the clipboard, otherwise
          downloads. Full-kit QR codes are not practical (state is usually too
          large); use JSON export/import or share to move between devices.
        </li>
        <li>
          <strong>Import JSON</strong> validates the file, downloads a backup of
          your current data, then replaces local state.
        </li>
        <li>
          <strong>Export PDF</strong> / <strong>Print</strong> cover the current
          supplies view; Shopping and Grab bag have their own layouts.
        </li>
      </ul>
      <p>
        Clearing site data for this origin deletes your kit. Prefer regular
        exports — see <Link to="/privacy">Privacy</Link>.
      </p>

      <h2 id="pwa">Install and offline use</h2>
      <p>
        This app is a progressive web app: after you visit once, much of it
        works offline, and you can install it from your browser’s install or
        “Add to Home Screen” option. Your supply data never leaves this device
        unless you export or share it.
      </p>
    </article>
  );
}
