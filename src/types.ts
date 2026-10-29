export type ThemeMode = 'light' | 'dark' | 'system';

export type Category = {
  id: string;
  name: string;
};

export type ItemPriority = 'high' | 'medium' | 'low';

export type SupplyItem = {
  id: string;
  name: string;
  categoryId: string;
  unit: string;
  qtyRequiredBase: number;
  scaleWithPeople: boolean;
  scaleWithDays: boolean;
  qtyInStock: number;
  expiryDate: string | null;
  notes: string;
  grabBag: boolean;
  priority: ItemPriority;
};

export type Contact = {
  id: string;
  label: string;
  value: string;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
};

export type AppSettings = {
  people: number;
  days: number;
  theme: ThemeMode;
  lastCheckedAt: string | null;
};

export type AppState = {
  version: number;
  settings: AppSettings;
  categories: Category[];
  items: SupplyItem[];
  contacts: Contact[];
  notes: Note[];
};

export type StockFilter =
  | 'all'
  | 'understocked'
  | 'expired'
  | 'expiring'
  | 'grabBag'
  | 'shopping';

export type SortKey =
  | 'name'
  | 'category'
  | 'priority'
  | 'qtyRequired'
  | 'qtyInStock'
  | 'expiryDate'
  | 'notes'
  | 'unit'
  | 'grabBag';

export type SortDir = 'asc' | 'desc';

export const PRIORITY_ORDER: Record<ItemPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const APP_STATE_VERSION = 3;
export const STORAGE_KEY = 'emergency-supplies-state';
export const EXPIRING_SOON_DAYS = 90;
export const CHECK_REMINDER_DAYS = 180;
