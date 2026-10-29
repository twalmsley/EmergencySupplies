import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createEmptyState, slugId } from '../data/defaults';
import {
  ensureCategoriesForSeed,
  filterSeedForProfile,
  mergeSeedItems,
  newId,
  SEED_ITEMS,
  seedItemsForCategories,
  seedToItems,
} from '../data/seed';
import { runLocalReminders } from '../notifications';
import { exportStateJson, loadState, parseAppState, saveState } from '../storage';
import type {
  AppState,
  Category,
  Contact,
  HouseholdProfile,
  Note,
  NotificationPrefs,
  SupplyItem,
  ThemeMode,
} from '../types';
import { downloadBlob, effectiveRequired, roundQty, todayIso } from '../utils';

type AppContextValue = {
  state: AppState;
  setPeople: (n: number) => void;
  setDays: (n: number) => void;
  setTheme: (t: ThemeMode) => void;
  setProfile: (patch: Partial<HouseholdProfile>) => void;
  setNotifications: (patch: Partial<NotificationPrefs>) => void;
  markChecked: () => void;
  markExported: () => void;
  addItem: (item: Omit<SupplyItem, 'id'>) => void;
  updateItem: (id: string, patch: Partial<SupplyItem>) => void;
  deleteItem: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  markFullyStocked: (id: string) => void;
  markFullyStockedMany: (ids: string[]) => void;
  addCategory: (name: string) => string;
  renameCategory: (id: string, name: string) => void;
  deleteCategory: (id: string, reassignToId: string) => void;
  addContact: (label: string, value: string) => void;
  updateContact: (id: string, patch: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addNote: (title: string, body: string) => void;
  updateNote: (id: string, patch: Partial<Pick<Note, 'title' | 'body'>>) => void;
  deleteNote: (id: string) => void;
  preseedMerge: () => number;
  preseedReplace: () => void;
  addScenarioSeed: (categoryNames: string[]) => number;
  exportJson: () => void;
  importJson: (text: string) => { ok: true } | { ok: false; error: string };
  shareBackup: () => Promise<{ ok: true; method: string } | { ok: false; error: string }>;
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
  const remindersRan = useRef(false);

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

  useEffect(() => {
    if (remindersRan.current) return;
    remindersRan.current = true;
    const snapshot = loadState();
    const result = runLocalReminders(snapshot, snapshot.settings.notifications);
    if (
      result.key &&
      result.key !== snapshot.settings.notifications.lastNotifiedKey
    ) {
      queueMicrotask(() => {
        setState((s) => ({
          ...s,
          settings: {
            ...s.settings,
            notifications: {
              ...s.settings.notifications,
              lastNotifiedKey: result.key,
            },
          },
        }));
      });
    }
  }, []);

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
      setProfile: (patch) =>
        update((s) => ({
          ...s,
          settings: {
            ...s.settings,
            profile: { ...s.settings.profile, ...patch },
          },
        })),
      setNotifications: (patch) =>
        update((s) => ({
          ...s,
          settings: {
            ...s.settings,
            notifications: { ...s.settings.notifications, ...patch },
          },
        })),
      markChecked: () =>
        update((s) => ({
          ...s,
          settings: { ...s.settings, lastCheckedAt: new Date().toISOString() },
        })),
      markExported: () =>
        update((s) => ({
          ...s,
          settings: { ...s.settings, lastExportedAt: new Date().toISOString() },
        })),
      addItem: (item) =>
        update((s) => ({
          ...s,
          items: [
            ...s.items,
            {
              ...item,
              storageLocation: item.storageLocation ?? '',
              id: newId(),
            },
          ],
        })),
      updateItem: (id, patch) =>
        update((s) => ({
          ...s,
          items: s.items.map((i) => (i.id === id ? { ...i, ...patch, id } : i)),
        })),
      deleteItem: (id) =>
        update((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) })),
      adjustStock: (id, delta) =>
        update((s) => ({
          ...s,
          items: s.items.map((i) =>
            i.id === id
              ? { ...i, qtyInStock: roundQty(Math.max(0, i.qtyInStock + delta)) }
              : i,
          ),
        })),
      markFullyStocked: (id) =>
        update((s) => {
          const { people, days } = s.settings;
          return {
            ...s,
            items: s.items.map((i) =>
              i.id === id
                ? { ...i, qtyInStock: effectiveRequired(i, people, days) }
                : i,
            ),
          };
        }),
      markFullyStockedMany: (ids) =>
        update((s) => {
          const set = new Set(ids);
          const { people, days } = s.settings;
          return {
            ...s,
            items: s.items.map((i) =>
              set.has(i.id)
                ? { ...i, qtyInStock: effectiveRequired(i, people, days) }
                : i,
            ),
          };
        }),
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
      addNote: (title, body) =>
        update((s) => ({
          ...s,
          notes: [
            ...s.notes,
            {
              id: newId(),
              title: title.trim() || 'Note',
              body,
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateNote: (id, patch) =>
        update((s) => ({
          ...s,
          notes: s.notes.map((n) =>
            n.id === id
              ? {
                  ...n,
                  ...patch,
                  id,
                  title: (patch.title ?? n.title).trim() || 'Note',
                  updatedAt: new Date().toISOString(),
                }
              : n,
          ),
        })),
      deleteNote: (id) =>
        update((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),
      preseedMerge: () => {
        const seed = filterSeedForProfile(SEED_ITEMS, state.settings.profile);
        const categories = ensureCategoriesForSeed(state.categories, seed);
        const seeded = seedToItems(seed, categories);
        const items = mergeSeedItems(state.items, seeded);
        const added = items.length - state.items.length;
        setState({ ...state, categories, items });
        return added;
      },
      preseedReplace: () =>
        update((s) => {
          const seed = filterSeedForProfile(SEED_ITEMS, s.settings.profile);
          const categories = ensureCategoriesForSeed(s.categories, seed);
          const items = seedToItems(seed, categories);
          return { ...s, categories, items };
        }),
      addScenarioSeed: (categoryNames) => {
        const seed = filterSeedForProfile(
          seedItemsForCategories(categoryNames),
          state.settings.profile,
        );
        const categories = ensureCategoriesForSeed(state.categories, seed);
        const seeded = seedToItems(seed, categories);
        const items = mergeSeedItems(state.items, seeded);
        const added = items.length - state.items.length;
        setState({ ...state, categories, items });
        return added;
      },
      exportJson: () => {
        const json = exportStateJson(state);
        downloadBlob(
          `emergency-supplies-${todayIso()}.json`,
          new Blob([json], { type: 'application/json' }),
        );
        setState((s) => ({
          ...s,
          settings: { ...s.settings, lastExportedAt: new Date().toISOString() },
        }));
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
      shareBackup: async () => {
        const json = exportStateJson(state);
        const filename = `emergency-supplies-${todayIso()}.json`;
        const blob = new Blob([json], { type: 'application/json' });
        const markExported = () => {
          setState((s) => ({
            ...s,
            settings: {
              ...s.settings,
              lastExportedAt: new Date().toISOString(),
            },
          }));
        };

        // Try Web Share first. If the OS rejects it (common NotAllowedError on
        // desktop), fall through — do not treat that as a hard failure.
        if (navigator.share && navigator.canShare) {
          try {
            const file = new File([blob], filename, { type: 'application/json' });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: 'Be Prepared backup',
                text: 'Emergency supplies backup JSON',
              });
              markExported();
              return { ok: true, method: 'share' };
            }
          } catch (e) {
            if (e instanceof Error && e.name === 'AbortError') {
              return { ok: false, error: 'Share cancelled' };
            }
            // NotAllowedError / other share failures → try clipboard, then download
          }
        }

        // Clipboard needs a secure context + recent user gesture. Prefer the
        // synchronous ClipboardItem path so Safari keeps transient activation.
        if (window.isSecureContext && navigator.clipboard) {
          try {
            if (typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
              await navigator.clipboard.write([
                new ClipboardItem({
                  'text/plain': Promise.resolve(
                    new Blob([json], { type: 'text/plain' }),
                  ),
                }),
              ]);
            } else if (navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(json);
            } else {
              throw new Error('Clipboard write unavailable');
            }
            markExported();
            return { ok: true, method: 'clipboard' };
          } catch {
            // Fall through to download
          }
        }

        downloadBlob(filename, blob);
        markExported();
        return { ok: true, method: 'download' };
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
