import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AppState, SupplyItem } from './types';
import { effectiveRequired, formatDate, qtyNeeded, todayIso } from './utils';

export type PdfRow = {
  item: SupplyItem;
  categoryName: string;
  qtyRequired: number;
};

type JsPdfWithAutoTable = jsPDF & {
  lastAutoTable?: { finalY: number };
};

function nextTableStartY(doc: JsPdfWithAutoTable, fallback = 26): number {
  const y = doc.lastAutoTable?.finalY;
  return typeof y === 'number' ? y + 10 : fallback;
}

export function exportItemsPdf(state: AppState, rows: PdfRow[]) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' }) as JsPdfWithAutoTable;
  const { people, days } = state.settings;

  doc.setFontSize(16);
  doc.text('Be Prepared — Supplies List', 14, 16);
  doc.setFontSize(10);
  doc.text(
    `Household: ${people} people · ${days} days · Exported ${todayIso()} · ${rows.length} items`,
    14,
    22,
  );

  autoTable(doc, {
    startY: 26,
    head: [
      [
        'Name',
        'Category',
        'Priority',
        'Unit',
        'Required',
        'In stock',
        'Expiry',
        'Location',
        'Grab bag',
        'Notes',
      ],
    ],
    body:
      rows.length > 0
        ? rows.map(({ item, categoryName, qtyRequired }) => [
            item.name,
            categoryName,
            item.priority,
            item.unit,
            String(qtyRequired),
            String(item.qtyInStock),
            formatDate(item.expiryDate),
            item.storageLocation || '',
            item.grabBag ? 'Yes' : '',
            item.notes,
          ])
        : [['No items in current view', '', '', '', '', '', '', '', '', '']],
    styles: { fontSize: 7.5, cellPadding: 1.3, overflow: 'linebreak' },
    headStyles: { fillColor: [30, 90, 60] },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 20 },
      2: { cellWidth: 14 },
      3: { cellWidth: 12 },
      4: { cellWidth: 14 },
      5: { cellWidth: 14 },
      6: { cellWidth: 18 },
      7: { cellWidth: 22 },
      8: { cellWidth: 12 },
      9: { cellWidth: 'auto' },
    },
  });

  let y = nextTableStartY(doc);
  doc.setFontSize(13);
  doc.text('Contacts', 14, y);
  autoTable(doc, {
    startY: y + 3,
    head: [['Label', 'Detail']],
    body:
      state.contacts.length > 0
        ? state.contacts.map((c) => [c.label, c.value])
        : [['No contacts saved', '']],
    styles: { fontSize: 9, cellPadding: 1.5, overflow: 'linebreak' },
    headStyles: { fillColor: [30, 90, 60] },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 'auto' },
    },
  });

  y = nextTableStartY(doc);
  doc.setFontSize(13);
  doc.text('Notes', 14, y);
  autoTable(doc, {
    startY: y + 3,
    head: [['Title', 'Note', 'Updated']],
    body:
      state.notes.length > 0
        ? state.notes.map((n) => [
            n.title,
            n.body,
            new Date(n.updatedAt).toLocaleString(),
          ])
        : [['No notes saved', '', '']],
    styles: { fontSize: 9, cellPadding: 1.5, overflow: 'linebreak' },
    headStyles: { fillColor: [30, 90, 60] },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 40 },
    },
  });

  doc.save(`emergency-supplies-${todayIso()}.pdf`);
}

export function exportShoppingPdf(state: AppState, rows: PdfRow[]) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' }) as JsPdfWithAutoTable;
  const { people, days } = state.settings;

  doc.setFontSize(16);
  doc.text('Be Prepared — Shopping list', 14, 16);
  doc.setFontSize(10);
  doc.text(
    `${people} people · ${days} days · ${todayIso()} · ${rows.length} items to buy`,
    14,
    22,
  );

  autoTable(doc, {
    startY: 26,
    head: [['Name', 'Category', 'Buy', 'Unit', 'Notes']],
    body:
      rows.length > 0
        ? rows.map(({ item, categoryName }) => [
            item.name,
            categoryName,
            String(qtyNeeded(item, people, days)),
            item.unit,
            item.notes,
          ])
        : [['Nothing to buy', '', '', '', '']],
    styles: { fontSize: 9, cellPadding: 1.5, overflow: 'linebreak' },
    headStyles: { fillColor: [30, 90, 60] },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 28 },
      2: { cellWidth: 16 },
      3: { cellWidth: 16 },
      4: { cellWidth: 'auto' },
    },
  });

  doc.save(`emergency-shopping-${todayIso()}.pdf`);
}

export function exportGrabBagPdf(state: AppState, rows: PdfRow[]) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' }) as JsPdfWithAutoTable;
  const { people, days } = state.settings;

  doc.setFontSize(16);
  doc.text('Be Prepared — Grab bag packing', 14, 16);
  doc.setFontSize(10);
  doc.text(`${people} people · ${days} days · ${todayIso()}`, 14, 22);

  autoTable(doc, {
    startY: 26,
    head: [['Packed', 'Name', 'Stock / Req', 'Location', 'Notes']],
    body:
      rows.length > 0
        ? rows.map(({ item, categoryName: _c, qtyRequired }) => [
            '☐',
            item.name,
            `${item.qtyInStock} / ${qtyRequired}`,
            item.storageLocation || '',
            item.notes,
          ])
        : [['', 'No grab-bag items flagged', '', '', '']],
    styles: { fontSize: 9, cellPadding: 1.5, overflow: 'linebreak' },
    headStyles: { fillColor: [30, 90, 60] },
    columnStyles: {
      0: { cellWidth: 16 },
      1: { cellWidth: 50 },
      2: { cellWidth: 24 },
      3: { cellWidth: 30 },
      4: { cellWidth: 'auto' },
    },
  });

  doc.save(`emergency-grab-bag-${todayIso()}.pdf`);
}

export function buildPdfRows(
  state: AppState,
  items: SupplyItem[],
): PdfRow[] {
  const cat = new Map(state.categories.map((c) => [c.id, c.name]));
  const { people, days } = state.settings;
  return items.map((item) => ({
    item,
    categoryName: cat.get(item.categoryId) ?? '—',
    qtyRequired: effectiveRequired(item, people, days),
  }));
}
