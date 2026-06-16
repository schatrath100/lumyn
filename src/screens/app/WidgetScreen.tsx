import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { getDailyWord } from '../../lib/daily-word';
import { useApp } from '../../context/AppContext';

/** Glanceable daily word — bookmark or add to home screen as a widget substitute. */
export function WidgetScreen() {
  const navigate = useNavigate();
  const { state } = useApp();
  const daily = getDailyWord(new Date(), state.profile);

  return (
    <div
      className="screen"
      style={{
        background: 'linear-gradient(135deg,#1E110A 0%,#3A2010 100%)',
        minHeight: '100dvh',
        justifyContent: 'center',
      }}
    >
      <StatusBar />
      <div className="screen__body" style={{ padding: '24px 24px calc(24px + var(--safe-bottom))', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 10, color: 'rgba(242,196,74,0.55)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12 }}>
          {daily.moonEmoji} Lumyn · {daily.moonLabel}
        </div>
        <div className="display" style={{ fontSize: 56, color: '#F2C44A', fontStyle: 'italic', lineHeight: 1.1, marginBottom: 12 }}>
          {daily.word.word}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,248,242,0.45)', marginBottom: 8 }}>
          Repeat {daily.word.reps}×
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,248,242,0.35)', lineHeight: 1.6, maxWidth: 280, margin: '0 auto 24px' }}>
          {daily.ritualPrompt}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <span style={{ fontSize: 13, color: 'rgba(255,248,242,0.6)' }}>{state.streak} day streak</span>
        </div>
        <button type="button" className="btn-primary" style={{ maxWidth: 280, margin: '0 auto' }} onClick={() => navigate(`/session/${daily.word.id}`)}>
          Begin Session
        </button>
        <button type="button" className="btn-ghost" style={{ color: 'rgba(255,248,242,0.4)', marginTop: 12 }} onClick={() => navigate('/')}>
          Open full app
        </button>
        <p style={{ fontSize: 10, color: 'rgba(255,248,242,0.2)', marginTop: 32, lineHeight: 1.5 }}>
          Tip: Add this page to your Home Screen for a daily glance widget.
        </p>
      </div>
    </div>
  );
}
