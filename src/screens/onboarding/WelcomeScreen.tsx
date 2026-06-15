import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { useApp } from '../../context/AppContext';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { completeOnboarding } = useApp();

  const enter = () => {
    completeOnboarding();
    navigate('/');
  };

  return (
    <div className="screen gradient-splash" style={{ position: 'relative', overflow: 'hidden' }}>
      <StatusBar />
      <div className="glow-orb" style={{ width: 320, height: 320, top: 100, left: '50%', transform: 'translateX(-50%)' }} />
      <div className="fade-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 36px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: 'rgba(232,120,75,0.6)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 300 }}>Welcome to</div>
        <div className="display" style={{ fontSize: 64, color: '#E8784B', letterSpacing: '0.1em', lineHeight: 1 }}>LUMYN</div>
        <div style={{ width: 40, height: 2, background: 'rgba(232,120,75,0.3)', margin: '22px auto' }} />
        <div className="display" style={{ fontSize: 22, color: 'rgba(30,17,10,0.75)', fontStyle: 'italic', marginBottom: 12, lineHeight: 1.3 }}>Your journey begins now.</div>
        <p style={{ fontSize: 13, color: 'rgba(122,92,69,0.75)', lineHeight: 1.7, margin: 0 }}>Every word spoken with intention<br />creates a ripple in your reality.</p>
      </div>
      <div style={{ padding: '0 28px 44px', position: 'relative', zIndex: 1 }}>
        <button type="button" className="btn-primary" onClick={enter}>Enter Lumyn ✦</button>
      </div>
    </div>
  );
}
