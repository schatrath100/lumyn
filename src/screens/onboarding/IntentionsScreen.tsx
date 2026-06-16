import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IntentionsGrid } from '../../components/IntentionsGrid';
import { OnboardingHeader } from '../../components/OnboardingHeader';
import { useApp } from '../../context/AppContext';

export function IntentionsScreen() {
  const navigate = useNavigate();
  const { state, toggleIntention } = useApp();
  const selected = state.profile.selectedIntentions;
  const [notice, setNotice] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setNotice(null);
    const has = selected.includes(id);
    if (!has && selected.length >= 3) {
      setNotice('Choose up to 3 intentions.');
      return;
    }
    toggleIntention(id);
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      setNotice('Please choose at least one intention to continue.');
      return;
    }
    navigate('/onboarding/profile');
  };

  return (
    <div className="screen screen--card">
      <OnboardingHeader backTo="/onboarding/intro" active={3} />
      <div className="screen__body" style={{ padding: '0 24px', display: 'flex', flexDirection: 'column' }}>
        <h1 className="display" style={{ fontSize: 32, fontWeight: 400, margin: '0 0 6px', lineHeight: 1.2 }}>What draws<br />you here?</h1>
        <p style={{ fontSize: 15, color: 'var(--ts)', margin: '0 0 20px' }}>Choose up to 3 intentions. We'll curate your library.</p>
        <IntentionsGrid selected={selected} onToggle={handleToggle} />
        {notice && <p className="publish-combo-error" role="alert" style={{ marginTop: 10 }}>{notice}</p>}
      </div>
      <div className="screen__footer">
        <button type="button" className="btn-primary" onClick={handleContinue}>Continue</button>
      </div>
    </div>
  );
}
