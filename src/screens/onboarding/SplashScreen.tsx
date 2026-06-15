import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { useApp } from '../../context/AppContext';

export function SplashScreen() {
  const navigate = useNavigate();
  const { completeOnboarding } = useApp();

  const skipToApp = () => {
    completeOnboarding();
    navigate('/', { replace: true });
  };

  return (
    <div className="screen gradient-splash" style={{ position: 'relative', overflow: 'hidden' }}>
      <StatusBar />
      <div className="glow-orb" style={{ width: 340, height: 340, top: 120, left: '50%', transform: 'translateX(-50%)' }} />
      <div className="fade-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 36px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, color: 'rgba(232,120,75,0.6)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 18, fontWeight: 300 }}>Welcome to</div>
        <div className="display" style={{ fontSize: 72, color: '#E8784B', letterSpacing: '0.1em', lineHeight: 1, animation: 'reveal 1.4s ease forwards' }}>LUMYN</div>
        <div style={{ width: 6, height: 6, background: 'rgba(232,120,75,0.45)', borderRadius: '50%', margin: '20px 0' }} />
        <div style={{ fontSize: 12, color: 'rgba(122,92,69,0.75)', letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', fontWeight: 300 }}>Words that shift your world</div>
      </div>
      <div style={{ padding: '0 28px 44px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button type="button" className="btn-primary" onClick={() => navigate('/onboarding/intro')}>Begin Your Journey</button>
        <button type="button" className="btn-ghost" style={{ color: 'rgba(122,92,69,0.65)' }} onClick={skipToApp}>Skip for now</button>
      </div>
    </div>
  );
}
