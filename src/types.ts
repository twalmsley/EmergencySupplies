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
  /** Free-text where the item is kept (garage, cupboard, car…). */
  storageLocation: string;
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

export type HouseholdProfile = {
  infants: boolean;
  schoolAge: boolean;
  pets: boolean;
  medical: boolean;
};

export type NotificationPrefs = {
  /** Master opt-in; permission must also be granted by the browser. */
  enabled: boolean;
  kitCheck: boolean;
  expired: boolean;
  expiring: boolean;
  expiringLeadDays: number;
  /** Last notification fingerprint (date + kinds) to avoid daily spam. */
  lastNotifiedKey: string | null;
};

export type AppSettings = {
  people: number;
  days: number;
  theme: ThemeMode;
  lastCheckedAt: string | null;
  lastExportedAt: string | null;
  profile: HouseholdProfile;
  notifications: NotificationPrefs;
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
  | 'grabBag';

export type SortKey =
  | 'name'
  | 'category'
  | 'priority'
  | 'qtyRequired'
  | 'qtyInStock'
  | 'expiryDate'
  | 'notes'
  | 'unit'
  | 'grabBag'
  | 'storageLocation';

export type SortDir = 'asc' | 'desc';

export const PRIORITY_ORDER: Record<ItemPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

/** Weights for readiness % (high gaps hurt the score more). */
export const PRIORITY_WEIGHTS: Record<ItemPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const GRAB_BAG_WEIGHT_BONUS = 1;

export const DEFAULT_HOUSEHOLD_PROFILE: HouseholdProfile = {
  infants: false,
  schoolAge: false,
  pets: false,
  medical: false,
};

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  enabled: false,
  kitCheck: true,
  expired: true,
  expiring: true,
  expiringLeadDays: 30,
  lastNotifiedKey: null,
};

export const APP_STATE_VERSION = 4;
export const STORAGE_KEY = 'emergency-supplies-state';
export const EXPIRING_SOON_DAYS = 90;
export const CHECK_REMINDER_DAYS = 180;
export const BACKUP_REMINDER_DAYS = 14;
