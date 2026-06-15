import { useNavigate } from 'react-router-dom';
import { ProgressDots } from '../../components/ProgressDots';
import { StatusBar } from '../../components/StatusBar';

export function IntroScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen screen--card">
      <StatusBar />
      <ProgressDots active={2} />
      <div className="screen__body" style={{ padding: '0 28px' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>What is a</div>
        <h1 className="display" style={{ fontSize: 22, fontWeight: 400, margin: '0 0 18px', lineHeight: 1.15 }}>Switch Word?</h1>
        <div style={{ background: 'linear-gradient(135deg,#FFF4EC,#FFE8D4)', borderRadius: 12, padding: 18, textAlign: 'center', marginBottom: 18, border: '1px solid #F0DDD0' }}>
          <div className="display" style={{ fontStyle: 'italic', fontSize: 26, color: '#E8784B' }}>TOGETHER</div>
          <div style={{ fontSize: 9, color: 'var(--ts)', marginTop: 6, lineHeight: 1.6 }}>Attracts resources & opportunities</div>
        </div>
        <p style={{ fontSize: 9, color: 'var(--ts)', lineHeight: 1.6, margin: '0 0 10px' }}>
          Switch words are single words that <strong style={{ color: 'var(--tp)' }}>shift your mental and energetic state</strong> when repeated with intention.
        </p>
        <p style={{ fontSize: 9, color: 'var(--ts)', lineHeight: 1.6, margin: '0 0 16px' }}>
          Unlike affirmations, they bypass conscious resistance — going straight to the subconscious.
        </p>
        <div style={{ background: 'var(--bg-c)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 8, fontWeight: 600, marginBottom: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tm)' }}>How it works</div>
          {[
            'Choose a word matching your intention',
            'Repeat it 9–45 times, silently or aloud',
            'Feel the shift — notice what opens',
          ].map((text, i) => (
            <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < 2 ? 8 : 0 }}>
              <div style={{ width: 18, height: 18, background: 'var(--co)', color: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: 9, color: 'var(--ts)', lineHeight: 1.55 }}>{text}</span>
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
