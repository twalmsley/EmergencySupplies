import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createEmptyState, slugId } from '../data/defaults';
import {
  ensureCategoriesForSeed,
  mergeSeedItems,
  newId,
  SEED_ITEMS,
  seedToItems,
} from '../data/seed';
import { exportStateJson, loadState, parseAppState, saveState } from '../storage';
import type {
  AppState,
  Category,
  Contact,
  SupplyItem,
  ThemeMode,
} from '../types';
import { downloadBlob, todayIso } from '../utils';

type AppContextValue = {
  state: AppState;
  setPeople: (n: number) => void;
  setDays: (n: number) => void;
  setTheme: (t: ThemeMode) => void;
  markChecked: () => void;
  addItem: (item: Omit<SupplyItem, 'id'>) => void;
  updateItem: (id: string, patch: Partial<SupplyItem>) => void;
  deleteItem: (id: string) => void;
  addCategory: (name: string) => string;
  renameCategory: (id: string, name: string) => void;
  deleteCategory: (id: string, reassignToId: string) => void;
  addContact: (label: string, value: string) => void;
  updateContact: (id: string, patch: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  setHouseholdNotes: (notes: string) => void;
  preseedMerge: () => number;
  preseedReplace: () => void;
  exportJson: () => void;
  importJson: (text: string) => { ok: true } | { ok: false; error: string };
  resetAll: () => void;
  resolvedTheme: 'light' | 'dark';
};

const AppContext = createContext<AppContextValue | null>(null);

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'light' || mode === 'dark') return mode;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    resolveTheme(loadState().settings.theme),
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const apply = () => {
      const resolved = resolveTheme(state.settings.theme);
      setResolvedTheme(resolved);
      document.documentElement.dataset.theme = resolved;
    };
    apply();
    if (state.settings.theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [state.settings.theme]);

  const update = useCallback((fn: (prev: AppState) => AppState) => {
    setState((prev) => fn(prev));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      resolvedTheme,
      setPeople: (n) =>
        update((s) => ({
          ...s,
          settings: { ...s.settings, people: Math.max(1, Math.floor(n) || 1) },
        })),
      setDays: (n) =>
        update((s) => ({
          ...s,
          settings: { ...s.settings, days: Math.max(1, Math.floor(n) || 1) },
        })),
      setTheme: (t) =>
        update((s) => ({ ...s, settings: { ...s.settings, theme: t } })),
      markChecked: () =>
        update((s) => ({
          ...s,
          settings: { ...s.settings, lastCheckedAt: new Date().toISOString() },
        })),
      addItem: (item) =>
        update((s) => ({ ...s, items: [...s.items, { ...item, id: newId() }] })),
      updateItem: (id, patch) =>
        update((s) => ({
          ...s,
          items: s.items.map((i) => (i.id === id ? { ...i, ...patch, id } : i)),
        })),
      deleteItem: (id) =>
        update((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) })),
      addCategory: (name) => {
        const trimmed = name.trim();
        const id = slugId(trimmed) || newId();
        update((s) => {
          if (s.categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
            return s;
          }
          return { ...s, categories: [...s.categories, { id, name: trimmed }] };
        });
        return id;
      },
      renameCategory: (id, name) =>
        update((s) => ({
          ...s,
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, name: name.trim() } : c,
          ),
        })),
      deleteCategory: (id, reassignToId) =>
        update((s) => ({
          ...s,
          categories: s.categories.filter((c) => c.id !== id),
          items: s.items.map((i) =>
            i.categoryId === id ? { ...i, categoryId: reassignToId } : i,
          ),
        })),
      addContact: (label, value) =>
        update((s) => ({
          ...s,
          contacts: [...s.contacts, { id: newId(), label, value }],
        })),
      updateContact: (id, patch) =>
        update((s) => ({
          ...s,
          contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...patch, id } : c)),
        })),
      deleteContact: (id) =>
        update((s) => ({ ...s, contacts: s.contacts.filter((c) => c.id !== id) })),
      setHouseholdNotes: (notes) => update((s) => ({ ...s, householdNotes: notes })),
      preseedMerge: () => {
        const categories = ensureCategoriesForSeed(state.categories, SEED_ITEMS);
        const seeded = seedToItems(SEED_ITEMS, categories);
        const items = mergeSeedItems(state.items, seeded);
        const added = items.length - state.items.length;
        setState({ ...state, categories, items });
        return added;
      },
      preseedReplace: () =>
        update((s) => {
          const categories = ensureCategoriesForSeed(s.categories, SEED_ITEMS);
          const items = seedToItems(SEED_ITEMS, categories);
          return { ...s, categories, items };
        }),
      exportJson: () => {
        const json = exportStateJson(state);
        downloadBlob(
          `emergency-supplies-${todayIso()}.json`,
          new Blob([json], { type: 'application/json' }),
        );
      },
      importJson: (text) => {
        try {
          const parsed = parseAppState(JSON.parse(text));
          const backup = exportStateJson(state);
          downloadBlob(
            `emergency-supplies-backup-${todayIso()}.json`,
            new Blob([backup], { type: 'application/json' }),
          );
          setState(parsed);
          return { ok: true };
        } catch (e) {
          return {
            ok: false,
            error: e instanceof Error ? e.message : 'Failed to import JSON',
          };
        }
      },
      resetAll: () => setState(createEmptyState()),
    }),
    [state, resolvedTheme, update],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export type { Category };
