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
      <div className="screen__body screen__body--tab">
        <header className="tab-screen-header">
          <div>
            <div className="tab-screen-header__moon">{daily.moonEmoji} {daily.moonLabel} ✦</div>
            <h1 className="tab-screen-header__title">Today&apos;s Word</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className="icon-btn icon-btn--surface"
              onClick={() => navigate('/widget')}
              title="Widget view"
              aria-label="Open widget view"
            >
              ◫
            </button>
            <button
              type="button"
              className="icon-btn icon-btn--accent"
              onClick={() => navigate('/settings')}
              title="Settings"
              aria-label="Open settings"
            >
              ⚙
            </button>
          </div>
        </header>

        <div className="tab-screen-content" style={{ paddingTop: 0 }}>
          <button type="button" className="daily-word-card" onClick={openDaily}>
            <div className="daily-word-card__glow" />
            <div className="daily-word-card__eyebrow">
              Word of the Day{daily.isPersonalized ? ' · For You' : ''}
            </div>
            <div className="daily-word-card__word">{daily.word.word}</div>
            <div className="daily-word-card__prompt">{daily.ritualPrompt}</div>
            <div className="daily-word-card__reps">Repeat {daily.word.reps}×</div>
            <div className="daily-word-card__footer">
              <span style={{ fontSize: 16 }}>🔥</span>
              <span className="daily-word-card__streak">
                {state.streak > 0 ? `${state.streak} day streak` : 'Start your streak'}
              </span>
              <span className="daily-word-card__cta">Tap to begin →</span>
            </div>
          </button>

          {resonance && resonantWords.length > 0 && (
            <div style={{ background: 'var(--bg-s)', borderRadius: 18, padding: 16, border: '1px solid var(--bd)', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div className="eyebrow" style={{ fontWeight: 600 }}>Your {resonance} resonance</div>
                <button type="button" onClick={() => navigate('/profile/number')} style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--co)', cursor: 'pointer' }}>Edit</button>
              </div>
              <div className="chip-scroll">
                {resonantWords.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => { setSelectedWord(w); navigate(`/library/${w.id}`); }}
                    className="display"
                    style={{ padding: '8px 14px', borderRadius: 20, border: `1px solid ${w.color}44`, background: `${w.color}12`, fontSize: 14, fontStyle: 'italic', color: w.color, cursor: 'pointer', flexShrink: 0 }}
                  >
                    {w.word}
                  </button>
                ))}
              </div>
              {resonantCombos[0] && (
                <button
                  type="button"
                  onClick={() => navigate(resonantCombos[0].source === 'yours' ? '/combos' : '/discover')}
                  style={{ marginTop: 12, width: '100%', textAlign: 'left', background: 'var(--bg-c)', border: '1px solid var(--bd)', borderRadius: 12, padding: '12px 14px', cursor: 'pointer', fontSize: 13, color: 'var(--ts)' }}
                >
                  ✦ Resonant combo: <strong style={{ color: 'var(--tp)' }}>{resonantCombos[0].name}</strong>
                </button>
              )}
            </div>
          )}

          {!resonance && (
            <button
              type="button"
              onClick={() => navigate('/profile/number')}
              style={{ width: '100%', background: 'var(--bg-c)', border: '1px dashed var(--bd)', borderRadius: 16, padding: 16, marginBottom: 16, cursor: 'pointer', textAlign: 'left' }}
            >
              <div className="eyebrow" style={{ marginBottom: 6 }}>Personalize</div>
              <div style={{ fontSize: 15, color: 'var(--ts)', lineHeight: 1.45 }}>Add your name & birth date for resonant words →</div>
            </button>
          )}

          <div className="section-label">How are you feeling?</div>
          <div className="mood-grid">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                type="button"
                className="mood-grid__item"
                onClick={() => handleMood(mood)}
              >
                <div className="mood-grid__icon" style={{ background: mood.tileBg, color: mood.color }}>{mood.sym}</div>
                <span className="mood-grid__label">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
