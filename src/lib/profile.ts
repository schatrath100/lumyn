import type { UserProfile } from '../types';

export const AVATAR_EMOJIS = ['🌙', '✨', '🌸', '🦋', '🌿', '💫', '🔮', '🌊', '💎', '🌟', '🧿', '🪷', '🌺', '🌱', '🌞', '🌈'] as const;

export function getDisplayName(profile: Pick<UserProfile, 'firstName' | 'lastName' | 'userName'>): string {
  const full = `${profile.firstName} ${profile.lastName}`.trim();
  if (full) return full;
  if (profile.userName.trim()) return profile.userName.trim();
  return 'Lumyn seeker';
}

export function getInitials(profile: Pick<UserProfile, 'firstName' | 'lastName' | 'userName'>): string {
  if (profile.firstName && profile.lastName) {
    return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  }
  if (profile.firstName) return profile.firstName.slice(0, 2).toUpperCase();
  if (profile.userName.trim()) {
    return profile.userName
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  return 'L';
}

export function buildFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}
