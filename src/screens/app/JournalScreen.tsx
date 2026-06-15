import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { getDailyWord } from '../../lib/daily-word';
import { useApp } from '../../context/AppContext';

const MOOD_EMOJIS = [
  { sym: '😔', val: 1 as const },
  { sym: '😐', val: 2 as const },
  { sym: '🙂', val: 3 as const },
  { sym: '😊', val: 4 as const },
  { sym: '✨', val: 5 as const },
];

const EMOJI_MAP: Record<number, string> = { 1: '😔', 2: '😐', 3: '🙂', 4: '😊', 5: '✨' };

type Tab = 'practice' | 'signs';

export function JournalScreen() {
  const navigate = useNavigate();
  const { state, selectedWord, saveJournalEntry, saveSynchronicityEntry } = useApp();
  const [tab, setTab] = useState<Tab>('practice');
  const [showNew, setShowNew] = useState(false);
  const [showNewSign, setShowNewSign] = useState(false);
  const [moodBefore, setMoodBefore] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [moodAfter, setMoodAfter] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [note, setNote] = useState('');
  const [sign, setSign] = useState('');
  const [signNote, setSignNote] = useState('');
  const word = selectedWord?.word ?? getDailyWord(new Date(), state.profile).word.word;

  const handleSave = () => {
    saveJournalEntry({ word, moodBefore: moodBefore ?? 2, moodAfter: moodAfter ?? 4, note });
    setShowNew(false);
    setMoodBefore(null);
    setMoodAfter(null);
    setNote('');
  };

  const handleSaveSign = () => {
    if (!sign.trim()) return;
    saveSynchronicityEntry({ word, sign: sign.trim(), note: signNote });
    setShowNewSign(false);
    setSign('');
    setSignNote('');
  };

  return (
    <>
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="display" style={{ fontSize: 26 }}>Journal</div>
          <button
            type="button"
            className="btn-primary"
            style={{ width: 'auto', padding: '8px 14px', fontSize: 13, borderRadius: 12 }}
            onClick={() => (tab === 'practice' ? setShowNew(true) : setShowNewSign(true))}
          >
            + {tab === 'practice' ? 'Entry' : 'Sign'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['practice', 'signs'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              className={`chip${tab === t ? ' chip--active' : ''}`}
              onClick={() => setTab(t)}
              style={{ flex: 1, textAlign: 'center' }}
            >
              {t === 'practice' ? 'Practice' : 'Synchronicity'}
            </button>
          ))}
        </div>

        {tab === 'practice' && (
          <>
            {showNew && (
              <div style={{ background: 'var(--bg-s)', borderRadius: 16, padding: 16, border: '1px solid var(--bd)', marginBottom: 16 }} className="pop-in">
                <div className="eyebrow" style={{ marginBottom: 6 }}>Word used</div>
                <div className="display" style={{ fontSize: 17, fontStyle: 'italic', color: 'var(--co)', marginBottom: 12 }}>{word}</div>
                <div className="eyebrow" style={{ marginBottom: 8, fontWeight: 600 }}>Mood before</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                  {MOOD_EMOJIS.map((em) => (
                    <button key={`b-${em.val}`} type="button" className={`mood-emoji-btn${moodBefore === em.val ? ' mood-emoji-btn--selected' : ''}`} onClick={() => setMoodBefore(em.val)}>{em.sym}</button>
                  ))}
                </div>
                <div className="eyebrow" style={{ marginBottom: 8, fontWeight: 600 }}>Mood after</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                  {MOOD_EMOJIS.map((em) => (
                    <button key={`a-${em.val}`} type="button" className={`mood-emoji-btn${moodAfter === em.val ? ' mood-emoji-btn--selected' : ''}`} onClick={() => setMoodAfter(em.val)}>{em.sym}</button>
                  ))}
                </div>
                <textarea className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="How did it feel?" style={{ height: 64, resize: 'none', marginBottom: 12, fontSize: 14 }} />
                <button type="button" className="btn-primary" onClick={handleSave}>Save Entry ✦</button>
              </div>
            )}
            {state.journalEntries.map((je) => {
              const afterColor = je.moodAfter >= 4 ? '#4BE89B' : '#E8784B';
              return (
                <div key={je.id} style={{ background: 'var(--bg-s)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, border: '1px solid var(--bd)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span className="display" style={{ fontSize: 17, fontStyle: 'italic' }}>{je.word}</span>
                    <span style={{ fontSize: 11, color: 'var(--tm)' }}>{je.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: je.note ? 8 : 0 }}>
                    <span>{EMOJI_MAP[je.moodBefore]}</span>
                    <div style={{ flex: 1, height: 4, background: 'var(--bg-c)', borderRadius: 2 }}>
                      <div style={{ height: 4, width: `${(je.moodAfter / 5) * 100}%`, background: `linear-gradient(to right,#F2C44A,${afterColor})`, borderRadius: 2 }} />
                    </div>
                    <span>{EMOJI_MAP[je.moodAfter]}</span>
                  </div>
                  {je.note && <p style={{ fontSize: 12, color: 'var(--ts)', fontStyle: 'italic', margin: 0 }}>{je.note}</p>}
                </div>
              );
            })}
          </>
        )}

        {tab === 'signs' && (
          <>
            <p style={{ fontSize: 12, color: 'var(--ts)', margin: '0 0 14px', lineHeight: 1.55 }}>
              Log coincidences, number patterns, and shifts you notice after practicing. Your personal pattern map grows over time.
            </p>
            {showNewSign && (
              <div style={{ background: 'var(--bg-s)', borderRadius: 16, padding: 16, border: '1px solid var(--bd)', marginBottom: 16 }} className="pop-in">
                <div className="eyebrow" style={{ marginBottom: 6 }}>After word</div>
                <div className="display" style={{ fontSize: 17, fontStyle: 'italic', color: 'var(--co)', marginBottom: 14 }}>{word}</div>
                <div className="eyebrow" style={{ marginBottom: 8, fontWeight: 600 }}>Sign noticed</div>
                <input className="input" value={sign} onChange={(e) => setSign(e.target.value)} placeholder="e.g. Saw 111, unexpected message…" style={{ marginBottom: 12 }} />
                <textarea className="input" value={signNote} onChange={(e) => setSignNote(e.target.value)} placeholder="What did it mean to you?" style={{ height: 56, resize: 'none', marginBottom: 12, fontSize: 14 }} />
                <button type="button" className="btn-primary" onClick={handleSaveSign}>Log Sign ✦</button>
              </div>
            )}
            {state.synchronicityEntries.map((se) => (
              <div key={se.id} style={{ background: 'var(--bg-s)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, border: '1px solid var(--bd)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="display" style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--co)' }}>{se.word}</span>
                  <span style={{ fontSize: 11, color: 'var(--tm)' }}>{se.date}</span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--tp)', marginBottom: se.note ? 6 : 0, lineHeight: 1.5 }}>✦ {se.sign}</div>
                {se.note && <p style={{ fontSize: 12, color: 'var(--ts)', fontStyle: 'italic', margin: 0 }}>{se.note}</p>}
              </div>
            ))}
          </>
        )}

        <button
          type="button"
          onClick={() => navigate('/analytics')}
          style={{ width: '100%', marginTop: 8, marginBottom: 16, background: 'linear-gradient(135deg,#1E110A,#3A2010)', borderRadius: 16, padding: 20, border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{ fontSize: 10, color: 'rgba(242,196,74,0.6)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>Insights</div>
          <div className="display" style={{ fontSize: 20, color: '#F2C44A', marginBottom: 4 }}>View Your Journey →</div>
          <div style={{ fontSize: 12, color: 'rgba(255,248,242,0.45)' }}>Streaks, mood trends, and pattern recognition</div>
        </button>
      </div>
    </>
  );
}
