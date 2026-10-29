import type { AppState, HouseholdProfile, SupplyItem } from './types';
import {
  BACKUP_REMINDER_DAYS,
  CHECK_REMINDER_DAYS,
  EXPIRING_SOON_DAYS,
  GRAB_BAG_WEIGHT_BONUS,
  PRIORITY_WEIGHTS,
} from './types';

export function effectiveRequired(
  item: SupplyItem,
  people: number,
  days: number,
): number {
  const p = item.scaleWithPeople ? Math.max(1, people) : 1;
  const d = item.scaleWithDays ? Math.max(1, days) : 1;
  return roundQty(item.qtyRequiredBase * p * d);
}

export function roundQty(n: number): number {
  return Math.round(n * 100) / 100;
}

export function isUnderstocked(
  item: SupplyItem,
  people: number,
  days: number,
): boolean {
  return item.qtyInStock < effectiveRequired(item, people, days);
}

export function qtyNeeded(
  item: SupplyItem,
  people: number,
  days: number,
): number {
  return roundQty(Math.max(0, effectiveRequired(item, people, days) - item.qtyInStock));
}

export function itemWeight(item: SupplyItem): number {
  return PRIORITY_WEIGHTS[item.priority] + (item.grabBag ? GRAB_BAG_WEIGHT_BONUS : 0);
}

export function daysUntilExpiry(expiryDate: string | null, now = new Date()): number | null {
  if (!expiryDate) return null;
  const exp = new Date(expiryDate + 'T00:00:00');
  if (Number.isNaN(exp.getTime())) return null;
  const diff = exp.getTime() - new Date(now.toDateString()).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isExpired(item: SupplyItem, now = new Date()): boolean {
  const d = daysUntilExpiry(item.expiryDate, now);
  return d !== null && d < 0;
}

export function isExpiringSoon(
  item: SupplyItem,
  now = new Date(),
  withinDays = EXPIRING_SOON_DAYS,
): boolean {
  const d = daysUntilExpiry(item.expiryDate, now);
  return d !== null && d >= 0 && d <= withinDays;
}

export function readinessStats(state: AppState) {
  const { people, days } = state.settings;
  const total = state.items.length;
  if (total === 0) {
    return {
      total: 0,
      fullyStocked: 0,
      shortfalls: 0,
      expired: 0,
      expiringSoon: 0,
      percent: 0,
      weightTotal: 0,
      weightStocked: 0,
      criticalGaps: [] as SupplyItem[],
    };
  }
  let fullyStocked = 0;
  let shortfalls = 0;
  let expired = 0;
  let expiringSoon = 0;
  let weightTotal = 0;
  let weightStocked = 0;
  const criticalGaps: SupplyItem[] = [];

  for (const item of state.items) {
    const w = itemWeight(item);
    weightTotal += w;
    const under = isUnderstocked(item, people, days);
    if (under) {
      shortfalls += 1;
      if (item.priority === 'high') criticalGaps.push(item);
    } else {
      fullyStocked += 1;
      weightStocked += w;
    }
    if (isExpired(item)) expired += 1;
    else if (isExpiringSoon(item)) expiringSoon += 1;
  }

  criticalGaps.sort(
    (a, b) => itemWeight(b) - itemWeight(a) || a.name.localeCompare(b.name),
  );

  return {
    total,
    fullyStocked,
    shortfalls,
    expired,
    expiringSoon,
    percent: weightTotal > 0 ? Math.round((weightStocked / weightTotal) * 100) : 0,
    weightTotal,
    weightStocked,
    criticalGaps: criticalGaps.slice(0, 5),
  };
}

export function needsCheckReminder(lastCheckedAt: string | null, now = new Date()): boolean {
  if (!lastCheckedAt) return true;
  const last = new Date(lastCheckedAt);
  if (Number.isNaN(last.getTime())) return true;
  const days = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
  return days >= CHECK_REMINDER_DAYS;
}

export function needsBackupReminder(
  lastExportedAt: string | null,
  now = new Date(),
): boolean {
  if (!lastExportedAt) return true;
  const last = new Date(lastExportedAt);
  if (Number.isNaN(last.getTime())) return true;
  const days = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
  return days >= BACKUP_REMINDER_DAYS;
}

export function isProfileActive(profile: HouseholdProfile): boolean {
  return profile.infants || profile.schoolAge || profile.pets || profile.medical;
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return iso;
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
