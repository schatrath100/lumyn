import { shouldFireReminder as checkSchedule } from './reminder-schedule';
import type { ReminderSchedule } from './reminder-schedule';

const LAST_FIRED_KEY = 'lumyn-reminder-last-fired';

export type NotificationPermissionState = 'unsupported' | 'default' | 'granted' | 'denied';

export function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission as NotificationPermissionState;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (getNotificationPermission() === 'unsupported') return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  return result as NotificationPermissionState;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    return await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  } catch {
    return null;
  }
}

export interface DailyReminderPayload {
  title: string;
  body: string;
  tag: string;
}

export async function showDailyReminder(payload: DailyReminderPayload): Promise<void> {
  const registration = await navigator.serviceWorker?.ready.catch(() => null);
  if (registration?.showNotification) {
    await registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      data: { url: '/' },
    });
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      icon: '/favicon.svg',
    });
  }
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function alreadyFiredToday(): boolean {
  return localStorage.getItem(LAST_FIRED_KEY) === todayKey();
}

function markFiredToday(): void {
  localStorage.setItem(LAST_FIRED_KEY, todayKey());
}

export function clearReminderFireMarker(): void {
  localStorage.removeItem(LAST_FIRED_KEY);
}

export function shouldFireReminder(schedule: ReminderSchedule, now = new Date()): boolean {
  if (getNotificationPermission() !== 'granted') return false;
  if (alreadyFiredToday()) return false;
  return checkSchedule(schedule, now);
}

/** @deprecated Use shouldFireReminder with ReminderSchedule */
export function shouldFireReminderLegacy(enabled: boolean, time: string, now = new Date()): boolean {
  return shouldFireReminder(
    { frequency: enabled ? 'daily' : 'off', time, weekday: 2 },
    now,
  );
}

export async function fireReminderIfDue(
  schedule: ReminderSchedule,
  payload: DailyReminderPayload,
): Promise<boolean> {
  if (!shouldFireReminder(schedule)) return false;
  await showDailyReminder(payload);
  markFiredToday();
  return true;
}
