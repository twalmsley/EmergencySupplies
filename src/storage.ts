import { createEmptyState } from './data/defaults';
import type {
  AppState,
  Category,
  Contact,
  Note,
  SupplyItem,
  ThemeMode,
} from './types';
import { APP_STATE_VERSION, STORAGE_KEY } from './types';

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function asNumber(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function asBoolean(v: unknown, fallback = false): boolean {
  return typeof v === 'boolean' ? v : fallback;
}

function parseCategory(v: unknown): Category | null {
  if (!isObject(v)) return null;
  const id = asString(v.id);
  const name = asString(v.name);
  if (!id || !name) return null;
  return { id, name };
}

function parseItem(v: unknown): SupplyItem | null {
  if (!isObject(v)) return null;
  const id = asString(v.id);
  const name = asString(v.name);
  const categoryId = asString(v.categoryId);
  if (!id || !name || !categoryId) return null;
  return {
    id,
    name,
    categoryId,
    unit: asString(v.unit, 'each'),
    qtyRequiredBase: asNumber(v.qtyRequiredBase, 1),
    scaleWithPeople: asBoolean(v.scaleWithPeople),
    scaleWithDays: asBoolean(v.scaleWithDays),
    qtyInStock: asNumber(v.qtyInStock, 0),
    expiryDate: typeof v.expiryDate === 'string' && v.expiryDate ? v.expiryDate : null,
    notes: asString(v.notes),
    grabBag: asBoolean(v.grabBag),
  };
}

function parseContact(v: unknown): Contact | null {
  if (!isObject(v)) return null;
  const id = asString(v.id);
  const label = asString(v.label);
  if (!id || !label) return null;
  return { id, label, value: asString(v.value) };
}

function parseNote(v: unknown): Note | null {
  if (!isObject(v)) return null;
  const id = asString(v.id);
  const title = asString(v.title);
  if (!id) return null;
  return {
    id,
    title: title || 'Note',
    body: asString(v.body),
    updatedAt: asString(v.updatedAt, new Date().toISOString()),
  };
}

function migrateNotes(raw: Record<string, unknown>): Note[] {
  if (Array.isArray(raw.notes)) {
    return raw.notes.map(parseNote).filter((n): n is Note => n !== null);
  }
  const legacy = asString(raw.householdNotes).trim();
  if (!legacy) return [];
  return [
    {
      id: 'migrated-household-notes',
      title: 'Household notes',
      body: legacy,
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function parseAppState(raw: unknown): AppState {
  if (!isObject(raw)) {
    throw new Error('Invalid JSON: expected an object');
  }

  const base = createEmptyState();
  const settingsRaw = isObject(raw.settings) ? raw.settings : {};
  const theme = asString(settingsRaw.theme, 'system') as ThemeMode;
  const validTheme: ThemeMode =
    theme === 'light' || theme === 'dark' || theme === 'system' ? theme : 'system';

  const categories = Array.isArray(raw.categories)
    ? raw.categories.map(parseCategory).filter((c): c is Category => c !== null)
    : base.categories;

  const items = Array.isArray(raw.items)
    ? raw.items.map(parseItem).filter((i): i is SupplyItem => i !== null)
    : [];

  const contacts = Array.isArray(raw.contacts)
    ? raw.contacts.map(parseContact).filter((c): c is Contact => c !== null)
    : base.contacts;

  return {
    version: APP_STATE_VERSION,
    settings: {
      people: Math.max(1, Math.floor(asNumber(settingsRaw.people, base.settings.people))),
      days: Math.max(1, Math.floor(asNumber(settingsRaw.days, base.settings.days))),
      theme: validTheme,
      lastCheckedAt:
        typeof settingsRaw.lastCheckedAt === 'string' ? settingsRaw.lastCheckedAt : null,
    },
    categories: categories.length > 0 ? categories : base.categories,
    items,
    contacts,
    notes: migrateNotes(raw),
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyState();
    return parseAppState(JSON.parse(raw));
  } catch {
    return createEmptyState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function exportStateJson(state: AppState): string {
  return JSON.stringify({ ...state, version: APP_STATE_VERSION }, null, 2);
}
