import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWordById } from '../../data/switch-words';
import { useMantraAudio } from '../../hooks/useMantraAudio';
import { useApp } from '../../context/AppContext';

const CIRCUMFERENCE = 723;

export function MantraScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedWord, setSelectedWord, state, toggleMantraAmbient, toggleMantraBinaural, recordActivity } = useApp();
  const word = getWordById(Number(id)) ?? selectedWord;
  const [count, setCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { speakWord, stopTones } = useMantraAudio(word?.word ?? '', {
    ambient: state.settings.mantraAmbient,
    binaural: state.settings.mantraBinaural,
  });

  useEffect(() => {
    const w = getWordById(Number(id));
    if (w) setSelectedWord(w);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      stopTones();
      window.speechSynthesis?.cancel();
    };
  }, [id, setSelectedWord, stopTones]);

  if (!word) {
    return (
      <div className="screen" style={{ background: '#0F0905' }}>
        <div className="screen__status">
          <button type="button" className="btn-back" style={{ color: 'rgba(255,248,242,0.5)', margin: 0 }} onClick={() => navigate('/library')}>← Back</button>
          <span />
        </div>
        <div className="screen__body" style={{ padding: 24, color: '#FEF3EB' }}>
          <p>Word not found.</p>
        </div>
      </div>
    );
  }

  const target = word.reps;
  const done = count >= target;
  const pct = Math.min(count / target, 1);
  const dashOffset = CIRCUMFERENCE * (1 - pct);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.speechSynthesis?.cancel();
      return;
    }
    setPlaying(true);
    speakWord();
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        const next = c + 1;
        if (next >= target) {
          setPlaying(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          recordActivity();
          return target;
        }
        speakWord();
        return next;
      });
    }, 2800);
  };

  return (
    <div className="screen" style={{ background: `radial-gradient(circle at center, ${word.color}18 0%, #0F0905 70%)` }}>
      <div className="screen__status" style={{ color: 'rgba(255,248,242,0.2)' }}>
        <span>Mantra</span>
        <button type="button" onClick={() => navigate(`/library/${word.id}`)} style={{ background: 'none', border: 'none', color: 'rgba(255,248,242,0.35)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Exit ×</button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 16 }}>
        <div style={{ position: 'relative', width: 260, height: 260 }}>
          <svg width="260" height="260" viewBox="0 0 260 260" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="130" cy="130" r="115" fill="none" stroke="#2A1810" strokeWidth="6" />
            <circle cx="130" cy="130" r="115" fill="none" stroke={word.color} strokeWidth="4.5" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={dashOffset} strokeLinecap="round" transform="rotate(-90 130 130)" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="display" style={{ fontSize: 36, color: '#FEF3EB', fontStyle: 'italic' }}>{word.word}</div>
            <div style={{ fontSize: 22, color: '#F2C44A', marginTop: 8 }}>{count} / {target}</div>
          </div>
        </div>

        <button type="button" className="btn-primary" style={{ width: 'auto', minWidth: 200, padding: '16px 32px' }} onClick={togglePlay}>
          {done ? '✦ Complete' : playing ? 'Pause' : '▶ Start Mantra'}
        </button>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button
            type="button"
            onClick={toggleMantraAmbient}
            style={{ padding: '8px 14px', borderRadius: 20, border: `1px solid ${state.settings.mantraAmbient ? 'var(--co)' : 'var(--bd)'}`, background: state.settings.mantraAmbient ? 'rgba(232,120,75,0.1)' : 'transparent', color: 'var(--ts)', fontSize: 12, cursor: 'pointer' }}
          >
            ≋ Ambient
          </button>
          <button
            type="button"
            onClick={toggleMantraBinaural}
            style={{ padding: '8px 14px', borderRadius: 20, border: `1px solid ${state.settings.mantraBinaural ? 'var(--co)' : 'var(--bd)'}`, background: state.settings.mantraBinaural ? 'rgba(232,120,75,0.1)' : 'transparent', color: 'var(--ts)', fontSize: 12, cursor: 'pointer' }}
          >
            ◉ Theta tone
          </button>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(255,248,242,0.25)', textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}>
          Hands-free repetition with voice. Optional ambient pad and low theta undertone for deep focus.
        </p>
      </div>
    </div>
  );
}
