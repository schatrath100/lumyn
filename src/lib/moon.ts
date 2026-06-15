import type { MoonInfo, MoonPhase, TimeOfDay } from '../types';

const SYNODIC_MONTH = 29.530588853;

const PHASE_META: Record<MoonPhase, { label: string; emoji: string; guidance: string }> = {
  'new': { label: 'New Moon', emoji: '🌑', guidance: 'Plant intentions. Speak new beginnings softly.' },
  'waxing-crescent': { label: 'Waxing Crescent', emoji: '🌒', guidance: 'Momentum builds. Repeat with growing conviction.' },
  'first-quarter': { label: 'First Quarter', emoji: '🌓', guidance: 'Push through resistance. Action words land strongest now.' },
  'waxing-gibbous': { label: 'Waxing Gibbous', emoji: '🌔', guidance: 'Refine and trust. Your field is receptive to refinement.' },
  'full': { label: 'Full Moon', emoji: '🌕', guidance: 'Peak amplification. GLORIFY and magnify what is working.' },
  'waning-gibbous': { label: 'Waning Gibbous', emoji: '🌖', guidance: 'Share and integrate. Teach what you have received.' },
  'last-quarter': { label: 'Last Quarter', emoji: '🌗', guidance: 'Release and clear. Let go of what no longer serves.' },
  'waning-crescent': { label: 'Waning Crescent', emoji: '🌘', guidance: 'Rest and restore. Gentle words, deep surrender.' },
};

const PHASE_ORDER: MoonPhase[] = [
  'new', 'waxing-crescent', 'first-quarter', 'waxing-gibbous',
  'full', 'waning-gibbous', 'last-quarter', 'waning-crescent',
];

/** Approximate moon phase from date (no external API). */
export function getMoonPhase(date = new Date()): MoonPhase {
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14);
  const daysSince = (date.getTime() - knownNewMoon) / 86400000;
  const phase = ((daysSince % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const index = Math.floor((phase / SYNODIC_MONTH) * 8) % 8;
  return PHASE_ORDER[index];
}

export function getMoonInfo(date = new Date()): MoonInfo {
  const phase = getMoonPhase(date);
  return { phase, ...PHASE_META[phase] };
}

export function getTimeOfDay(date = new Date()): TimeOfDay {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

const PHASE_WORD_BOOST: Record<MoonPhase, string[]> = {
  'new': ['OPEN', 'DIVINE', 'TOGETHER'],
  'waxing-crescent': ['REACH', 'BRING', 'MOVE'],
  'first-quarter': ['COUNT', 'SHIFT', 'CHANGE'],
  'waxing-gibbous': ['CRYSTAL', 'FIND', 'CLEAR'],
  'full': ['GLORIFY', 'ELATE', 'LOVE'],
  'waning-gibbous': ['ALLOW', 'CHARM', 'WAFT'],
  'last-quarter': ['CLEAR', 'RESTORE', 'BETWEEN'],
  'waning-crescent': ['RESTORE', 'WAFT', 'ALLOW'],
};

const TIME_WORD_BOOST: Record<TimeOfDay, string[]> = {
  morning: ['OPEN', 'ELATE', 'TOGETHER'],
  afternoon: ['CRYSTAL', 'MOVE', 'REACH'],
  evening: ['ALLOW', 'LOVE', 'RESTORE'],
  night: ['DIVINE', 'BETWEEN', 'WAFT'],
};

export function getPhaseAlignedWordCandidates(date = new Date()): string[] {
  const phase = getMoonPhase(date);
  const time = getTimeOfDay(date);
  return [...new Set([...PHASE_WORD_BOOST[phase], ...TIME_WORD_BOOST[time]])];
}

export function getTimingRitualPrompt(date = new Date()): string {
  const moon = getMoonInfo(date);
  const time = getTimeOfDay(date);
  const timeLabel = { morning: 'dawn', afternoon: 'midday', evening: 'dusk', night: 'night' }[time];
  return `${moon.emoji} ${moon.label} · ${timeLabel} — ${moon.guidance}`;
}
