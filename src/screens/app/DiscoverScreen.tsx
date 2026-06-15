import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMUNITY_COMBOS } from '../../data/community-combos';
import { WORD_COLOR_MAP } from '../../data/switch-words';
import { getResonantCombos } from '../../lib/resonance';
import { fetchCommunityCombos } from '../../lib/supabase-sync';
import { isSupabaseConfigured } from '../../lib/supabase';
import type { CommunityCombo } from '../../types';
import { useApp } from '../../context/AppContext';
import { StatusBar } from '../../components/StatusBar';

export function DiscoverScreen() {
  const navigate = useNavigate();
  const { state, toggleCommunityUpvote, hasUpvoted, importCommunityCombo } = useApp();
  const [combos, setCombos] = useState<CommunityCombo[]>(COMMUNITY_COMBOS);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchCommunityCombos().then((remote) => {
      if (remote.length) setCombos(remote);
    });
  }, []);

  const resonant = getResonantCombos(
    state.profile.personalNumber,
    state.profile.lifePathNumber,
    state.savedCombos,
    combos,
  );

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 18px' }}>
        <button type="button" className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        <div className="display" style={{ fontSize: 26, marginBottom: 6 }}>Combo Exchange</div>
        <p style={{ fontSize: 13, color: 'var(--ts)', margin: '0 0 18px', lineHeight: 1.5 }}>
          Browse rituals shared by the Lumyn community. Upvote what resonates — save any combo to yours.
        </p>

        {resonant.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 10, fontWeight: 600 }}>Matched to your number</div>
            <div className="chip-scroll" style={{ flexWrap: 'wrap', gap: 8 }}>
              {resonant.filter((r) => r.source === 'community').slice(0, 3).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => navigate('/discover')}
                  style={{ padding: '8px 12px', borderRadius: 12, border: '1px solid var(--co)', background: 'rgba(232,120,75,0.08)', fontSize: 12, color: 'var(--co)', cursor: 'pointer' }}
                >
                  {r.name} · {r.score} match{r.score > 1 ? 'es' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {[...combos]
          .sort((a, b) => b.upvotes + (hasUpvoted(b.id) ? 1 : 0) - (a.upvotes + (hasUpvoted(a.id) ? 1 : 0)))
          .map((combo) => {
            const upvoted = hasUpvoted(combo.id);
            return (
              <div key={combo.id} style={{ background: 'var(--bg-s)', borderRadius: 16, padding: 16, border: '1px solid var(--bd)', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{combo.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--tm)', marginTop: 2 }}>by {combo.author} · {combo.tag}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCommunityUpvote(combo.id)}
                    style={{ background: upvoted ? 'rgba(232,120,75,0.12)' : 'var(--bg-c)', border: `1px solid ${upvoted ? 'var(--co)' : 'var(--bd)'}`, borderRadius: 20, padding: '4px 10px', fontSize: 12, cursor: 'pointer', color: upvoted ? 'var(--co)' : 'var(--ts)' }}
                  >
                    ▲ {combo.upvotes + (upvoted ? 1 : 0)}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                  {combo.words.map((w) => {
                    const color = WORD_COLOR_MAP[w] ?? 'var(--co)';
                    return (
                      <span key={w} className="display" style={{ fontSize: 12, fontStyle: 'italic', color, padding: '4px 10px', background: `${color}1A`, borderRadius: 10 }}>{w}</span>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="btn-secondary" style={{ flex: 1, width: 'auto' }} onClick={() => { importCommunityCombo(combo.name, combo.words); navigate('/combos'); }}>
                    Save to My Combos
                  </button>
                  <button type="button" className="btn-secondary" style={{ width: 'auto', padding: '14px 16px' }} onClick={() => navigate(`/sigil/community/${combo.id}`)} title="Generate sigil">
                    ◈
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
