export type NumerologySystem = 'chaldean' | 'pythagorean';

export interface SwitchWord {
  id: number;
  word: string;
  category: string;
  color: string;
  intention: string;
  description: string;
  reps: number;
  how: string;
}

export interface Mood {
  id: string;
  label: string;
  sym: string;
  color: string;
  tileBg: string;
  matchWord: string;
  guidance: string;
}

export interface MoodColor {
  id: string;
  label: string;
  color: string;
  matchWord: string;
  guidance: string;
}

export interface Intention {
  id: string;
  label: string;
  icon: string;
}

export interface PersonalNumberProfile {
  title: string;
  description: string;
  words: string[];
}

export interface Combo {
  id: string;
  name: string;
  words: string[];
  date: string;
  /** Set after publishing to community exchange. */
  communityPublishedId?: string | null;
}

export interface CommunityCombo {
  id: string;
  name: string;
  words: string[];
  author: string;
  resonance: number;
  upvotes: number;
  tag: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  word: string;
  moodBefore: 1 | 2 | 3 | 4 | 5;
  moodAfter: 1 | 2 | 3 | 4 | 5;
  note: string;
}

export interface SynchronicityEntry {
  id: string;
  date: string;
  word: string;
  sign: string;
  note: string;
}

export interface AppSettings {
  darkMode: boolean;
  notifEnabled: boolean;
  reminderTime: string;
  mantraAmbient: boolean;
  mantraBinaural: boolean;
}

export interface MoodCheckin {
  id: string;
  date: string;
  moodId: string;
  moodLabel: string;
  matchWord: string;
  source: 'tile' | 'color_grid';
}

export type SubscriptionPlanId = 'weekly' | 'quarterly';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatarEmoji: string;
  selectedIntentions: string[];
  userName: string;
  birthDate: string;
  numerologySystem: NumerologySystem;
  personalNumber: number | null;
  lifePathNumber: number | null;
  onboardingComplete: boolean;
  isSubscribed: boolean;
  trialStartDate: string | null;
  subscriptionPlan: SubscriptionPlanId | null;
}

export interface PersistedState {
  profile: UserProfile;
  settings: AppSettings;
  savedCombos: Combo[];
  journalEntries: JournalEntry[];
  synchronicityEntries: SynchronicityEntry[];
  communityUpvotes: string[];
  moodCheckins: MoodCheckin[];
  streak: number;
  lastActiveDate: string | null;
  savedWords: string[];
}

export type MoodSelection = Mood | MoodColor;

export type MoonPhase =
  | 'new'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

export interface MoonInfo {
  phase: MoonPhase;
  label: string;
  emoji: string;
  guidance: string;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
