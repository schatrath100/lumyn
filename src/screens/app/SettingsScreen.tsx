import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeedbackSheet } from '../../components/FeedbackSheet';
import { IntentionsEditorSheet } from '../../components/IntentionsEditorSheet';
import { formatIntentionsSummary } from '../../components/IntentionsGrid';
import { RemindersSheet } from '../../components/RemindersSheet';
import { StatusBar } from '../../components/StatusBar';
import { Toggle } from '../../components/Toggle';
import { UserAvatar } from '../../components/UserAvatar';
import { PERSONAL_NUMBER_PROFILES } from '../../data/personal-numbers';
import { APP_VERSION } from '../../lib/app-meta';
import { LEGAL, openExternal } from '../../lib/legal';
import { getDisplayName } from '../../lib/profile';
import { formatReminderSummary } from '../../lib/reminder-summary';
import { useApp } from '../../context/AppContext';

function LegalRow({ label, onClick, danger, value }: { label: string; onClick: () => void; danger?: boolean; value?: string }) {
  return (
    <button
      type="button"
      className="settings-row"
      onClick={onClick}
      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
    >
      <div>
        <div className="settings-row__label" style={danger ? { color: '#C44B4B' } : undefined}>{label}</div>
        {value && <div className="settings-row__sub">{value}</div>}
      </div>
      <span style={{ color: danger ? '#C44B4B' : 'var(--tm)' }}>›</span>
    </button>
  );
}

