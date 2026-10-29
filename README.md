# Be Prepared

A **browser-only** app for planning and tracking household emergency supplies for **N people** over **M days**. Everything stays in your browser’s local storage — there is no server and no account.

**Brand name:** Be Prepared (independent of the UK Government Be Ready campaign; see attribution below).

Aligned with public UK preparedness guidance from [Be Ready](https://beready.campaign.gov.uk/be-ready-for-emergencies/) and the [British Red Cross emergency kit](https://www.redcross.org.uk/get-help/prepare-for-emergencies/prepare-an-emergency-kit) checklist, plus practical advice pages for outages, seasons, cooking, and water.

> **Disclaimer:** This is a personal planning tool, not official emergency-service advice. If you or someone else is in immediate danger, call **999**.

## Features

- Editable household size (**N**) and readiness horizon (**M days**)
- Categorised item list: name, category, **priority** (high/medium/low), unit, quantity required (with optional N/M scaling), quantity in stock, expiry date, notes, grab-bag flag
- Custom in-app confirmation dialogs for destructive actions (no browser `confirm`)
- Default categories: Food, Drinks, Medical, Hygiene, Power, Heat+Light, Communications, Money, Baby, Pet, Documents (fully editable)
- **Preseed essentials** from Be Ready / Red Cross–inspired catalogue (merge missing items, or replace all)
- Sortable columns; search; filters for shopping list, expired, expiring soon, grab bag
- Readiness summary (% of items fully stocked for N×M)
- Six-month kit-check reminder
- Emergency contacts and multiple household **notes** (add / edit / delete)
- Collapsible Categories, Contacts, and Notes side panels (collapsed by default)
- Icon action buttons with tooltips
- JSON export / import (validated; backup downloaded before import)
- PDF export of the **currently sorted/filtered** list; print stylesheet fallback
- Light / dark / system theme
- Progressive Web App (installable, works offline after first visit)
- In-app **Help** and **Advice** (no power/water/gas, summer/winter, staying warm, cold food, portable cookers, water purification & storage)

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
  version: 3,
  settings: { people, days, theme, lastCheckedAt },
  categories: [{ id, name }],
  items: [{
    id, name, categoryId, unit, qtyRequiredBase,
    scaleWithPeople, scaleWithDays, qtyInStock,
    expiryDate, notes, grabBag, priority // 'high' | 'medium' | 'low'
  }],
  contacts: [{ id, label, value }],
  notes: [{ id, title, body, updatedAt }]
}
```

Imports still accept legacy `householdNotes` strings (migrated into a note) and missing `priority` (defaults to `medium`).

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

## Help and Advice

- `/emergency/help` — how to use the app
- `/emergency/advice` — situational guidance index and topic pages

Content ships with the app so it remains available offline via the service worker.

## Privacy

No analytics backend is bundled by this project. Data does not leave your device unless **you** export a file or your browser syncs localStorage (depending on your browser/account settings).

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
