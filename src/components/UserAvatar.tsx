import { getInitials } from '../lib/profile';
import type { UserProfile } from '../types';

interface UserAvatarProps {
  profile: Pick<UserProfile, 'firstName' | 'lastName' | 'userName' | 'avatarEmoji'>;
  size?: number;
}

export function UserAvatar({ profile, size = 56 }: UserAvatarProps) {
  const showEmoji = profile.avatarEmoji && profile.avatarEmoji !== 'initials';

  return (
    <div
      className="user-avatar"
      style={{
        width: size,
        height: size,
        fontSize: showEmoji ? size * 0.42 : size * 0.34,
      }}
      aria-hidden
    >
      {showEmoji ? profile.avatarEmoji : getInitials(profile)}
    </div>
  );
}
