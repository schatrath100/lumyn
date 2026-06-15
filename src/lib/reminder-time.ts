/** Shift reminder time by 30-minute steps (matches onboarding picker). */
export function adjustReminderTime(current: string, deltaSteps: number): string {
  const match = current.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return current;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  let total = hours * 60 + minutes + deltaSteps * 30;
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);

  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const h12 = h24 % 12 || 12;
  const p = h24 >= 12 ? 'PM' : 'AM';

  return `${h12}:${m.toString().padStart(2, '0')} ${p}`;
}

/** Parse "8:00 AM" into 24h hour + minute. */
export function parseReminderTime(time: string): { hour: number; minute: number } | null {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return { hour: hours, minute: minutes };
}

/** Next local Date at the given reminder clock time (today or tomorrow). */
export function nextReminderDate(time: string, from = new Date()): Date | null {
  const parsed = parseReminderTime(time);
  if (!parsed) return null;

  const next = new Date(from);
  next.setSeconds(0, 0);
  next.setHours(parsed.hour, parsed.minute, 0, 0);
  if (next.getTime() <= from.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}
