import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWordById } from '../../data/switch-words';
import { useApp } from '../../context/AppContext';

const CIRCUMFERENCE = 723;

export function SessionScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedWord, setSelectedWord, sessionCount, incrementSession, resetSession, recordActivity } = useApp();
  const word = getWordById(Number(id)) ?? selectedWord;

  useEffect(() => {
    const w = getWordById(Number(id));
    if (w) setSelectedWord(w);
    resetSession();
  }, [id, setSelectedWord, resetSession]);

  if (!word) return null;

  const target = word.reps;
  const pct = Math.min(sessionCount / target, 1);
  const dashOffset = CIRCUMFERENCE * (1 - pct);
  const done = sessionCount >= target;

  const handleTap = () => {
    if (!done) {
      incrementSession();
      if (sessionCount + 1 >= target) recordActivity();
    }
  };

  return (
    <div
      className="screen"
      onClick={handleTap}
      onKeyDown={(e) => e.key === ' ' && handleTap()}
      role="button"
      tabIndex={0}
      style={{ background: `radial-gradient(circle at center, ${word.color}22 0%, #0F0905 65%)`, cursor: 'pointer', userSelect: 'none' }}
    >
      <div className="screen__status" style={{ color: 'rgba(255,248,242,0.2)' }}>
        <span>9:41</span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); navigate(`/library/${word.id}`); }}
          style={{ background: 'none', border: 'none', color: 'rgba(255,248,242,0.35)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', padding: 0 }}
        >
          Exit ×
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 18, pointerEvents: 'none' }}>
        <div style={{ position: 'relative', width: 260, height: 260, flexShrink: 0 }}>
          <svg width="260" height="260" viewBox="0 0 260 260" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="130" cy="130" r="115" fill="none" stroke="#2A1810" strokeWidth="6" />
            <circle cx="130" cy="130" r="115" fill="none" stroke="rgba(242,196,74,0.15)" strokeWidth="16" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={dashOffset} strokeLinecap="round" transform="rotate(-90 130 130)" />
            <circle cx="130" cy="130" r="115" fill="none" stroke={word.color} strokeWidth="4.5" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={dashOffset} strokeLinecap="round" transform="rotate(-90 130 130)" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 16px' }}>
            <div className="display" style={{ fontSize: 32, color: '#FEF3EB', fontStyle: 'italic', lineHeight: 1.1 }}>{word.word}</div>
            <div style={{ fontSize: 26, fontWeight: 300, color: '#F2C44A', marginTop: 10 }}>{sessionCount} / {target}</div>
          </div>
        </div>
        {done && (
          <div className="display fade-up" style={{ fontSize: 18, color: '#F2C44A', fontStyle: 'italic' }}>✦ Complete</div>
        )}
        <div style={{ fontSize: 11, color: 'rgba(255,248,242,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {done ? 'Session complete' : 'Tap anywhere to count'}
        </div>
        {!done && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); navigate(`/mantra/${word.id}`); }}
            style={{ pointerEvents: 'auto', marginTop: 8, padding: '10px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, color: 'rgba(255,248,242,0.6)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            Switch to Mantra Mode →
          </button>
        )}
      </div>
    </div>
  );
}
