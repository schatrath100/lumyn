import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { useApp } from '../../context/AppContext';

export function MoodResultScreen() {
  const navigate = useNavigate();
  const { selectedMood, selectedWord } = useApp();

  if (!selectedMood || !selectedWord) {
    return (
      <div className="screen screen--card">
        <StatusBar />
        <div className="screen__body" style={{ padding: 24 }}>
          <button type="button" className="btn-back" onClick={() => navigate('/')}>← Back</button>
          <p>Select a mood first.</p>
        </div>
      </div>
    );
  }

  const moodColor = selectedMood.color;

  return (
    <div className="screen screen--card">
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 24px' }}>
        <button type="button" className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        <div className="eyebrow" style={{ marginBottom: 6 }}>You're feeling</div>
        <div className="display" style={{ fontSize: 32, fontStyle: 'italic', marginBottom: 22 }}>{selectedMood.label}</div>
        <div style={{ background: `linear-gradient(135deg, ${moodColor} 0%, ${moodColor}BB 100%)`, borderRadius: 20, padding: 24, marginBottom: 18 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Your matched word</div>
          <div className="display" style={{ fontSize: 50, fontStyle: 'italic', lineHeight: 1, marginBottom: 6, color: 'white' }}>{selectedWord.word}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{selectedWord.category}</div>
        </div>
        <div style={{ background: 'var(--bg-c)', borderRadius: 16, padding: 20, marginBottom: 18, border: '1px solid var(--bd)' }}>
          <div className="eyebrow" style={{ marginBottom: 8, fontWeight: 600 }}>Guidance</div>
          <p style={{ fontSize: 14, color: 'var(--ts)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{selectedMood.guidance}</p>
        </div>
      </div>
      <div className="screen__footer" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <button type="button" className="btn-primary" onClick={() => navigate(`/session/${selectedWord.id}`)}>Start Repetition Session</button>
        <button type="button" className="btn-secondary" onClick={() => navigate(`/library/${selectedWord.id}`)}>View Full Word Details</button>
      </div>
    </div>
  );
}
