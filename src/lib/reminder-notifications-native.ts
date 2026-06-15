import type { DailyReminderPayload } from './reminder-notifications';
import { parseReminderTime } from './reminder-time';

const REMINDER_ID = 1;

function isCapacitorNative(): boolean {
  const cap = (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
}

export async function scheduleCapacitorReminder(
  time: string,
  payload: DailyReminderPayload,
): Promise<boolean> {
  if (!isCapacitorNative()) return false;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const parsed = parseReminderTime(time);
    if (!parsed) return false;

    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') return false;

    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_ID,
          title: payload.title,
          body: payload.body,
          schedule: {
            on: { hour: parsed.hour, minute: parsed.minute },
            every: 'day',
            allowWhileIdle: true,
          },
          extra: { url: '/' },
        },
      ],
    });
    return true;
  } catch {
    return false;
  }
}

export async function cancelCapacitorReminder(): Promise<void> {
  if (!isCapacitorNative()) return;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
  } catch {
    /* native plugin unavailable */
  }
}
