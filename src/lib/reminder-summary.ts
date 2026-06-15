import type { AppSettings } from '../types';

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatReminderSummary(settings: AppSettings): string {
  if (settings.reminderFrequency === 'off') return 'Off';
  const time = settings.reminderTime;
  if (settings.reminderFrequency === 'weekly') {
    const day = WEEKDAY_NAMES[(settings.reminderWeekday - 1 + 7) % 7] ?? 'Mon';
    return `${day} · ${time}`;
  }
  return `Daily · ${time}`;
}

export function isRemindersEnabled(settings: AppSettings): boolean {
  return settings.reminderFrequency !== 'off';
}
