import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AppState, SupplyItem } from './types';
import { effectiveRequired, formatDate, todayIso } from './utils';

export type PdfRow = {
  item: SupplyItem;
  categoryName: string;
  qtyRequired: number;
};

export function exportItemsPdf(state: AppState, rows: PdfRow[]) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
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
    body: rows.map(({ item, categoryName, qtyRequired }) => [
      item.name,
      categoryName,
      item.priority,
      item.unit,
      String(qtyRequired),
      String(item.qtyInStock),
      formatDate(item.expiryDate),
      item.grabBag ? 'Yes' : '',
      item.notes,
    ]),
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
