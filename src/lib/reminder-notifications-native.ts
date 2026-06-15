import type { DailyReminderPayload } from './reminder-notifications';
import { parseReminderTime } from './reminder-time';
import type { ReminderSchedule } from './reminder-schedule';

const REMINDER_ID = 1;

function isCapacitorNative(): boolean {
  const cap = (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
}

function jsWeekdayToCapacitor(weekday: number): number {
  return weekday === 1 ? 7 : weekday - 1;
}

export async function scheduleCapacitorReminder(
  schedule: ReminderSchedule,
  payload: DailyReminderPayload,
): Promise<boolean> {
  if (!isCapacitorNative() || schedule.frequency === 'off') return false;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const parsed = parseReminderTime(schedule.time);
    if (!parsed) return false;

    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') return false;

    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });

    const onSchedule: {
      on: { hour: number; minute: number; weekday?: number };
      every: 'day' | 'week';
      allowWhileIdle: boolean;
    } = {
      on: { hour: parsed.hour, minute: parsed.minute },
      every: schedule.frequency === 'weekly' ? 'week' : 'day',
      allowWhileIdle: true,
    };

    if (schedule.frequency === 'weekly') {
      onSchedule.on.weekday = jsWeekdayToCapacitor(schedule.weekday);
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_ID,
          title: payload.title,
          body: payload.body,
          schedule: onSchedule,
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
