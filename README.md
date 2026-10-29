# Be Prepared

A **browser-only** app for planning and tracking household emergency supplies for **N people** over **M days**. Everything stays in your browser’s local storage — there is no server and no account.

**Brand name:** Be Prepared (independent of the UK Government Be Ready campaign; see attribution below).

Aligned with public UK preparedness guidance from [Be Ready](https://beready.campaign.gov.uk/be-ready-for-emergencies/) and the [British Red Cross emergency kit](https://www.redcross.org.uk/get-help/prepare-for-emergencies/prepare-an-emergency-kit) checklist, plus practical advice pages for outages, seasons, cooking, and water.

> **Disclaimer:** This is a personal planning tool, not official emergency-service advice. If you or someone else is in immediate danger, call **999**.

## Features

- Editable household size (**N**) and readiness horizon (**M days**)
- Optional household **profile** (infants, school-age, pets, medical) to tailor preseed and Advice
- Categorised item list: name, category, **priority**, unit, quantity required (optional N/M scaling), stock, expiry, **storage location**, notes, grab-bag flag
- Inline stock **+/−** and mark-fully-stocked; custom confirms for deletes
- Default categories: Food, Drinks, Medical, Hygiene, Power, Heat+Light, Communications, Money, Baby, Pet, Documents (editable)
- **Preseed essentials** (merge / replace); Advice can add missing essentials per scenario
- Sortable columns; search; filters for understocked, expired, expiring soon, grab bag, location
- Dedicated **Shopping** and **Grab-bag packing** modes with their own PDF/print layouts
- **Weighted readiness** score (priority + grab-bag aware) with critical-gap summary
- Six-month kit-check reminder; optional **local** expiry/kit notifications (opt-in)
- Backup reminder + JSON export / share / import (validated; pre-import backup download)
- Emergency contacts and household **notes**; collapsible side panels
- Mobile card layout for supplies; desktop table unchanged
- Light / dark / system theme; Progressive Web App (offline after first visit)
- In-app **Help**, **Advice**, and **Privacy** (free, no signup, no tracking, no ads)

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/emergency/`).

The production build is configured with Vite `base: '/emergency/'` so assets and client routes work when the app is hosted under that path.

```bash
npm run build    # production build to dist/
npm run preview  # serve the production build locally (under /emergency/)
```

## How data is stored

State is saved under the localStorage key `emergency-supplies-state` as versioned JSON:

```ts
{
  version: 4,
  settings: {
    people, days, theme, lastCheckedAt, lastExportedAt,
    profile: { infants, schoolAge, pets, medical },
    notifications: { enabled, kitCheck, expired, expiring, expiringLeadDays, lastNotifiedKey }
  },
  categories: [{ id, name }],
  items: [{
    id, name, categoryId, unit, qtyRequiredBase,
    scaleWithPeople, scaleWithDays, qtyInStock,
    expiryDate, notes, grabBag, priority, storageLocation
  }],
  contacts: [{ id, label, value }],
  notes: [{ id, title, body, updatedAt }]
}
```

Imports still accept legacy `householdNotes` strings (migrated into a note), missing `priority` (defaults to `medium`), and missing v4 fields (sensible defaults).

**Effective required quantity** =

`qtyRequiredBase × (people if scaleWithPeople else 1) × (days if scaleWithDays else 1)`

Clearing site data for this origin deletes your kit list. Use **Export JSON** for backups.

## Import / export

| Action | Behaviour |
| --- | --- |
| Export JSON | Downloads full app state |
| Import JSON | Validates schema, downloads a backup of current data, then replaces local state |
| Export PDF | PDF of visible supply rows (current sort/filters), plus contacts and notes |
| Print | Browser print dialog; chrome UI hidden via print CSS |

## Preseed catalogue

The seed list includes drinking water (3 L/person/day), long-life food, hygiene, lighting/warmth, radio and power banks, cash and documents, first aid and medication reminders, baby and pet essentials, plus optional water treatment and portable cooker/fuel items.

Merge mode skips items whose **names** already exist. Replace mode rebuilds the item list from the seed.

## Help, Advice, and Privacy

- `/emergency/help` — how to use the app
- `/emergency/advice` — situational guidance (links into supplies filters / scenario seed)
- `/emergency/shopping` — shopping list mode
- `/emergency/grab-bag` — grab-bag packing checklist
- `/emergency/privacy` — free / no signup / no tracking / no ads philosophy

Content ships with the app so it remains available offline via the service worker.

## Privacy

See the in-app [Privacy](./src/pages/PrivacyPage.tsx) page once deployed (`/emergency/privacy`). No analytics backend is bundled. Data stays in localStorage unless **you** export/share a file, or your browser syncs site data.
## Stack

- Vite + React + TypeScript
- React Router
- `vite-plugin-pwa`
- jsPDF + jspdf-autotable for PDF export

## Contributing

Issues and pull requests are welcome. Please keep the app client-only (no required backend) and preserve local-first storage.

Product spec: [GitHub issue #1](https://github.com/twalmsley/EmergencySupplies/issues/1).

## Attribution

Preparedness themes and checklist ideas draw on:

- [Be Ready — Be ready for emergencies](https://beready.campaign.gov.uk/be-ready-for-emergencies/) (UK Government campaign)
- [British Red Cross — Prepare an emergency kit](https://www.redcross.org.uk/get-help/prepare-for-emergencies/prepare-an-emergency-kit)

Those organisations are not affiliated with this project.

## License

[MIT](./LICENSE) © 2026 Tony
