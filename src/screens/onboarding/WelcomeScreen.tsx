import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { ProgressDots } from '../../components/ProgressDots';

export function WelcomeScreen() {
  const navigate = useNavigate();

  const enter = () => {
    navigate('/onboarding/paywall');
  };

  return (
    <div className="screen gradient-splash" style={{ position: 'relative', overflow: 'hidden' }}>
      <StatusBar />
      <ProgressDots total={8} active={7} />
      <div className="glow-orb" style={{ width: 180, height: 180, top: 130, left: '50%', transform: 'translateX(-50%)' }} />
      <div className="fade-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 36px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: 8, color: 'rgba(232,120,75,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 400 }}>Welcome to</div>
        <div className="display" style={{ fontSize: 40, color: '#E8784B', letterSpacing: '0.08em', lineHeight: 1 }}>LUMYN</div>
        <div style={{ width: 30, height: 1.5, background: 'rgba(232,120,75,0.3)', margin: '14px auto' }} />
        <div className="display" style={{ fontSize: 14, color: 'rgba(30,17,10,0.7)', fontStyle: 'italic', marginBottom: 12, lineHeight: 1.3 }}>Your journey begins now.</div>
        <p style={{ fontSize: 11, color: 'rgba(122,92,69,0.7)', lineHeight: 1.7, margin: 0 }}>Every word spoken with intention<br />creates a ripple in your reality.</p>
      </div>
      <div style={{ padding: '0 28px 44px', position: 'relative', zIndex: 1 }}>
        <button type="button" className="btn-primary" onClick={enter}>Continue ✦</button>
      </div>
    </div>
  );
}
