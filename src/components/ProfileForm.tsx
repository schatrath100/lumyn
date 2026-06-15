import { AVATAR_EMOJIS } from '../lib/profile';
import type { UserProfile } from '../types';
import { UserAvatar } from './UserAvatar';

interface ProfileFormProps {
  profile: Pick<UserProfile, 'firstName' | 'lastName' | 'email' | 'avatarEmoji' | 'userName'>;
  onChange: (partial: Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'email' | 'avatarEmoji'>>) => void;
  showNumerologyHint?: boolean;
}

export function ProfileForm({ profile, onChange, showNumerologyHint = false }: ProfileFormProps) {
  return (
    <div className="profile-form">
      <div className="profile-form__avatar-block">
        <UserAvatar profile={profile} size={72} />
        <div>
          <div className="eyebrow" style={{ marginBottom: 8, fontWeight: 600 }}>Avatar</div>
          <div className="profile-form__emoji-grid">
            {AVATAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`profile-form__emoji${profile.avatarEmoji === emoji ? ' profile-form__emoji--active' : ''}`}
                onClick={() => onChange({ avatarEmoji: emoji })}
                aria-label={`Avatar ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-form__field">
        <label className="eyebrow" htmlFor="profile-first-name">First name</label>
        <input
          id="profile-first-name"
          className="input"
          value={profile.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
          placeholder="Optional"
          autoComplete="given-name"
        />
      </div>

      <div className="profile-form__field">
        <label className="eyebrow" htmlFor="profile-last-name">Last name</label>
        <input
          id="profile-last-name"
          className="input"
          value={profile.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
          placeholder="Optional"
          autoComplete="family-name"
        />
      </div>

      <div className="profile-form__field">
        <label className="eyebrow" htmlFor="profile-email">Email</label>
        <input
          id="profile-email"
          className="input"
          type="email"
          value={profile.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="Optional — for cloud backup"
          autoComplete="email"
        />
      </div>

      {showNumerologyHint && (
        <p className="profile-form__hint">
          Your name can power numerology on the next step. Everything here is optional — skip anytime.
        </p>
      )}
    </div>
  );
}
