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
        <div className="eyebrow" style={{ marginBottom: 10 }}>What is a</div>
        <h1 className="display" style={{ fontSize: 38, fontWeight: 400, margin: '0 0 22px', lineHeight: 1.15 }}>Switch Word?</h1>
        <div style={{ background: 'linear-gradient(135deg,#FFF4EC,#FFE8D4)', borderRadius: 20, padding: 24, textAlign: 'center', marginBottom: 20, border: '1px solid #F0DDD0' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Example</div>
          <div className="display" style={{ fontStyle: 'italic', fontSize: 42, color: '#E8784B' }}>TOGETHER</div>
          <div style={{ fontSize: 12, color: 'var(--ts)', marginTop: 6, lineHeight: 1.5 }}>Attracts resources, people,<br />and opportunities to you</div>
        </div>
        <p style={{ fontSize: 14, color: 'var(--ts)', lineHeight: 1.7, margin: '0 0 14px' }}>
          Switch words are single words that <strong style={{ color: 'var(--tp)' }}>shift your mental and energetic state</strong> when repeated with intention.
        </p>
        <p style={{ fontSize: 14, color: 'var(--ts)', lineHeight: 1.7, margin: '0 0 20px' }}>
          Unlike affirmations, they bypass conscious resistance — going straight to the subconscious.
        </p>
        <div style={{ background: 'var(--bg-c)', borderRadius: 16, padding: '18px 20px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 11, letterSpacing: '0.08em' }}>HOW IT WORKS</div>
          {[
            'Choose a word matching your intention',
            'Repeat it 9–45 times, silently or aloud',
            'Feel the shift — notice what opens',
          ].map((text, i) => (
            <div key={text} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 2 ? 10 : 0 }}>
              <div style={{ width: 22, height: 22, background: 'var(--co)', color: 'white', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: 13, color: 'var(--ts)', lineHeight: 1.45 }}>{text}</span>
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
