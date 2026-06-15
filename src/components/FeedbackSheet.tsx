import { useState } from 'react';
import { APP_VERSION } from '../lib/app-meta';
import { USER_ERROR_MESSAGE } from '../lib/errors';
import { isSupabaseConfigured } from '../lib/supabase';
import { submitFeedback } from '../lib/supabase-sync';

const CHARACTER_LIMIT = 140;

interface FeedbackSheetProps {
  onClose: () => void;
}

export function FeedbackSheet({ onClose }: FeedbackSheetProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const trimmed = message.trim();
  const canSubmit = trimmed.length > 0 && !loading && !submitted;

  const send = async () => {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      await submitFeedback(trimmed, APP_VERSION);
      setSubmitted(true);
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
        aria-labelledby="feedback-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-panel__handle" aria-hidden />
        <h2 id="feedback-sheet-title" className="display" style={{ fontSize: 22, margin: '0 0 6px' }}>
          Feedback
        </h2>
        <p style={{ fontSize: 12, color: 'var(--tm)', margin: '0 0 16px', lineHeight: 1.55 }}>
          Share a thought, bug, or idea. We read every note.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div className="display" style={{ fontSize: 20, marginBottom: 8 }}>Thank you.</div>
            <p style={{ fontSize: 13, color: 'var(--tm)', margin: 0 }}>Your note was saved.</p>
            <button type="button" className="btn-primary" style={{ marginTop: 24 }} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            {!isSupabaseConfigured && (
              <p className="publish-combo-hint" role="alert">
                Cloud connection is required to send feedback. Add Supabase keys to your environment.
              </p>
            )}
            <label className="feedback-field">
              <span className="sr-only">Your feedback</span>
              <textarea
                className="feedback-field__input"
                placeholder="What's on your mind?"
                value={message}
                rows={4}
                maxLength={CHARACTER_LIMIT}
                onChange={(e) => setMessage(e.target.value)}
              />
              <span className="feedback-field__count">{message.length} / {CHARACTER_LIMIT}</span>
            </label>
            {error && <p className="publish-combo-error" role="alert">{error}</p>}
            <button
              type="button"
              className="btn-primary"
              style={{ marginTop: 16 }}
              disabled={!canSubmit || !isSupabaseConfigured}
              onClick={() => void send()}
            >
              {loading ? 'Sending…' : 'Send'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
