import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingHeader } from '../../components/OnboardingHeader';
import { RemindersSheet } from '../../components/RemindersSheet';
import { useApp } from '../../context/AppContext';

export function RemindersScreen() {
  const navigate = useNavigate();
  const { state, updateSettings } = useApp();
  const [showSheet, setShowSheet] = useState(false);

  return (
    <>
      <div className="screen screen--card">
        <OnboardingHeader backTo="/onboarding/number" active={6} />
        <div className="screen__body" style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, textAlign: 'center' }}>
          <div style={{ width: 76, height: 76, background: 'linear-gradient(135deg,#FFE4CC,#FFF0E0)', borderRadius: 22, margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, boxShadow: '0 8px 24px rgba(232,120,75,0.16)' }}>🔔</div>
          <h1 className="display" style={{ fontSize: 30, fontWeight: 400, margin: '0 0 8px', lineHeight: 1.25 }}>Stay aligned,<br />every day</h1>
          <p style={{ fontSize: 13, color: 'var(--ts)', margin: 0, lineHeight: 1.65 }}>Set a daily or weekly nudge for your switch word practice.</p>
        </div>
        <div className="screen__footer" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button type="button" className="btn-primary" onClick={() => setShowSheet(true)}>Set Reminders</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/onboarding/welcome')}>Maybe later</button>
        </div>
      </div>
      {showSheet && (
        <RemindersSheet
          settings={state.settings}
          profile={state.profile}
          onClose={() => { setShowSheet(false); navigate('/onboarding/welcome'); }}
          onChange={updateSettings}
        />
      )}
    </>
  );
}
