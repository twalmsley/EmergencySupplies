export function HelpPage() {
  return (
    <article className="prose panel">
      <h1>Help — how to use Be Prepared</h1>
      <p className="disclaimer">
        Be Prepared stores data only in your browser. It does not replace official
        emergency guidance. If you or someone else is in immediate danger, call{' '}
        <strong>999</strong>.
      </p>

      <nav className="toc" aria-label="Help contents">
        <strong>On this page</strong>
        <ol>
          <li>
            <a href="#household">Household size and days</a>
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
            <a href="#readiness">Readiness and kit checks</a>
          </li>
          <li>
            <a href="#contacts">Contacts and notes</a>
          </li>
          <li>
            <a href="#theme">Theme</a>
          </li>
          <li>
            <a href="#import-export">Import, export, PDF, print</a>
          </li>
          <li>
            <a href="#pwa">Install and offline use</a>
          </li>
        </ol>
      </nav>

      <h2 id="household">Household size and days</h2>
      <p>
        Use <strong>People (N)</strong> and <strong>Days (M)</strong> in the
        header. Items marked to scale with people and/or days recalculate their{' '}
        <em>required</em> quantity as{' '}
        <code>base × (N if scaled) × (M if scaled)</code>. Example: drinking
        water at 3&nbsp;L per person per day for 2 people and 3 days requires
        18&nbsp;L.
      </p>

      <h2 id="items">Items</h2>
      <p>
        Each item has a name, category, priority (high / medium / low), unit,
        base quantity required, quantity in stock, optional expiry date, notes,
        grab-bag flag, and scaling options. Add, edit, or delete from the
        Supplies table — deletes ask for confirmation in an in-app dialog.
        Priority is a sortable column. Stock below the effective required amount
        shows as understocked (shopping list).
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
        cooking gear.
      </p>
      <ul>
        <li>
          <strong>Merge</strong> (recommended): adds only items whose names are
          not already on your list.
        </li>
        <li>
          <strong>Replace</strong>: rebuilds the item list from the seed catalog
          (stock and notes on existing items are lost). Asks for confirmation
          first.
        </li>
      </ul>
      <p>Tailor quantities and remove anything that does not fit your household.</p>

      <h2 id="filters">Sorting and filters</h2>
      <p>
        Click any column header to sort. Search matches name, notes, and
        category. Filters include shopping list (understocked), expired,
        expiring soon (within 90 days), and grab-bag only.
      </p>

      <h2 id="readiness">Readiness and kit checks</h2>
      <p>
        The header chip shows the percentage of items that meet their required
        stock for the current N×M. A banner reminds you to review the kit about
        every six months — use <strong>Mark checked today</strong> when you have
        rotated stock or updated needs.
      </p>

      <h2 id="contacts">Contacts and notes</h2>
      <p>
        The side panels for <strong>Categories</strong>, <strong>Contacts</strong>,
        and <strong>Notes</strong> start collapsed — expand them when you need
        them. Contacts hold phone numbers and similar details. Notes are a list
        you can add, edit, and delete (meeting points, radio frequencies,
        medication summaries, and so on). Keep a paper copy somewhere easy to
        find in a power cut.
      </p>

      <h2 id="theme">Theme</h2>
      <p>
        Choose light, dark, or system. The preference is saved with your other
        local data.
      </p>

      <h2 id="import-export">Import, export, PDF, print</h2>
      <ul>
        <li>
          <strong>Export JSON</strong> downloads your full app state (settings,
          categories, items, contacts, notes).
        </li>
        <li>
          <strong>Import JSON</strong> validates the file, downloads a backup of
          your current data, then replaces local state.
        </li>
        <li>
          <strong>Export PDF</strong> creates a PDF of the items currently shown
          (after filters), in the current sort order.
        </li>
        <li>
          <strong>Print</strong> uses a print-friendly layout of the same table
          (or Help/Advice pages).
        </li>
      </ul>

      <h2 id="pwa">Install and offline use</h2>
      <p>
        This app is a progressive web app: after you visit once, much of it
        works offline, and you can install it from your browser’s install or
        “Add to Home Screen” option. Your supply data never leaves this device
        unless you export it.
      </p>
    </article>
  );
}
