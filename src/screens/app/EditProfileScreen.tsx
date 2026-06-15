import { useNavigate } from 'react-router-dom';
import { ProfileForm } from '../../components/ProfileForm';
import { StatusBar } from '../../components/StatusBar';
import { buildFullName } from '../../lib/profile';
import { useApp } from '../../context/AppContext';

export function EditProfileScreen() {
  const navigate = useNavigate();
  const { state, updateProfile } = useApp();
  const { profile } = state;

  const save = () => {
    const fullName = buildFullName(profile.firstName, profile.lastName);
    if (fullName) updateProfile({ userName: fullName });
    navigate('/settings');
  };

  return (
    <div className="screen screen--card">
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 24px' }}>
        <button type="button" className="btn-back" onClick={() => navigate('/settings')}>← Back</button>
        <div className="display" style={{ fontSize: 26, marginBottom: 8 }}>Edit Profile</div>
        <p style={{ fontSize: 13, color: 'var(--ts)', margin: '0 0 20px', lineHeight: 1.55 }}>
          Update how you appear in Lumyn. Syncs to cloud backup when enabled.
        </p>
        <ProfileForm profile={profile} onChange={(partial) => updateProfile(partial)} />
      </div>
      <div className="screen__footer">
        <button type="button" className="btn-primary" onClick={save}>Save Profile ✦</button>
      </div>
    </div>
  );
}
