import { useNavigate } from 'react-router-dom';
import { OnboardingHeader } from '../../components/OnboardingHeader';

export function IntroScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen screen--card">
      <OnboardingHeader backTo="/onboarding" active={2} />
      <div className="screen__body" style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>What is a</div>
        <h1 className="display" style={{ fontSize: 36, fontWeight: 400, margin: '0 0 22px', lineHeight: 1.1 }}>Switch Word?</h1>
        <div style={{ background: 'linear-gradient(135deg,#FFF4EC,#FFE8D4)', borderRadius: 14, padding: 22, textAlign: 'center', marginBottom: 22, border: '1px solid #F0DDD0' }}>
          <div className="display" style={{ fontStyle: 'italic', fontSize: 32, color: '#E8784B' }}>TOGETHER</div>
          <div style={{ fontSize: 14, color: 'var(--ts)', marginTop: 8, lineHeight: 1.5 }}>Attracts resources & opportunities</div>
        </div>
        <p style={{ fontSize: 15, color: 'var(--ts)', lineHeight: 1.65, margin: '0 0 14px' }}>
          Switch words are single words that <strong style={{ color: 'var(--tp)' }}>shift your mental and energetic state</strong> when repeated with intention.
        </p>
        <p style={{ fontSize: 15, color: 'var(--ts)', lineHeight: 1.65, margin: '0 0 20px' }}>
          Unlike affirmations, they bypass conscious resistance — going straight to the subconscious.
        </p>
        <div style={{ background: 'var(--bg-c)', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 14, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tm)' }}>How it works</div>
          {[
            'Choose a word matching your intention',
            'Repeat it 9–45 times, silently or aloud',
            'Feel the shift — notice what opens',
          ].map((text, i) => (
            <div key={text} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 2 ? 12 : 0 }}>
              <div style={{ width: 24, height: 24, background: 'var(--co)', color: 'white', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: 15, color: 'var(--ts)', lineHeight: 1.55 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="screen__footer">
        <button type="button" className="btn-primary" onClick={() => navigate('/onboarding/intentions')}>Continue</button>
      </div>
    </div>
  );
}
