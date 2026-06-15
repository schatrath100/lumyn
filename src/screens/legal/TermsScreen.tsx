import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { LEGAL, openExternal } from '../../lib/legal';

export function TermsScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 24px' }}>
        <button type="button" className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        <div className="display" style={{ fontSize: 26, marginBottom: 16 }}>Terms of Use</div>
        <p style={{ fontSize: 14, color: 'var(--ts)', lineHeight: 1.7, margin: '0 0 16px' }}>
          Lumyn is provided by Whyteboard for personal wellness practice. Switch words and numerology features are for inspiration and self-reflection — not medical or financial advice.
        </p>
        <p style={{ fontSize: 14, color: 'var(--ts)', lineHeight: 1.7, margin: '0 0 20px' }}>
          If you purchase a subscription through the App Store, Apple's standard Licensed Application End User License Agreement applies.
        </p>
        <button type="button" className="btn-primary" onClick={() => openExternal(LEGAL.termsOfUse)}>
          Apple Terms of Use (EULA)
        </button>
      </div>
    </div>
  );
}
