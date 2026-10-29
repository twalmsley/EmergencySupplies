import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AppState, SupplyItem } from './types';
import { effectiveRequired, formatDate, todayIso } from './utils';

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
  doc.text('Be Ready — Supplies List', 14, 16);
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
            item.grabBag ? 'Yes' : '',
            item.notes,
          ])
        : [['No items in current view', '', '', '', '', '', '', '', '']],
    styles: { fontSize: 8, cellPadding: 1.5, overflow: 'linebreak' },
    headStyles: { fillColor: [30, 90, 60] },
    columnStyles: {
      0: { cellWidth: 36 },
      1: { cellWidth: 24 },
      2: { cellWidth: 16 },
      3: { cellWidth: 14 },
      4: { cellWidth: 16 },
      5: { cellWidth: 16 },
      6: { cellWidth: 20 },
      7: { cellWidth: 14 },
      8: { cellWidth: 'auto' },
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
