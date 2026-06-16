import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { MOOD_COLORS } from '../../data/mood-colors';
import { useApp } from '../../context/AppContext';

export function MoodCheckinScreen() {
  const navigate = useNavigate();
  const { pickMood } = useApp();

  return (
    <>
      <StatusBar />
      <div className="screen__body screen__body--tab screen__body--dark" style={{ padding: '0 22px 12px', display: 'flex', flexDirection: 'column' }}>
        <h1 className="display" style={{ fontSize: 28, color: 'rgba(255,248,242,0.92)', fontWeight: 400, margin: '8px 0 6px' }}>How are you feeling?</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,248,242,0.45)', margin: '0 0 24px', lineHeight: 1.5 }}>Choose a colour that matches your energy right now</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, flex: 1 }}>
          {MOOD_COLORS.map((mc) => (
            <button
              key={mc.id}
              type="button"
              onClick={() => { pickMood(mc); navigate('/mood/result'); }}
              style={{
                background: mc.color,
                borderRadius: 16,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                padding: '12px 8px',
                minHeight: 80,
                aspectRatio: '1',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.92)', textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>{mc.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
