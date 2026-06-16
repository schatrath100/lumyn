import { useNavigate } from 'react-router-dom';

export function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen gradient-splash" style={{ position: 'relative', overflow: 'hidden', paddingTop: 'var(--safe-top)' }}>
      <div className="glow-orb" style={{ width: 180, height: 180, top: 140, left: '50%', transform: 'translateX(-50%)' }} />
      <div className="fade-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 36px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 13, color: 'rgba(232,120,75,0.75)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 20, fontWeight: 700 }}>Welcome to</div>
        <div className="display" style={{ fontSize: 56, color: '#E8784B', letterSpacing: '0.12em', lineHeight: 1, fontWeight: 500, animation: 'reveal 1.4s ease forwards' }}>LUMYN</div>
        <div style={{ width: 4, height: 4, background: 'rgba(232,120,75,0.45)', borderRadius: '50%', margin: '18px 0' }} />
        <div style={{ fontSize: 14, color: 'rgba(122,92,69,0.85)', letterSpacing: '0.22em', textTransform: 'uppercase', textAlign: 'center', fontWeight: 700 }}>Words that shift your world</div>
      </div>
      <div style={{ padding: '0 28px calc(28px + var(--safe-bottom))', position: 'relative', zIndex: 1 }}>
        <button type="button" className="btn-primary" onClick={() => navigate('/onboarding/intro')}>Begin Your Journey</button>
      </div>
    </div>
  );
}
