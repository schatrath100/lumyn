import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { WORD_COLOR_MAP } from '../../data/switch-words';
import { useApp } from '../../context/AppContext';

export function AnalyticsScreen() {
  const navigate = useNavigate();
  const { state } = useApp();

  const wordCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const entry of state.journalEntries) {
      counts[entry.word] = (counts[entry.word] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [state.journalEntries]);

  const maxCount = wordCounts[0]?.[1] ?? 1;
  const avgShift = useMemo(() => {
    if (!state.journalEntries.length) return 0;
    const total = state.journalEntries.reduce((s, e) => s + (e.moodAfter - e.moodBefore), 0);
    return (total / state.journalEntries.length).toFixed(1);
  }, [state.journalEntries]);

  const recentMoods = state.journalEntries.slice(0, 7).map((e) => e.moodAfter);

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 18px' }}>
        <button type="button" className="btn-back" onClick={() => navigate('/journal')}>← Back</button>
        <div className="display" style={{ fontSize: 26, marginBottom: 16 }}>Your Journey</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <div style={{ background: 'var(--bg-s)', borderRadius: 16, padding: 16, border: '1px solid var(--bd)' }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🔥</div>
            <div className="display" style={{ fontSize: 32, color: 'var(--co)' }}>{state.streak}</div>
            <div style={{ fontSize: 11, color: 'var(--tm)' }}>day streak</div>
          </div>
          <div style={{ background: 'var(--bg-s)', borderRadius: 16, padding: 16, border: '1px solid var(--bd)' }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>↗</div>
            <div className="display" style={{ fontSize: 32, color: '#4BE89B' }}>+{avgShift}</div>
            <div style={{ fontSize: 11, color: 'var(--tm)' }}>avg mood shift</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-s)', borderRadius: 16, padding: 16, border: '1px solid var(--bd)', marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 12, fontWeight: 600, fontSize: 10 }}>Most used words</div>
          {wordCounts.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--tm)', margin: 0 }}>Log journal entries to see your patterns.</p>
          ) : (
            wordCounts.map(([word, count]) => {
              const color = WORD_COLOR_MAP[word] ?? 'var(--co)';
              return (
                <div key={word} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span className="display" style={{ fontSize: 13, fontStyle: 'italic', width: 70, flexShrink: 0 }}>{word}</span>
                  <div style={{ flex: 1, height: 6, background: 'var(--bg-c)', borderRadius: 3 }}>
                    <div style={{ height: 6, width: `${(count / maxCount) * 100}%`, background: color, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--tm)', width: 18, textAlign: 'right' }}>{count}</span>
                </div>
              );
            })
          )}
        </div>

        <div style={{ background: 'var(--bg-s)', borderRadius: 16, padding: 16, border: '1px solid var(--bd)', marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 12, fontWeight: 600, fontSize: 10 }}>Recent mood trend</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
            {recentMoods.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--tm)', margin: 0 }}>No entries yet.</p>
            ) : (
              recentMoods.map((mood, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', height: `${(mood / 5) * 60}px`, background: `linear-gradient(to top, var(--co), #4BE89B)`, borderRadius: 4, minHeight: 8 }} />
                  <span style={{ fontSize: 9, color: 'var(--tm)' }}>{['😔', '😐', '🙂', '😊', '✨'][mood - 1]}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ background: 'var(--bg-s)', borderRadius: 16, padding: 16, border: '1px solid var(--bd)', marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 8, fontWeight: 600, fontSize: 10 }}>Signs logged</div>
          <div className="display" style={{ fontSize: 40, color: '#7A6CF0' }}>{state.synchronicityEntries.length}</div>
          <div style={{ fontSize: 12, color: 'var(--ts)', marginTop: 4 }}>synchronicities in your pattern map</div>
        </div>

        <div style={{ background: 'var(--bg-s)', borderRadius: 16, padding: 16, border: '1px solid var(--bd)', marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 8, fontWeight: 600, fontSize: 10 }}>Sessions logged</div>
          <div className="display" style={{ fontSize: 40, color: 'var(--co)' }}>{state.journalEntries.length}</div>
          <div style={{ fontSize: 12, color: 'var(--ts)', marginTop: 4 }}>journal entries tracking your practice</div>
        </div>
      </div>
    </div>
  );
}
