import type { AppState, NotificationPrefs } from './types';
import { isExpired, isExpiringSoon, needsCheckReminder } from './utils';

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
}

function buildReminderKey(kinds: string[]): string {
  return `${new Date().toISOString().slice(0, 10)}:${kinds.sort().join(',')}`;
}

/**
 * Fire local (non-push) notifications on app launch when opted in.
 * Returns the fingerprint to store so we do not re-notify the same day for the same kinds.
 */
export function runLocalReminders(
  state: AppState,
  prefs: NotificationPrefs,
): { fired: boolean; key: string | null } {
  if (!prefs.enabled || !notificationsSupported()) {
    return { fired: false, key: null };
  }
  if (Notification.permission !== 'granted') {
    return { fired: false, key: null };
  }

  const kinds: string[] = [];
  const bodies: string[] = [];

  if (prefs.kitCheck && needsCheckReminder(state.settings.lastCheckedAt)) {
    kinds.push('kit');
    bodies.push('Your emergency kit check is due (about every six months).');
  }

  const expired = state.items.filter((i) => isExpired(i));
  if (prefs.expired && expired.length > 0) {
    kinds.push('expired');
    bodies.push(
      `${expired.length} item${expired.length === 1 ? '' : 's'} past expiry (e.g. ${expired[0].name}).`,
    );
  }

  const expiring = state.items.filter(
    (i) =>
      !isExpired(i) && isExpiringSoon(i, new Date(), prefs.expiringLeadDays),
  );
  if (prefs.expiring && expiring.length > 0) {
    kinds.push('expiring');
    bodies.push(
      `${expiring.length} item${expiring.length === 1 ? '' : 's'} expiring within ${prefs.expiringLeadDays} days.`,
    );
  }

  if (kinds.length === 0) return { fired: false, key: null };

  const key = buildReminderKey(kinds);
  if (prefs.lastNotifiedKey === key) {
    return { fired: false, key };
  }

  try {
    new Notification('Be Prepared', {
      body: bodies.join(' '),
      tag: 'be-prepared-reminders',
    });
    return { fired: true, key };
  } catch {
    return { fired: false, key: null };
  }
}