export function SettingsScreen() {
  const navigate = useNavigate();
  const { state, toggleDarkMode, updateSettings, toggleMantraAmbient, toggleMantraBinaural, updateProfile, cloudUserId, cloudSyncStatus, cloudSyncError, isCloudAvailable, enableCloudSync, disableCloudSync } = useApp();
  const { settings, profile } = state;
  const [showReminders, setShowReminders] = useState(false);
  const [showIntentions, setShowIntentions] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const pnProfile = profile.personalNumber ? PERSONAL_NUMBER_PROFILES[profile.personalNumber] : null;
  const lpProfile = profile.lifePathNumber ? PERSONAL_NUMBER_PROFILES[profile.lifePathNumber] : null;
  const displayName = getDisplayName(profile);

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 18px' }}>
        <button type="button" className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        <div className="display" style={{ fontSize: 26, marginBottom: 16 }}>Settings</div>

        <button type="button" className="settings-profile-card" onClick={() => navigate('/settings/profile')}>
          <UserAvatar profile={profile} size={58} />
          <div className="settings-profile-card__copy">
            <div className="settings-profile-card__name">{displayName}</div>
            <div className="settings-profile-card__sub">
              {profile.email || 'Tap to add name, email & avatar'}
            </div>
          </div>
          <span className="settings-profile-card__chevron">›</span>
        </button>

        <div className="settings-group">
          <div className="settings-group__title">Practice</div>
          <div className="settings-card">
            <LegalRow
              label="Your intentions"
              value={formatIntentionsSummary(profile.selectedIntentions)}
              onClick={() => setShowIntentions(true)}
            />
            <LegalRow
              label="Practice reminder"
              value={formatReminderSummary(settings)}
              onClick={() => setShowReminders(true)}
            />
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group__title">Lumyn Number</div>
          <div className="settings-card">
            <div className="settings-row">
              <div>
                <div className="settings-row__label">
                  {profile.personalNumber ? `${profile.personalNumber} — ${pnProfile?.title}` : 'Not set'}
                  {profile.lifePathNumber ? ` · LP ${profile.lifePathNumber}` : ''}
                </div>
                {pnProfile && <div className="settings-row__sub">{pnProfile.words.join(' · ')}</div>}
                {lpProfile && <div className="settings-row__sub" style={{ marginTop: 4 }}>Life path: {lpProfile.words.join(' · ')}</div>}
              </div>
              <button type="button" onClick={() => navigate('/profile/number')} style={{ background: 'var(--bg-c)', border: '1px solid var(--bd)', borderRadius: 10, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: 'var(--ts)' }}>Edit</button>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group__title">Mantra Mode</div>
          <div className="settings-card">
            <div className="settings-row">
              <div>
                <div className="settings-row__label">Ambient Pad</div>
                <div className="settings-row__sub">Soft tone underneath voice</div>
              </div>
              <Toggle on={settings.mantraAmbient} onToggle={toggleMantraAmbient} label="Ambient" />
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-row__label">Theta Undertone</div>
                <div className="settings-row__sub">Low-frequency focus layer</div>
              </div>
              <Toggle on={settings.mantraBinaural} onToggle={toggleMantraBinaural} label="Theta" />
            </div>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group__title">Widget</div>
          <div className="settings-card">
            <div className="settings-row">
              <div>
                <div className="settings-row__label">Daily Word Widget</div>
                <div className="settings-row__sub">Glanceable home screen view</div>
              </div>
              <button type="button" onClick={() => navigate('/widget')} style={{ background: 'var(--bg-c)', border: '1px solid var(--bd)', borderRadius: 10, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: 'var(--ts)' }}>Open</button>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group__title">Appearance</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row__label">Dark Mode</div>
              <Toggle on={settings.darkMode} onToggle={toggleDarkMode} label="Toggle dark mode" />
            </div>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group__title">Cloud Backup</div>
          <div className="settings-card">
            <div className="settings-row">
              <div>
                <div className="settings-row__label">
                  {cloudUserId ? 'Backup enabled' : 'Off — device only'}
                </div>
                <div className="settings-row__sub">
                  {!isCloudAvailable
                    ? 'Add Supabase keys to enable'
                    : cloudSyncStatus === 'synced'
                      ? 'Profile, moods, journal & combos sync across devices'
                      : cloudSyncStatus === 'connecting'
                        ? 'Connecting…'
                        : cloudSyncStatus === 'error'
                          ? (cloudSyncError ?? 'Sync error')
                          : 'Optional — silent device session'}
                </div>
              </div>
              {isCloudAvailable && (
                cloudUserId ? (
                  <button
                    type="button"
                    onClick={() => void disableCloudSync()}
                    style={{ background: 'var(--bg-c)', border: '1px solid var(--bd)', borderRadius: 10, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: 'var(--ts)' }}
                  >
                    Turn off
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void enableCloudSync()}
                    style={{ background: 'var(--co)', border: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: 'white', fontWeight: 600 }}
                  >
                    Enable
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group__title">Account</div>
          <div className="settings-card">
            <LegalRow label="Delete Account & Data" onClick={() => navigate('/settings/delete-data')} danger />
          </div>
          <p style={{ fontSize: 11, color: 'var(--tm)', margin: '8px 0 0', lineHeight: 1.5 }}>
            Permanently removes your profile, moods, journal, and combos{cloudUserId ? ' from this device and cloud' : ''}.
          </p>
        </div>

        <div className="settings-group">
          <div className="settings-group__title">Legal</div>
          <div className="settings-card">
            <LegalRow label="Privacy Policy" onClick={() => navigate('/legal/privacy')} />
            <LegalRow label="Terms of Use (Apple EULA)" onClick={() => openExternal(LEGAL.termsOfUse)} />
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group__title">About</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row__label">Version</div>
              <div style={{ fontSize: 13, color: 'var(--tm)' }}>{APP_VERSION}</div>
            </div>
            <LegalRow label="Feedback" value="Share a note" onClick={() => setShowFeedback(true)} />
            <LegalRow label="Support" onClick={() => openExternal(`mailto:${LEGAL.supportEmail}`)} />
          </div>
        </div>

        <button
          type="button"
          className="btn-ghost"
          style={{ color: 'var(--co)', marginBottom: 24 }}
          onClick={() => {
            updateProfile({ onboardingComplete: false });
            navigate('/onboarding', { replace: true });
          }}
        >
          Replay onboarding
        </button>
      </div>

      {showReminders && (
        <RemindersSheet
          settings={settings}
          profile={profile}
          onClose={() => setShowReminders(false)}
          onChange={updateSettings}
        />
      )}
      {showIntentions && <IntentionsEditorSheet onClose={() => setShowIntentions(false)} />}
      {showFeedback && <FeedbackSheet onClose={() => setShowFeedback(false)} />}
    </div>
  );
}
