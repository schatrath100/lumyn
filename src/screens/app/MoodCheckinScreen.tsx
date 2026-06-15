import { useNavigate } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';
import { StatusBar } from '../../components/StatusBar';
import { MOOD_COLORS } from '../../data/mood-colors';
import { useApp } from '../../context/AppContext';

export function MoodCheckinScreen() {
  const navigate = useNavigate();
  const { pickMood } = useApp();

  return (
    <div className="screen" style={{ background: '#0F0905' }}>
      <StatusBar />
      <div className="screen__body" style={{ padding: '0 18px 12px', display: 'flex', flexDirection: 'column' }}>
        <h1 className="display" style={{ fontSize: 26, color: 'rgba(255,248,242,0.92)', fontWeight: 400, margin: '0 0 6px' }}>How are you feeling?</h1>
        <p style={{ fontSize: 12, color: 'rgba(255,248,242,0.3)', margin: '0 0 20px' }}>Choose a colour that matches your energy right now</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, flex: 1 }}>
          {MOOD_COLORS.map((mc) => (
            <button
              key={mc.id}
              type="button"
              onClick={() => { pickMood(mc); navigate('/mood/result'); }}
              style={{
                background: mc.color,
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                padding: '10px 6px',
                minHeight: 72,
                aspectRatio: '1',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.88)', textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>{mc.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="screen__footer screen__footer--nav" style={{ padding: 0 }}>
        <NavBar dark />
      </div>
    </div>
  );
}
