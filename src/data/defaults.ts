import type { AppState, Category } from '../types';
import {
  APP_STATE_VERSION,
  DEFAULT_HOUSEHOLD_PROFILE,
  DEFAULT_NOTIFICATION_PREFS,
} from '../types';

export const DEFAULT_CATEGORY_NAMES = [
  'Food',
  'Drinks',
  'Medical',
  'Hygiene',
  'Power',
  'Heat+Light',
  'Communications',
  'Money',
  'Baby',
  'Pet',
  'Documents',
] as const;

export function createDefaultCategories(): Category[] {
  return DEFAULT_CATEGORY_NAMES.map((name) => ({
    id: slugId(name),
    name,
  }));
}

export function slugId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function createEmptyState(): AppState {
  return {
    version: APP_STATE_VERSION,
    settings: {
      people: 2,
      days: 3,
      theme: 'system',
      lastCheckedAt: null,
      lastExportedAt: null,
      profile: { ...DEFAULT_HOUSEHOLD_PROFILE },
      notifications: { ...DEFAULT_NOTIFICATION_PREFS },
    },
    categories: createDefaultCategories(),
    items: [],
    contacts: [
      { id: 'power-cut', label: 'Power cut (GB)', value: '105' },
      { id: 'emergency', label: 'Emergency services', value: '999' },
    ],
    notes: [],
  };
}
