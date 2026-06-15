import { useNavigate } from 'react-router-dom';
import { ProgressDots } from '../../components/ProgressDots';
import { StatusBar } from '../../components/StatusBar';
import { PERSONAL_NUMBER_PROFILES } from '../../data/personal-numbers';
import { useApp } from '../../context/AppContext';
import { calcLifePathNumber, calcPersonalNumber } from '../../lib/numerology';
import type { NumerologySystem } from '../../types';

export function PersonalNumberScreen() {
  const navigate = useNavigate();
  const {
    state,
    setUserName,
    setBirthDate,
    setNumerologySystem,
    setPersonalNumber,
    setLifePathNumber,
  } = useApp();
  const { userName, birthDate, numerologySystem, personalNumber, lifePathNumber, onboardingComplete } = state.profile;
  const profile = personalNumber ? PERSONAL_NUMBER_PROFILES[personalNumber] : null;
  const lifeProfile = lifePathNumber ? PERSONAL_NUMBER_PROFILES[lifePathNumber] : null;

  const calculate = () => {
    setPersonalNumber(calcPersonalNumber(userName, numerologySystem));
    if (birthDate) setLifePathNumber(calcLifePathNumber(birthDate));
  };

  return (
    <div className="screen screen--card">
      <StatusBar />
      {onboardingComplete ? (
        <div style={{ padding: '0 28px' }}>
          <button type="button" className="btn-back" onClick={() => navigate('/settings')}>← Back</button>
        </div>
      ) : (
        <ProgressDots total={8} active={5} />
      )}
      <div className="screen__body" style={{ padding: '0 28px' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Chaldean Numerology</div>
        <h1 className="display" style={{ fontSize: 32, fontWeight: 400, margin: '0 0 6px', lineHeight: 1.2 }}>Your Personal<br />Number</h1>
        <p style={{ fontSize: 13, color: 'var(--ts)', margin: '0 0 16px', lineHeight: 1.55 }}>
          Your name and birth date hold your core vibration. We'll surface words and combos that resonate. <strong style={{ color: 'var(--tp)', fontWeight: 500 }}>Optional</strong> — skip anytime.
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['chaldean', 'pythagorean'] as NumerologySystem[]).map((sys) => (
            <button
              key={sys}
              type="button"
              className={`chip${numerologySystem === sys ? ' chip--active' : ''}`}
              onClick={() => setNumerologySystem(sys)}
              style={{ flex: 1, textAlign: 'center', textTransform: 'capitalize' }}
            >
              {sys}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="eyebrow" style={{ display: 'block', marginBottom: 7, fontWeight: 600 }}>Your full name</label>
          <input className="input" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your name…" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="eyebrow" style={{ display: 'block', marginBottom: 7, fontWeight: 600 }}>Birth date (life path)</label>
          <input className="input" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </div>
        <button type="button" className="btn-secondary" style={{ marginBottom: 20 }} onClick={calculate}>
          Calculate My Numbers ✦
        </button>

        {profile && personalNumber && (
          <div className="pop-in" style={{ background: 'linear-gradient(135deg,#FFF4EC,#FFE4CC)', borderRadius: 20, padding: 24, textAlign: 'center', border: '1px solid #F0DDD0', marginBottom: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Expression · {numerologySystem}</div>
            <div className="display" style={{ fontSize: 64, color: '#E8784B', lineHeight: 1 }}>{personalNumber}</div>
            <div className="display" style={{ fontSize: 19, fontStyle: 'italic', margin: '8px 0 5px' }}>{profile.title}</div>
            <div style={{ fontSize: 12, color: 'var(--ts)', lineHeight: 1.55, marginBottom: 14 }}>{profile.description}</div>
            <div className="display" style={{ fontSize: 14, color: '#E8784B', fontStyle: 'italic' }}>{profile.words.join(' · ')}</div>
          </div>
        )}

        {lifeProfile && lifePathNumber && (
          <div className="pop-in" style={{ background: 'var(--bg-c)', borderRadius: 16, padding: 20, textAlign: 'center', border: '1px solid var(--bd)', marginBottom: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Life Path</div>
            <div className="display" style={{ fontSize: 48, color: '#7A6CF0', lineHeight: 1 }}>{lifePathNumber}</div>
            <div className="display" style={{ fontSize: 17, fontStyle: 'italic', margin: '6px 0' }}>{lifeProfile.title}</div>
            <div className="display" style={{ fontSize: 13, color: '#7A6CF0', fontStyle: 'italic' }}>{lifeProfile.words.join(' · ')}</div>
          </div>
        )}
      </div>
      <div className="screen__footer" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button type="button" className="btn-primary" onClick={() => navigate(onboardingComplete ? '/settings' : '/onboarding/reminders')}>
          {onboardingComplete ? 'Save' : 'Continue'}
        </button>
        {!onboardingComplete && (
          <button type="button" className="btn-ghost" onClick={() => navigate('/onboarding/reminders')}>Skip for now</button>
        )}
      </div>
    </div>
  );
}
