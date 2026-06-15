import type { UserProfile } from '../types';
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

function stopWebScheduler(): void {
  if (checkTimer) {
    clearInterval(checkTimer);
    checkTimer = null;
  }
}

function startWebScheduler(enabled: boolean, time: string, profile: UserProfile): void {
  stopWebScheduler();
  if (!enabled || getNotificationPermission() !== 'granted') return;

  const tick = () => {
    void fireReminderIfDue(enabled, time, buildPayload(profile));
  };

  tick();
  checkTimer = setInterval(tick, CHECK_INTERVAL_MS);
}

export async function enableDailyReminders(profile: UserProfile, time: string): Promise<{
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
    return { ok: false, permission, message: 'Enable notifications in your device settings to get daily reminders.' };
  }

  clearReminderFireMarker();
  const native = await scheduleCapacitorReminder(time, buildPayload(profile));
  if (!native) startWebScheduler(true, time, profile);

  return { ok: true, permission };
}

export async function syncDailyReminders(
  enabled: boolean,
  time: string,
  profile: UserProfile,
): Promise<void> {
  await registerServiceWorker();

  if (!enabled) {
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
  const native = await scheduleCapacitorReminder(time, payload);
  if (!native) startWebScheduler(true, time, profile);
}

export async function disableDailyReminders(): Promise<void> {
  stopWebScheduler();
  await cancelCapacitorReminder();
}
