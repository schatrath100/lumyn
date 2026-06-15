import { useNavigate } from 'react-router-dom';
import { ProfileForm } from '../../components/ProfileForm';
import { ProgressDots } from '../../components/ProgressDots';
import { StatusBar } from '../../components/StatusBar';
import { buildFullName } from '../../lib/profile';
import { useApp } from '../../context/AppContext';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { state, updateProfile } = useApp();
  const { profile } = state;

  const continueNext = () => {
    const fullName = buildFullName(profile.firstName, profile.lastName);
    if (fullName) updateProfile({ userName: fullName });
    navigate('/onboarding/number');
  };

  return (
    <div className="screen screen--card">
      <StatusBar />
      <ProgressDots total={8} active={4} />
      <div className="screen__body" style={{ padding: '0 28px' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Your space</div>
        <h1 className="display" style={{ fontSize: 32, fontWeight: 400, margin: '0 0 6px', lineHeight: 1.2 }}>Make it<br />yours</h1>
        <p style={{ fontSize: 13, color: 'var(--ts)', margin: '0 0 20px', lineHeight: 1.55 }}>
          Add a name, email, and avatar if you like. All optional — Lumyn works fully offline without them.
        </p>
        <ProfileForm
          profile={profile}
          onChange={(partial) => updateProfile(partial)}
          showNumerologyHint
        />
      </div>
      <div className="screen__footer" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button type="button" className="btn-primary" onClick={continueNext}>Continue</button>
        <button type="button" className="btn-ghost" onClick={() => navigate('/onboarding/number')}>Skip for now</button>
      </div>
    </div>
  );
}
