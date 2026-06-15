/** Tags for community combo publishing (matches seeded catalog). */
export const COMBO_TAGS = [
  'General',
  'Abundance',
  'Heart',
  'Clarity',
  'Spiritual',
  'Joy',
  'Growth',
  'Attraction',
  'Healing',
  'Protection',
] as const;

export type ComboTag = (typeof COMBO_TAGS)[number];
