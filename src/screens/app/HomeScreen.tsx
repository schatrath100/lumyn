import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { MOODS } from '../../data/moods';
import { COMMUNITY_COMBOS } from '../../data/community-combos';
import { getDailyWord } from '../../lib/daily-word';
import { getResonantCombos, getResonantWords } from '../../lib/resonance';
import { getResonanceNumber } from '../../lib/numerology';
import { useApp } from '../../context/AppContext';

export function HomeScreen() {
  const navigate = useNavigate();
  const { state, pickMood, setSelectedWord } = useApp();
  const daily = getDailyWord(new Date(), state.profile);
  const resonance = getResonanceNumber(state.profile.personalNumber, state.profile.lifePathNumber);
  const resonantWords = getResonantWords(resonance);
  const resonantCombos = getResonantCombos(
    state.profile.personalNumber,
    state.profile.lifePathNumber,
    state.savedCombos,
    COMMUNITY_COMBOS,
  );

  const openDaily = () => {
    setSelectedWord(daily.word);
    navigate(`/library/${daily.word.id}`);
  };

  const handleMood = (mood: (typeof MOODS)[0]) => {
    pickMood(mood);
    navigate('/mood/result');
  };

  return (
    <>
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--tm)' }}>{daily.moonEmoji} {daily.moonLabel}</div>
            <div className="display" style={{ fontSize: 22, marginTop: 2 }}>Today's Word</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => navigate('/widget')}
              style={{ width: 38, height: 38, background: 'var(--bg-s)', border: '1px solid var(--bd)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer', color: 'var(--ts)' }}
              title="Widget view"
            >
              ◫
            </button>
            <button
              type="button"
              onClick={() => navigate('/settings')}
              style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#E8784B,#F2C44A)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'white', boxShadow: '0 4px 12px rgba(232,120,75,0.3)', border: 'none', cursor: 'pointer' }}
              title="Settings"
            >
              ⚙
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={openDaily}
          style={{ width: '100%', textAlign: 'left', background: 'linear-gradient(135deg,#1E110A 0%,#3A2010 100%)', borderRadius: 22, padding: 24, marginBottom: 14, position: 'relative', overflow: 'hidden', cursor: 'pointer', border: 'none', boxShadow: '0 10px 36px rgba(30,17,10,0.28)' }}
        >
          <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(242,196,74,0.18) 0%,transparent 70%)', top: -40, right: -40 }} />
          <div style={{ fontSize: 10, color: 'rgba(242,196,74,0.65)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10, position: 'relative', zIndex: 1 }}>
            Word of the Day{daily.isPersonalized ? ' · For You' : ''}
          </div>
          <div className="display" style={{ fontSize: 46, color: '#F2C44A', fontStyle: 'italic', marginBottom: 6, position: 'relative', zIndex: 1 }}>{daily.word.word}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,248,242,0.5)', position: 'relative', zIndex: 1, marginBottom: 10, lineHeight: 1.5 }}>{daily.ritualPrompt}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,248,242,0.4)', position: 'relative', zIndex: 1, marginBottom: 14 }}>Repeat {daily.word.reps}×</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 26, height: 26, background: 'rgba(242,196,74,0.15)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🔥</div>
            <span style={{ fontSize: 12, color: 'rgba(255,248,242,0.75)', fontWeight: 500 }}>{state.streak} day streak</span>
            <span style={{ fontSize: 11, color: 'rgba(242,196,74,0.45)', marginLeft: 'auto' }}>Tap to begin →</span>
          </div>
        </button>

        {resonance && resonantWords.length > 0 && (
          <div style={{ background: 'var(--bg-s)', borderRadius: 16, padding: 14, border: '1px solid var(--bd)', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div className="eyebrow" style={{ fontWeight: 600 }}>Your {resonance} resonance</div>
              <button type="button" onClick={() => navigate('/profile/number')} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--co)', cursor: 'pointer' }}>Edit</button>
            </div>
            <div className="chip-scroll">
              {resonantWords.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => { setSelectedWord(w); navigate(`/library/${w.id}`); }}
                  className="display"
                  style={{ padding: '6px 12px', borderRadius: 20, border: `1px solid ${w.color}44`, background: `${w.color}12`, fontSize: 12, fontStyle: 'italic', color: w.color, cursor: 'pointer', flexShrink: 0 }}
                >
                  {w.word}
                </button>
              ))}
            </div>
            {resonantCombos[0] && (
              <button
                type="button"
                onClick={() => navigate(resonantCombos[0].source === 'yours' ? '/combos' : '/discover')}
                style={{ marginTop: 10, width: '100%', textAlign: 'left', background: 'var(--bg-c)', border: '1px solid var(--bd)', borderRadius: 10, padding: '8px 10px', cursor: 'pointer', fontSize: 11, color: 'var(--ts)' }}
              >
                ◈ Resonant combo: <strong style={{ color: 'var(--tp)' }}>{resonantCombos[0].name}</strong>
              </button>
            )}
          </div>
        )}

        {!resonance && (
          <button
            type="button"
            onClick={() => navigate('/profile/number')}
            style={{ width: '100%', background: 'var(--bg-c)', border: '1px dashed var(--bd)', borderRadius: 14, padding: 14, marginBottom: 14, cursor: 'pointer', textAlign: 'left' }}
          >
            <div className="eyebrow" style={{ marginBottom: 4 }}>Personalize</div>
            <div style={{ fontSize: 13, color: 'var(--ts)' }}>Add your name & birth date for resonant words →</div>
          </button>
        )}

        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 13 }}>How are you feeling?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 16 }}>
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => handleMood(mood)}
              style={{ padding: '13px 12px', borderRadius: 14, border: 'none', background: 'var(--bg-s)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 8px rgba(30,17,10,0.05)' }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 10, background: mood.tileBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, color: mood.color }}>{mood.sym}</div>
              <span style={{ fontSize: 12, fontWeight: 500 }}>{mood.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
