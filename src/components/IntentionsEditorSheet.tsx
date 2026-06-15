import { useState } from 'react';
import { IntentionsGrid } from './IntentionsGrid';
import { useApp } from '../context/AppContext';

interface IntentionsEditorSheetProps {
  onClose: () => void;
}

export function IntentionsEditorSheet({ onClose }: IntentionsEditorSheetProps) {
  const { state, toggleIntention } = useApp();
  const selected = state.profile.selectedIntentions;
  const [notice, setNotice] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setNotice(null);
    const has = selected.includes(id);
    if (!has && selected.length >= 3) {
      setNotice('Choose up to 3 intentions.');
      return;
    }
    toggleIntention(id);
  };

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <div
        className="sheet-panel"
        role="dialog"
        aria-labelledby="intentions-editor-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-panel__handle" aria-hidden />
        <h2 id="intentions-editor-title" className="display" style={{ fontSize: 22, margin: '0 0 6px' }}>
          Your intentions
        </h2>
        <p style={{ fontSize: 12, color: 'var(--tm)', margin: '0 0 16px', lineHeight: 1.55 }}>
          Choose up to 3. Lumyn uses these to curate your library and daily word.
        </p>
        <IntentionsGrid selected={selected} onToggle={handleToggle} />
        {notice && <p className="publish-combo-error" role="alert">{notice}</p>}
        <button type="button" className="btn-primary" style={{ marginTop: 18 }} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
