import type { AppSettings, UserProfile } from '../types';
import { getDailyWord } from './daily-word';
import {
  clearReminderFireMarker,
  fireReminderIfDue,
  getNotificationPermission,
  registerServiceWorker,
  requestNotificationPermission,
  type DailyReminderPayload,
} from './reminder-notifications';
import { scheduleCapacitorReminder, cancelCapacitorReminder } from './reminder-notifications-native';
import type { ReminderSchedule } from './reminder-schedule';
import { isRemindersEnabled } from './reminder-summary';

const CHECK_INTERVAL_MS = 30_000;
let checkTimer: ReturnType<typeof setInterval> | null = null;

function buildPayload(profile: UserProfile): DailyReminderPayload {
  const daily = getDailyWord(new Date(), profile);
  return {
    title: `Your word for today: ${daily.word.word} ✦`,
    body: `Repeat ${daily.word.reps}× before your first task. Let it lift you.`,
    tag: 'lumyn-daily-reminder',
  };
}

function toSchedule(settings: AppSettings): ReminderSchedule {
  return {
    frequency: settings.reminderFrequency,
    time: settings.reminderTime,
    weekday: settings.reminderWeekday,
  };
}

function stopWebScheduler(): void {
  if (checkTimer) {
    clearInterval(checkTimer);
    checkTimer = null;
  }
}

function startWebScheduler(settings: AppSettings, profile: UserProfile): void {
  stopWebScheduler();
  if (!isRemindersEnabled(settings) || getNotificationPermission() !== 'granted') return;

  const schedule = toSchedule(settings);
  const tick = () => {
    void fireReminderIfDue(schedule, buildPayload(profile));
  };

  tick();
  checkTimer = setInterval(tick, CHECK_INTERVAL_MS);
}

export async function requestRemindersPermission(): Promise<{
  ok: boolean;
  permission: ReturnType<typeof getNotificationPermission>;
  message?: string;
}> {
  await registerServiceWorker();
  const permission = await requestNotificationPermission();
  if (permission === 'unsupported') {
    return { ok: false, permission, message: 'Notifications are not supported in this browser.' };
  }
  if (permission === 'denied') {
    return {
      ok: false,
      permission,
      message: 'Enable notifications in your device or browser settings to receive reminders.',
    };
  }
  return { ok: true, permission };
}

export async function enableReminders(
  settings: AppSettings,
  profile: UserProfile,
): Promise<ReturnType<typeof requestRemindersPermission>> {
  const result = await requestRemindersPermission();
  if (!result.ok) return result;

  clearReminderFireMarker();
  const native = await scheduleCapacitorReminder(toSchedule(settings), buildPayload(profile));
  if (!native) startWebScheduler(settings, profile);

  return result;
}

export async function syncReminders(settings: AppSettings, profile: UserProfile): Promise<void> {
  await registerServiceWorker();

  if (!isRemindersEnabled(settings)) {
    stopWebScheduler();
    await cancelCapacitorReminder();
    return;
  }

  if (getNotificationPermission() !== 'granted') {
    stopWebScheduler();
    await cancelCapacitorReminder();
    return;
  }

  const payload = buildPayload(profile);
  const native = await scheduleCapacitorReminder(toSchedule(settings), payload);
  if (!native) startWebScheduler(settings, profile);
}

/** @deprecated Use enableReminders */
export const enableDailyReminders = enableReminders;

/** @deprecated Use syncReminders */
export const syncDailyReminders = syncReminders;

export async function disableDailyReminders(): Promise<void> {
  stopWebScheduler();
  await cancelCapacitorReminder();
}
