import { useApp } from '../context/AppContext';
import {
  notificationsSupported,
  requestNotificationPermission,
} from '../notifications';
import { CollapsiblePanel } from './CollapsiblePanel';

export function HouseholdSettings() {
  const { state, setProfile, setNotifications } = useApp();
  const { profile, notifications } = state.settings;
  const supported = notificationsSupported();

  return (
    <CollapsiblePanel title="Household & reminders">
      <fieldset className="settings-fieldset">
        <legend>Household profile</legend>
        <p className="muted" style={{ marginTop: 0 }}>
          Optional. When any option is on, preseed skips Baby/Pet unless you opt
          in, and Advice can highlight matching topics.
        </p>
        {(
          [
            ['infants', 'Infants / babies'],
            ['schoolAge', 'School-age children'],
            ['pets', 'Pets'],
            ['medical', 'Medical / mobility needs'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="check">
            <input
              type="checkbox"
              checked={profile[key]}
              onChange={(e) => setProfile({ [key]: e.target.checked })}
            />
            {label}
          </label>
        ))}
      </fieldset>

      <fieldset className="settings-fieldset">
        <legend>Local notifications</legend>
        <p className="muted" style={{ marginTop: 0 }}>
          Opt-in only. Reminders run in this browser when you open the app — no
          push server, no email.
          {!supported ? ' Not supported in this browser.' : null}
        </p>
        <label className="check">
          <input
            type="checkbox"
            checked={notifications.enabled}
            disabled={!supported}
            onChange={async (e) => {
              const want = e.target.checked;
              if (want) {
                const perm = await requestNotificationPermission();
                if (perm !== 'granted') {
                  setNotifications({ enabled: false });
                  return;
                }
              }
              setNotifications({ enabled: want });
            }}
          />
          Enable reminders
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={notifications.kitCheck}
            disabled={!notifications.enabled}
            onChange={(e) => setNotifications({ kitCheck: e.target.checked })}
          />
          Kit check due
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={notifications.expired}
            disabled={!notifications.enabled}
            onChange={(e) => setNotifications({ expired: e.target.checked })}
          />
          Expired items
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={notifications.expiring}
            disabled={!notifications.enabled}
            onChange={(e) => setNotifications({ expiring: e.target.checked })}
          />
          Expiring soon
        </label>
        <label>
          Expiry lead time (days)
          <input
            type="number"
            min={1}
            max={365}
            value={notifications.expiringLeadDays}
            disabled={!notifications.enabled}
            onChange={(e) =>
              setNotifications({
                expiringLeadDays: Math.max(1, Math.floor(Number(e.target.value) || 1)),
              })
            }
          />
        </label>
      </fieldset>
    </CollapsiblePanel>
  );
}
