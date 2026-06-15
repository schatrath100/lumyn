import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { SWITCH_WORDS } from '../../data/switch-words';
import { useApp } from '../../context/AppContext';

export function ComboScreen() {
  const navigate = useNavigate();
  const { comboWords, comboName, setComboName, addToCombo, removeFromCombo, saveCombo } = useApp();

  const handleSave = () => {
    saveCombo();
    navigate('/combos');
  };

  return (
    <>
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 18px' }}>
        <div className="display" style={{ fontSize: 26, marginBottom: 16 }}>Combo Builder</div>
        <div style={{ marginBottom: 16 }}>
          <label className="eyebrow" style={{ display: 'block', marginBottom: 7, fontWeight: 600 }}>Combo name</label>
          <input
            className="input input--surface"
            value={comboName}
            onChange={(e) => setComboName(e.target.value)}
            placeholder="e.g. Morning Abundance Ritual"
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 10, fontWeight: 600 }}>Add words</div>
          <div className="chip-scroll" style={{ flexWrap: 'nowrap', paddingBottom: 8 }}>
            {SWITCH_WORDS.map((w) => {
              const inCombo = comboWords.some((cw) => cw.id === w.id);
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => addToCombo(w)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 20,
                    cursor: 'pointer',
                    border: `1.5px solid ${inCombo ? 'var(--co)' : 'var(--bd)'}`,
                    background: inCombo ? 'rgba(232,120,75,0.08)' : 'var(--bg-c)',
                    fontSize: 12,
                    fontWeight: inCombo ? 600 : 400,
                    color: inCombo ? 'var(--co)' : 'var(--tp)',
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    flexShrink: 0,
                  }}
                >
                  {w.word}
                </button>
              );
            })}
          </div>
        </div>
        {comboWords.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 10, fontWeight: 600 }}>Your combo</div>
            {comboWords.map((w, i) => (
              <div key={w.id} style={{ background: 'var(--bg-s)', borderRadius: 9, padding: '9px 10px', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--bd)', marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, background: 'rgba(232,120,75,0.12)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--co)' }}>{i + 1}</div>
                <span className="display" style={{ fontSize: 13, fontStyle: 'italic', flex: 1 }}>{w.word}</span>
                <button type="button" onClick={() => removeFromCombo(w.id)} style={{ background: 'none', border: 'none', fontSize: 14, color: 'var(--tm)', cursor: 'pointer' }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="screen__footer">
        <button type="button" className="btn-primary" disabled={!comboWords.length} onClick={handleSave}>Save Combo ✦</button>
      </div>
    </>
  );
}
