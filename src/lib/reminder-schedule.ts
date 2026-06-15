import type { ReminderFrequency } from '../types';

export interface ReminderSchedule {
  frequency: ReminderFrequency;
  time: string;
  weekday: number;
}

export function shouldFireReminder(schedule: ReminderSchedule, now = new Date()): boolean {
  if (schedule.frequency === 'off') return false;

  const parsed = schedule.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!parsed) return false;

  let hours = parseInt(parsed[1], 10);
  const minutes = parseInt(parsed[2], 10);
  const period = parsed[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  if (schedule.frequency === 'weekly') {
    const jsDay = now.getDay();
    const calendarWeekday = jsDay === 0 ? 1 : jsDay + 1;
    if (calendarWeekday !== schedule.weekday) return false;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = hours * 60 + minutes;
  return currentMinutes >= targetMinutes;
}
