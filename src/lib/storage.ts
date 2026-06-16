import type { PersistedState, ReminderFrequency, SynchronicityEntry } from '../types';
import { resetDeviceAuth } from './device-auth';
import { clearSubscriptionCache } from './purchases';

const STORAGE_KEY = 'lumyn-state-v2';

export const defaultState: PersistedState = {
  profile: {
    firstName: '',
    lastName: '',
    email: '',
    avatarEmoji: '🌙',
    selectedIntentions: [],
    userName: '',
    birthDate: '',
    numerologySystem: 'chaldean',
    personalNumber: null,
    lifePathNumber: null,
    onboardingComplete: false,
    isSubscribed: false,
    trialStartDate: null,
    subscriptionPlan: null,
  },
  settings: {
    darkMode: false,
    reminderFrequency: 'off',
    reminderTime: '8:00 AM',
    reminderWeekday: 2,
    mantraAmbient: false,
    mantraBinaural: false,
    cloudBackupEnabled: false,
  },
  savedCombos: [],
  journalEntries: [],
  synchronicityEntries: [],
  communityUpvotes: [],
  moodCheckins: [],
  streak: 0,
  lastActiveDate: null,
  savedWords: [],
};

function stripSeedData(state: PersistedState): PersistedState {
  const isSeed = (id: string) => id.startsWith('seed-');
  const savedCombos = state.savedCombos.filter((c) => !isSeed(c.id));
  const journalEntries = state.journalEntries.filter((e) => !isSeed(e.id));
  const synchronicityEntries = state.synchronicityEntries.filter((e) => !isSeed(e.id));
  const streak = state.streak === 12 && state.lastActiveDate == null ? 0 : state.streak;

  if (
    savedCombos.length === state.savedCombos.length &&
    journalEntries.length === state.journalEntries.length &&
    synchronicityEntries.length === state.synchronicityEntries.length &&
    streak === state.streak
  ) {
    return state;
  }

  return { ...state, savedCombos, journalEntries, synchronicityEntries, streak };
}

function normalizeStringIds(parsed: Record<string, unknown>): PersistedState {
  const asState = parsed as unknown as PersistedState;
  return {
    ...asState,
    savedCombos: (asState.savedCombos ?? []).map((c) => ({ ...c, id: String(c.id) })),
    journalEntries: (asState.journalEntries ?? []).map((e) => ({ ...e, id: String(e.id) })),
    synchronicityEntries: (asState.synchronicityEntries ?? []).map((e) => ({ ...e, id: String(e.id) })),
  };
}

function normalizeSettings(settings: Record<string, unknown> | undefined): PersistedState['settings'] {
  const legacyNotif = settings?.notifEnabled as boolean | undefined;
  let frequency = settings?.reminderFrequency as ReminderFrequency | undefined;
  if (!frequency) {
    frequency = legacyNotif ? 'daily' : 'off';
  }
  const weekday = (settings?.reminderWeekday as number | undefined) ?? 2;
  return {
    darkMode: (settings?.darkMode as boolean) ?? false,
    reminderFrequency: frequency,
    reminderTime: (settings?.reminderTime as string) ?? '8:00 AM',
    reminderWeekday: weekday >= 1 && weekday <= 7 ? weekday : 2,
    mantraAmbient: (settings?.mantraAmbient as boolean) ?? false,
    mantraBinaural: (settings?.mantraBinaural as boolean) ?? false,
    cloudBackupEnabled: (settings?.cloudBackupEnabled as boolean) ?? false,
  };
}

function migrateV1(parsed: Record<string, unknown>): PersistedState {
  const profile = parsed.profile as Record<string, unknown> | undefined;
  const settings = parsed.settings as Record<string, unknown> | undefined;
  const migrated = {
    ...defaultState,
    ...parsed,
    profile: {
      ...defaultState.profile,
      ...profile,
      firstName: (profile?.firstName as string) ?? '',
      lastName: (profile?.lastName as string) ?? '',
      email: (profile?.email as string) ?? '',
      avatarEmoji: (profile?.avatarEmoji as string) ?? '✦',
      birthDate: (profile?.birthDate as string) ?? '',
      numerologySystem: (profile?.numerologySystem as 'chaldean' | 'pythagorean') ?? 'chaldean',
      lifePathNumber: (profile?.lifePathNumber as number | null) ?? null,
      isSubscribed: (profile?.isSubscribed as boolean) ?? false,
      trialStartDate: (profile?.trialStartDate as string | null) ?? null,
      subscriptionPlan: (profile?.subscriptionPlan as PersistedState['profile']['subscriptionPlan']) ?? null,
    },
    settings: normalizeSettings(settings),
    synchronicityEntries: (parsed.synchronicityEntries as SynchronicityEntry[]) ?? defaultState.synchronicityEntries,
    moodCheckins: (parsed.moodCheckins as PersistedState['moodCheckins']) ?? [],
    communityUpvotes: (parsed.communityUpvotes as string[]) ?? [],
  } as PersistedState;
  return stripSeedData(normalizeStringIds(migrated as unknown as Record<string, unknown>));
}

export function loadState(): PersistedState {
  try {
    const v2 = localStorage.getItem(STORAGE_KEY);
    if (v2) {
      const loaded = migrateV1(JSON.parse(v2));
      const cleaned = stripSeedData(loaded);
      if (JSON.stringify(cleaned) !== JSON.stringify(loaded)) saveState(cleaned);
      return cleaned;
    }
    const v1 = localStorage.getItem('lumyn-state-v1');
    if (v1) {
      const migrated = migrateV1(JSON.parse(v1));
      const cleaned = stripSeedData(migrated);
      saveState(cleaned);
      return cleaned;
    }
    return defaultState;
  } catch {
    return defaultState;
  }
}

export function saveState(state: PersistedState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function formatDate(d = new Date()): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Wipes all local data — offline equivalent of Delete Account (Guideline 5.1.1(v)). */
export function resetAllData(): PersistedState {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('lumyn-state-v1');
  resetDeviceAuth();
  clearSubscriptionCache();
  return defaultState;
}
