import { useNavigate } from 'react-router-dom';
import { OnboardingHeader } from '../../components/OnboardingHeader';

export function WelcomeScreen() {
  const navigate = useNavigate();

  const enter = () => {
    navigate('/onboarding/paywall');
  };

  return (
    <div className="screen gradient-splash" style={{ position: 'relative', overflow: 'hidden' }}>
      <OnboardingHeader backTo="/onboarding/reminders" active={7} />
      <div className="glow-orb" style={{ width: 180, height: 180, top: 130, left: '50%', transform: 'translateX(-50%)' }} />
      <div className="fade-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 36px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'rgba(232,120,75,0.65)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 18, fontWeight: 400 }}>Welcome to</div>
        <div className="display" style={{ fontSize: 48, color: '#E8784B', letterSpacing: '0.08em', lineHeight: 1 }}>LUMYN</div>
        <div style={{ width: 30, height: 1.5, background: 'rgba(232,120,75,0.3)', margin: '18px auto' }} />
        <div className="display" style={{ fontSize: 20, color: 'rgba(30,17,10,0.7)', fontStyle: 'italic', marginBottom: 14, lineHeight: 1.3 }}>Your journey begins now.</div>
        <p style={{ fontSize: 16, color: 'rgba(122,92,69,0.75)', lineHeight: 1.7, margin: 0 }}>Every word spoken with intention<br />creates a ripple in your reality.</p>
      </div>
      <div style={{ padding: '0 28px calc(28px + var(--safe-bottom))', position: 'relative', zIndex: 1 }}>
        <button type="button" className="btn-primary" onClick={enter}>Continue ✦</button>
      </div>
    </div>
  );
}
