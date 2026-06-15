import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { LEGAL, openExternal } from '../../lib/legal';

export function PrivacyScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 24px' }}>
        <button type="button" className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        <div className="display" style={{ fontSize: 26, marginBottom: 16 }}>Privacy Policy</div>
        <p style={{ fontSize: 14, color: 'var(--ts)', lineHeight: 1.7, margin: '0 0 16px' }}>
          Lumyn is designed offline-first. Your switch word practice, journal, combos, and profile data stay on your device. We do not require an account to use the app.
        </p>
        <p style={{ fontSize: 14, color: 'var(--ts)', lineHeight: 1.7, margin: '0 0 16px' }}>
          If you enable notifications or add cloud features in the future, we will update this policy. The full Whyteboard privacy policy covers all products.
        </p>
        <button type="button" className="btn-secondary" onClick={() => openExternal(LEGAL.privacyPolicy)}>
          View full policy on whyteboard.com
        </button>
      </div>
    </div>
  );
}
