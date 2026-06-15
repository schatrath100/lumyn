import { useNavigate } from 'react-router-dom';
import { ProgressDots } from '../../components/ProgressDots';
import { StatusBar } from '../../components/StatusBar';
import { INTENTIONS } from '../../data/intentions';
import { useApp } from '../../context/AppContext';

export function IntentionsScreen() {
  const navigate = useNavigate();
  const { state, toggleIntention } = useApp();
  const selected = state.profile.selectedIntentions;

  return (
    <div className="screen screen--card">
      <StatusBar />
      <ProgressDots total={8} active={3} />
      <div className="screen__body" style={{ padding: '0 24px' }}>
        <h1 className="display" style={{ fontSize: 32, fontWeight: 400, margin: '0 0 6px', lineHeight: 1.2 }}>What draws<br />you here?</h1>
        <p style={{ fontSize: 13, color: 'var(--ts)', margin: '0 0 20px' }}>Choose up to 3 intentions. We'll curate your library.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 16 }}>
          {INTENTIONS.map((intention) => {
            const isSelected = selected.includes(intention.id);
            return (
              <button
                key={intention.id}
                type="button"
                onClick={() => toggleIntention(intention.id)}
                style={{
                  padding: '14px 12px',
                  borderRadius: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 8,
                  border: `1.5px solid ${isSelected ? 'var(--co)' : 'var(--bd)'}`,
                  background: isSelected ? 'rgba(232,120,75,0.08)' : 'var(--bg-c)',
                }}
              >
                <span style={{ fontSize: 20, lineHeight: 1 }}>{intention.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--tp)', textAlign: 'left', lineHeight: 1.3 }}>{intention.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="screen__footer" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button type="button" className="btn-primary" onClick={() => navigate('/onboarding/profile')}>Continue</button>
        <button type="button" className="btn-ghost" onClick={() => navigate('/onboarding/profile')}>Skip for now</button>
      </div>
    </div>
  );
}
