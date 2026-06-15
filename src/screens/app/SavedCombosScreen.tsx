import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublishComboSheet } from '../../components/PublishComboSheet';
import { StatusBar } from '../../components/StatusBar';
import { WORD_COLOR_MAP } from '../../data/switch-words';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';
import type { Combo } from '../../types';
import type { ComboTag } from '../../data/combo-tags';

export function SavedCombosScreen() {
  const navigate = useNavigate();
  const { state, deleteCombo, publishComboToCommunity } = useApp();
  const [publishing, setPublishing] = useState<Combo | null>(null);
  const [publishNotice, setPublishNotice] = useState<string | null>(null);

  const handlePublish = async (tag: ComboTag) => {
    if (!publishing) return;
    const published = await publishComboToCommunity(publishing.id, tag);
    setPublishNotice(`"${published.name}" is live in the exchange.`);
  };

  return (
    <>
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="display" style={{ fontSize: 26 }}>My Combos</div>
          <button type="button" className="btn-primary" style={{ width: 'auto', padding: '8px 14px', fontSize: 13, borderRadius: 12 }} onClick={() => navigate('/combo')}>+ New</button>
        </div>
        <button
          type="button"
          onClick={() => navigate('/discover')}
          style={{ width: '100%', background: 'var(--bg-c)', border: '1px solid var(--bd)', borderRadius: 14, padding: 12, marginBottom: 16, cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tp)' }}>◈ Browse Community Combos</div>
          <div style={{ fontSize: 11, color: 'var(--tm)', marginTop: 2 }}>Discover rituals shared by others</div>
        </button>

        {publishNotice && (
          <div className="publish-notice" role="status">
            {publishNotice}
            <button type="button" onClick={() => navigate('/discover')}>View exchange →</button>
          </div>
        )}

        {state.savedCombos.map((combo) => (
          <div key={combo.id} style={{ background: 'var(--bg-s)', borderRadius: 16, padding: 16, border: '1px solid var(--bd)', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{combo.name}</div>
                {combo.communityPublishedId && (
                  <div style={{ fontSize: 10, color: 'var(--co)', marginTop: 3, fontWeight: 600 }}>◈ Published to exchange</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!combo.communityPublishedId && isSupabaseConfigured && (
                  <button
                    type="button"
                    onClick={() => setPublishing(combo)}
                    style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: 'var(--co)', fontWeight: 600 }}
                    title="Share to community"
                  >
                    ↑
                  </button>
                )}
                <button type="button" onClick={() => navigate(`/sigil/${combo.id}`)} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: 'var(--cg)' }} title="Sigil">◈</button>
                <button type="button" onClick={() => navigate(`/share/${combo.id}`)} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: 'var(--co)' }}>↗</button>
                <button type="button" onClick={() => deleteCombo(combo.id)} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: 'var(--tm)' }}>×</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
              {combo.words.map((w) => {
                const color = WORD_COLOR_MAP[w] ?? 'var(--co)';
                return (
                  <span key={w} className="display" style={{ fontSize: 12, fontStyle: 'italic', color, padding: '4px 10px', background: `${color}1A`, borderRadius: 10 }}>{w}</span>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: 'var(--tm)' }}>{combo.date}</div>
          </div>
        ))}
      </div>

      {publishing && (
        <PublishComboSheet
          combo={publishing}
          onClose={() => setPublishing(null)}
          onPublish={handlePublish}
        />
      )}
    </>
  );
}
