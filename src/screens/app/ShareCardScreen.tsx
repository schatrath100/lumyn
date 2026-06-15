import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { USER_ERROR_MESSAGE } from '../../lib/errors';

export function ShareCardScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useApp();
  const combo = state.savedCombos.find((c) => c.id === id) ?? state.savedCombos[0];

  if (!combo) {
    return (
      <div className="screen" style={{ background: 'linear-gradient(160deg,#1E110A 0%,#3A1A05 55%,#2A1208 100%)' }}>
        <div className="screen__body" style={{ padding: 24, color: '#FEF3EB' }}>
          <button type="button" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'rgba(255,248,242,0.5)', cursor: 'pointer', marginBottom: 16 }}>Close ×</button>
          <p>No combo found.</p>
        </div>
      </div>
    );
  }

  const shareText = `My Switch Combo: ${combo.name}\n${combo.words.join(' → ')}\n\nLUMYN — Words that shift your world`;

  const [copyError, setCopyError] = useState<string | null>(null);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopyError(null);
    } catch {
      setCopyError(USER_ERROR_MESSAGE);
    }
  };

  return (
    <div className="screen" style={{ background: 'linear-gradient(160deg,#1E110A 0%,#3A1A05 55%,#2A1208 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(242,196,74,0.1) 0%,transparent 70%)', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
      <div className="screen__status" style={{ color: 'rgba(255,248,242,0.3)' }}>
        <button type="button" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'rgba(255,248,242,0.5)', fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Close ×</button>
        <span />
      </div>
      <div className="screen__body" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div id="share-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(242,196,74,0.14)', borderRadius: 24, padding: '30px 26px', width: '100%', maxWidth: 340 }}>
          <div style={{ fontSize: 10, color: 'rgba(242,196,74,0.5)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12 }}>My Switch Combo</div>
          <div className="display" style={{ fontSize: 22, color: 'rgba(255,248,242,0.92)', marginBottom: 16 }}>{combo.name}</div>
          <div style={{ width: 30, height: 1, background: 'rgba(242,196,74,0.2)', marginBottom: 20 }} />
          {combo.words.map((w, i) => (
            <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, background: 'rgba(232,120,75,0.18)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#E8784B' }}>{i + 1}</div>
              <span className="display" style={{ fontSize: 24, fontStyle: 'italic', color: '#F2C44A' }}>{w}</span>
            </div>
          ))}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <div className="display" style={{ fontSize: 14, color: '#E8784B', letterSpacing: '0.2em' }}>LUMYN</div>
            <div style={{ fontSize: 9, color: 'rgba(255,248,242,0.22)', marginTop: 4 }}>Words that shift your world</div>
          </div>
        </div>
      </div>
      <div className="screen__footer" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {copyError && <p style={{ fontSize: 13, color: '#E8784B', textAlign: 'center', margin: 0 }}>{copyError}</p>}
        <button type="button" onClick={copyLink} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 15, color: 'rgba(255,248,242,0.8)', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer' }}>Copy Text</button>
        <button type="button" onClick={() => navigate(`/sigil/${combo.id}`)} style={{ width: '100%', padding: '14px', background: 'rgba(242,196,74,0.15)', border: '1px solid rgba(242,196,74,0.25)', borderRadius: 15, color: '#F2C44A', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Generate Sigil ◈</button>
        <button type="button" onClick={copyLink} style={{ width: '100%', padding: '14px', background: '#F2C44A', border: 'none', borderRadius: 15, color: '#0A0402', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Share Combo</button>
      </div>
    </div>
  );
}
