import type { PersistedState, SynchronicityEntry } from '../types';

const STORAGE_KEY = 'lumyn-state-v2';

export const defaultState: PersistedState = {
  profile: {
    selectedIntentions: [],
    userName: '',
    birthDate: '',
    numerologySystem: 'chaldean',
    personalNumber: null,
    lifePathNumber: null,
    onboardingComplete: false,
  },
  settings: {
    darkMode: false,
    notifEnabled: true,
    reminderTime: '8:00 AM',
    mantraAmbient: false,
    mantraBinaural: false,
  },
  savedCombos: [
    { id: 'seed-combo-1', name: 'Morning Abundance Ritual', words: ['TOGETHER', 'COUNT', 'OPEN', 'DIVINE'], date: 'Jun 12' },
    { id: 'seed-combo-2', name: 'Healing & Restore', words: ['RESTORE', 'LOVE', 'CLEAR'], date: 'Jun 10' },
    { id: 'seed-combo-3', name: 'Clarity Focus Blend', words: ['CRYSTAL', 'FIND'], date: 'Jun 8' },
  ],
  journalEntries: [
    { id: 'seed-journal-1', date: 'Jun 14', word: 'ELATE', moodBefore: 2, moodAfter: 4, note: 'Felt lighter after 3 rounds.' },
    { id: 'seed-journal-2', date: 'Jun 13', word: 'TOGETHER', moodBefore: 3, moodAfter: 5, note: '' },
    { id: 'seed-journal-3', date: 'Jun 12', word: 'CLEAR', moodBefore: 1, moodAfter: 3, note: 'Mind fog lifted quickly.' },
    { id: 'seed-journal-4', date: 'Jun 11', word: 'RESTORE', moodBefore: 2, moodAfter: 4, note: '' },
  ],
  synchronicityEntries: [
    { id: 'seed-sync-1', date: 'Jun 13', word: 'TOGETHER', sign: 'Saw 111 on a receipt right after my session', note: 'Felt like confirmation.' },
    { id: 'seed-sync-2', date: 'Jun 11', word: 'OPEN', sign: 'Unexpected call from an old friend', note: '' },
  ],
  communityUpvotes: [],
  streak: 12,
  lastActiveDate: null,
  savedWords: [],
};

function normalizeStringIds(parsed: Record<string, unknown>): PersistedState {
  const asState = parsed as unknown as PersistedState;
  return {
    ...asState,
    savedCombos: (asState.savedCombos ?? []).map((c) => ({ ...c, id: String(c.id) })),
    journalEntries: (asState.journalEntries ?? []).map((e) => ({ ...e, id: String(e.id) })),
    synchronicityEntries: (asState.synchronicityEntries ?? []).map((e) => ({ ...e, id: String(e.id) })),
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
      birthDate: (profile?.birthDate as string) ?? '',
      numerologySystem: (profile?.numerologySystem as 'chaldean' | 'pythagorean') ?? 'chaldean',
      lifePathNumber: (profile?.lifePathNumber as number | null) ?? null,
    },
    settings: {
      ...defaultState.settings,
      ...settings,
      mantraAmbient: (settings?.mantraAmbient as boolean) ?? false,
      mantraBinaural: (settings?.mantraBinaural as boolean) ?? false,
    },
    synchronicityEntries: (parsed.synchronicityEntries as SynchronicityEntry[]) ?? defaultState.synchronicityEntries,
    communityUpvotes: (parsed.communityUpvotes as string[]) ?? [],
  } as PersistedState;
  return normalizeStringIds(migrated as unknown as Record<string, unknown>);
}

export function loadState(): PersistedState {
  try {
    const v2 = localStorage.getItem(STORAGE_KEY);
    if (v2) return migrateV1(JSON.parse(v2));
    const v1 = localStorage.getItem('lumyn-state-v1');
    if (v1) {
      const migrated = migrateV1(JSON.parse(v1));
      saveState(migrated);
      return migrated;
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
  return defaultState;
}
