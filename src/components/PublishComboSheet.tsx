import { useState } from 'react';
import { COMBO_TAGS, type ComboTag } from '../data/combo-tags';
import { WORD_COLOR_MAP } from '../data/switch-words';
import { USER_ERROR_MESSAGE } from '../lib/errors';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Combo } from '../types';

interface PublishComboSheetProps {
  combo: Combo;
  onClose: () => void;
  onPublish: (tag: ComboTag) => Promise<void>;
}

export function PublishComboSheet({ combo, onClose, onPublish }: PublishComboSheetProps) {
  const [tag, setTag] = useState<ComboTag>('General');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await onPublish(tag);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : USER_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <div
        className="sheet-panel"
        role="dialog"
        aria-labelledby="publish-combo-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-panel__handle" aria-hidden />
        <h2 id="publish-combo-title" className="display" style={{ fontSize: 22, margin: '0 0 6px' }}>
          Share to Exchange
        </h2>
        <p style={{ fontSize: 12, color: 'var(--tm)', margin: '0 0 16px', lineHeight: 1.55 }}>
          Publish <strong style={{ color: 'var(--ts)' }}>{combo.name}</strong> for others to discover and upvote.
        </p>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 16 }}>
          {combo.words.map((w) => {
            const color = WORD_COLOR_MAP[w] ?? 'var(--co)';
            return (
              <span key={w} className="display" style={{ fontSize: 11, fontStyle: 'italic', color, padding: '4px 10px', background: `${color}1A`, borderRadius: 10 }}>{w}</span>
            );
          })}
        </div>

        {!isSupabaseConfigured && (
          <p className="publish-combo-hint" role="alert">
            Add Supabase credentials to publish combos to the community exchange.
          </p>
        )}

        <div className="eyebrow" style={{ marginBottom: 8, fontWeight: 600 }}>Category</div>
        <div className="publish-tag-grid">
          {COMBO_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              className={`publish-tag${tag === t ? ' publish-tag--active' : ''}`}
              onClick={() => setTag(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {error && <p className="publish-combo-error" role="alert">{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
          <button type="button" className="btn-primary" disabled={loading || !isSupabaseConfigured} onClick={submit}>
            {loading ? 'Publishing…' : 'Publish Combo'}
          </button>
          <button type="button" className="btn-ghost" disabled={loading} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
