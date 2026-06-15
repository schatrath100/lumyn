import type { Mood } from '../types';

export const MOODS: Mood[] = [
  { id: 'anxious', label: 'Anxious', sym: '≋', color: '#7A6CF0', tileBg: 'rgba(122,108,240,0.1)', matchWord: 'CLEAR', guidance: 'When anxiety grips you, CLEAR dissolves the energetic fog. Breathe slowly and repeat — feel the fog lifting with each exhale.' },
  { id: 'stuck', label: 'Stuck', sym: '⊗', color: '#E8784B', tileBg: 'rgba(232,120,75,0.1)', matchWord: 'MOVE', guidance: 'Stagnation is energy waiting to be redirected. MOVE unsticks your field — repeat with intention and let your body sway gently.' },
  { id: 'hopeful', label: 'Hopeful', sym: '◎', color: '#F2C44A', tileBg: 'rgba(242,196,74,0.15)', matchWord: 'OPEN', guidance: 'Hope is a door already ajar. OPEN flings it wide. Repeat and feel every possibility expanding around you right now.' },
  { id: 'tired', label: 'Tired', sym: '◑', color: '#4B9BE8', tileBg: 'rgba(75,155,232,0.1)', matchWord: 'RESTORE', guidance: 'Deep tiredness is a call to restore. RESTORE returns you to your original vibrant state — let it work at the cellular level.' },
  { id: 'grateful', label: 'Grateful', sym: '✦', color: '#4BE89B', tileBg: 'rgba(75,232,155,0.1)', matchWord: 'GLORIFY', guidance: 'Gratitude amplified becomes abundance. GLORIFY magnifies everything you appreciate right now, making it grow.' },
  { id: 'heartbroken', label: 'Heartbroken', sym: '♡', color: '#E84B7A', tileBg: 'rgba(232,75,122,0.1)', matchWord: 'LOVE', guidance: 'The heart that breaks is the heart that loves deeply. LOVE heals from the inside out — gently, without forcing anything.' },
  { id: 'motivated', label: 'Motivated', sym: '▲', color: '#82C84B', tileBg: 'rgba(130,200,75,0.1)', matchWord: 'REACH', guidance: 'Momentum loves intention. REACH extends your field beyond what you thought possible today — ride this energy fully.' },
  { id: 'overwhelmed', label: 'Overwhelmed', sym: '∿', color: '#E84BB8', tileBg: 'rgba(232,75,184,0.1)', matchWord: 'WAFT', guidance: 'When everything is too much, WAFT lifts you gently above the noise. Float — do not fight. Let it carry you upward.' },
];
