import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { USER_ERROR_MESSAGE } from '../../lib/errors';
import { useApp } from '../../context/AppContext';

export function DeleteDataScreen() {
  const navigate = useNavigate();
  const { deleteAllData, cloudUserId } = useApp();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await deleteAllData();
      navigate('/onboarding', { replace: true });
    } catch {
      setError(USER_ERROR_MESSAGE);
      setBusy(false);
    }
  };

  return (
    <div className="screen screen--card">
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 24px' }}>
        <button type="button" className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        <div className="display" style={{ fontSize: 26, marginBottom: 12 }}>Delete Account</div>
        <p style={{ fontSize: 14, color: 'var(--ts)', lineHeight: 1.65, margin: '0 0 20px' }}>
          This permanently deletes your Lumyn profile, mood history, journal, combos, numerology settings, and preferences on this device.
          {cloudUserId ? ' Cloud backup for your account will also be permanently removed.' : ''}
          {' '}This cannot be undone.
        </p>
        <div style={{ background: 'var(--bg-c)', borderRadius: 14, padding: 16, border: '1px solid var(--bd)', marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: 'var(--ts)', margin: 0, lineHeight: 1.55 }}>
            {cloudUserId
              ? 'Deletes all on-device data and your cloud backup, then signs you out. Required for App Store account deletion guidelines.'
              : 'No cloud account is linked. Only on-device data is removed. Enable Cloud Backup in Settings first if you want data stored remotely.'}
          </p>
        </div>
        {error && <p style={{ fontSize: 13, color: '#C44B4B', marginBottom: 12 }}>{error}</p>}
      </div>
      <div className="screen__footer" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          type="button"
          disabled={busy}
          onClick={() => void confirm()}
          style={{ width: '100%', padding: 16, background: '#C44B4B', color: 'white', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, border: 'none', borderRadius: 15, cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1 }}
        >
          {busy ? 'Deleting…' : 'Delete Account & Data'}
        </button>
        <button type="button" className="btn-ghost" onClick={() => navigate(-1)} disabled={busy}>Cancel</button>
      </div>
    </div>
  );
}
