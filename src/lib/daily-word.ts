import { SWITCH_WORDS, getWordByName } from '../data/switch-words';
import type { SwitchWord, UserProfile } from '../types';
import { getPhaseAlignedWordCandidates, getTimingRitualPrompt, getMoonInfo } from './moon';
import { getResonanceNumber } from './numerology';
import { getResonantWordNames } from './resonance';

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning ✦';
  if (hour < 17) return 'Good afternoon ✦';
  return 'Good evening ✦';
}

export interface DailyWordContext {
  word: SwitchWord;
  ritualPrompt: string;
  moonLabel: string;
  moonEmoji: string;
  isPersonalized: boolean;
}

export function getDailyWord(date = new Date(), profile?: UserProfile): DailyWordContext {
  const moon = getMoonInfo(date);
  const ritualPrompt = getTimingRitualPrompt(date);
  const candidates = getPhaseAlignedWordCandidates(date);

  const resonance = profile
    ? getResonanceNumber(profile.personalNumber, profile.lifePathNumber)
    : null;
  const personalWords = resonance ? getResonantWordNames(resonance) : [];

  // Blend moon/time candidates with personal resonance
  const pool = [...new Set([...personalWords, ...candidates])];
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);

  let word: SwitchWord | undefined;
  if (pool.length) {
    const pick = pool[dayOfYear % pool.length];
    word = getWordByName(pick);
  }
  if (!word) {
    word = SWITCH_WORDS[dayOfYear % SWITCH_WORDS.length];
  }

  return {
    word,
    ritualPrompt,
    moonLabel: moon.label,
    moonEmoji: moon.emoji,
    isPersonalized: personalWords.includes(word.word),
  };
}
