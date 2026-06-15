import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { getWordById } from '../../data/switch-words';
import { useApp } from '../../context/AppContext';

export function WordDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedWord, setSelectedWord, addToCombo, isWordSaved, toggleSavedWord } = useApp();
  const word = getWordById(Number(id)) ?? selectedWord;

  useEffect(() => {
    const w = getWordById(Number(id));
    if (w) setSelectedWord(w);
  }, [id, setSelectedWord]);

  if (!word) {
    return (
      <div className="screen screen--card">
        <StatusBar />
        <div className="screen__body" style={{ padding: 24 }}>
          <button type="button" className="btn-back" onClick={() => navigate(-1)}>← Back</button>
          <p>Word not found.</p>
        </div>
      </div>
    );
  }

  const saved = isWordSaved(word.word);

  return (
    <div className="screen screen--card">
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 24px' }}>
        <button type="button" className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        <div style={{ textAlign: 'center', padding: '20px 0 20px' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{word.category}</div>
          <div className="display" style={{ fontSize: 44, fontStyle: 'italic', lineHeight: 1, marginBottom: 14 }}>{word.word}</div>
          <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, color: word.color, background: `${word.color}1A` }}>✦ Repeat {word.reps}×</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 8, fontWeight: 600 }}>About this word</div>
          <p style={{ fontSize: 10, color: 'var(--ts)', lineHeight: 1.6, margin: 0 }}>{word.description}</p>
        </div>
        <div style={{ background: 'var(--bg-c)', borderRadius: 10, padding: '14px 16px', marginBottom: 24, border: '1px solid var(--bd)' }}>
          <div className="eyebrow" style={{ marginBottom: 8, fontWeight: 600 }}>How to use</div>
          <p style={{ fontSize: 9, color: 'var(--ts)', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>{word.how}</p>
        </div>
      </div>
      <div className="screen__footer" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <button type="button" className="btn-primary" onClick={() => navigate(`/session/${word.id}`)}>Start Repetition Session</button>
        <button type="button" className="btn-secondary" onClick={() => navigate(`/mantra/${word.id}`)}>🎵 Mantra Mode</button>
        <div style={{ display: 'flex', gap: 9 }}>
          <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => { addToCombo(word); navigate('/combo'); }}>+ Add to Combo</button>
          <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => toggleSavedWord(word.word)}>{saved ? '♥ Saved' : '♡ Save'}</button>
        </div>
      </div>
    </div>
  );
}
