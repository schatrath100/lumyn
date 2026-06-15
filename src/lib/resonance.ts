import { PERSONAL_NUMBER_PROFILES } from '../data/personal-numbers';
import { SWITCH_WORDS, getWordByName } from '../data/switch-words';
import type { Combo, CommunityCombo, SwitchWord } from '../types';
import { getResonanceNumber } from './numerology';

export function getResonantWordNames(number: number | null): string[] {
  if (!number) return [];
  return PERSONAL_NUMBER_PROFILES[number]?.words ?? [];
}

export function getResonantWords(number: number | null): SwitchWord[] {
  const names = getResonantWordNames(number);
  return names.map((n) => getWordByName(n)).filter((w): w is SwitchWord => !!w);
}

export function scoreComboForNumber(words: string[], number: number | null): number {
  if (!number) return 0;
  const resonant = new Set(getResonantWordNames(number));
  return words.filter((w) => resonant.has(w)).length;
}

export function getResonantCombos(
  personalNumber: number | null,
  lifePathNumber: number | null,
  saved: Combo[],
  community: CommunityCombo[],
): Array<{ id: string; name: string; words: string[]; score: number; source: 'yours' | 'community' }> {
  const number = getResonanceNumber(personalNumber, lifePathNumber);
  if (!number) return [];

  const scored = [
    ...saved.map((c) => ({
      id: String(c.id),
      name: c.name,
      words: c.words,
      score: scoreComboForNumber(c.words, number),
      source: 'yours' as const,
    })),
    ...community.map((c) => ({
      id: c.id,
      name: c.name,
      words: c.words,
      score: scoreComboForNumber(c.words, number),
      source: 'community' as const,
    })),
  ];

  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score || b.words.length - a.words.length)
    .slice(0, 6);
}

/** Words whose category digit loosely maps to personal number mod 9. */
export function getNumerologyLibraryPicks(number: number | null): SwitchWord[] {
  if (!number) return [];
  const resonant = new Set(getResonantWordNames(number));
  const picks = SWITCH_WORDS.filter((w) => resonant.has(w.word));
  if (picks.length >= 3) return picks.slice(0, 4);
  const extra = SWITCH_WORDS.filter((w) => w.id % 9 === number % 9 || w.id % 9 === (number % 9 || 9));
  return [...picks, ...extra].filter((w, i, arr) => arr.findIndex((x) => x.id === w.id) === i).slice(0, 4);
}
