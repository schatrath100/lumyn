import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { COMMUNITY_COMBOS } from '../../data/community-combos';
import { generateSigilSvg, downloadSvgAsPng, downloadSvgFile } from '../../lib/sigil';
import { useApp } from '../../context/AppContext';

export function SigilScreen() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();
  const isCommunity = location.pathname.includes('/community/');

  const combo = useMemo(() => {
    if (isCommunity) {
      return COMMUNITY_COMBOS.find((c) => c.id === id);
    }
    const saved = state.savedCombos.find((c) => c.id === id);
    return saved ? { name: saved.name, words: saved.words } : null;
  }, [id, isCommunity, state.savedCombos]);

  if (!combo) {
    return (
      <div className="screen" style={{ background: '#0F0905' }}>
        <div className="screen__body" style={{ padding: 24, color: '#FEF3EB' }}>
          <button type="button" className="btn-back" style={{ color: 'rgba(255,248,242,0.5)' }} onClick={() => navigate(-1)}>← Back</button>
          <p>Combo not found.</p>
        </div>
      </div>
    );
  }

  const svg = generateSigilSvg(combo.name, combo.words);
  const slug = combo.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="screen" style={{ background: 'linear-gradient(160deg,#1E110A,#0F0905)' }}>
      <div className="screen__status" style={{ color: 'rgba(255,248,242,0.3)' }}>
        <button type="button" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'rgba(255,248,242,0.5)', fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>← Back</button>
        <span />
      </div>
      <div className="screen__body" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="eyebrow" style={{ color: 'rgba(242,196,74,0.5)', marginBottom: 8 }}>Your Sigil</div>
        <div className="display" style={{ fontSize: 22, color: 'rgba(255,248,242,0.9)', marginBottom: 20, textAlign: 'center' }}>{combo.name}</div>
        <div
          style={{ width: '100%', maxWidth: 340, borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', marginBottom: 16 }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <p style={{ fontSize: 12, color: 'rgba(255,248,242,0.35)', textAlign: 'center', lineHeight: 1.6, margin: '0 0 20px', maxWidth: 300 }}>
          Unique geometry encoded from your word sequence. Set as wallpaper or print for your altar.
        </p>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 }}>
          {combo.words.map((w) => (
            <span key={w} className="display" style={{ fontSize: 11, fontStyle: 'italic', color: '#F2C44A', opacity: 0.7 }}>{w}</span>
          ))}
        </div>
      </div>
      <div className="screen__footer" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <button type="button" onClick={() => downloadSvgAsPng(svg, `lumyn-sigil-${slug}.png`)} style={{ width: '100%', padding: '14px', background: '#F2C44A', border: 'none', borderRadius: 15, color: '#0A0402', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Save as Wallpaper (PNG)
        </button>
        <button type="button" onClick={() => downloadSvgFile(svg, `lumyn-sigil-${slug}.svg`)} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 15, color: 'rgba(255,248,242,0.8)', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer' }}>
          Download SVG
        </button>
      </div>
    </div>
  );
}
