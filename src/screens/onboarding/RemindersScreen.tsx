import { useNavigate } from 'react-router-dom';
import { ProgressDots } from '../../components/ProgressDots';
import { StatusBar } from '../../components/StatusBar';
import { getDailyWord } from '../../lib/daily-word';
import { useApp } from '../../context/AppContext';

export function RemindersScreen() {
  const navigate = useNavigate();
  const { state, setReminderTime, toggleNotif } = useApp();
  const daily = getDailyWord(new Date(), state.profile);

  const adjustTime = (delta: number) => {
    const match = state.settings.reminderTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    let total = hours * 60 + minutes + delta * 30;
    total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
    const h24 = Math.floor(total / 60);
    const m = total % 60;
    const h12 = h24 % 12 || 12;
    const p = h24 >= 12 ? 'PM' : 'AM';
    setReminderTime(`${h12}:${m.toString().padStart(2, '0')} ${p}`);
    if (!state.settings.notifEnabled) toggleNotif();
  };

  return (
    <div className="screen screen--card">
      <StatusBar />
      <ProgressDots active={6} />
      <div className="screen__body" style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 76, height: 76, background: 'linear-gradient(135deg,#FFE4CC,#FFF0E0)', borderRadius: 22, margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, boxShadow: '0 8px 24px rgba(232,120,75,0.16)' }}>🔔</div>
          <h1 className="display" style={{ fontSize: 30, fontWeight: 400, margin: '0 0 8px', lineHeight: 1.25 }}>Stay aligned,<br />every day</h1>
          <p style={{ fontSize: 13, color: 'var(--ts)', margin: 0, lineHeight: 1.65 }}>Your daily Switch Word arrives each morning — a small ritual that compounds over time.</p>
        </div>
        <div style={{ background: 'var(--bg-c)', borderRadius: 18, padding: '15px 16px', border: '1px solid var(--bd)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#E8784B,#F2C44A)', borderRadius: 9, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Lumyn</div>
              <div style={{ fontSize: 10, color: 'var(--tm)' }}>now</div>
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Your word for today: {daily.word.word} ✦</div>
          <div style={{ fontSize: 11, color: 'var(--ts)' }}>Repeat {daily.word.reps}× before your first task. Let it lift you.</div>
        </div>
        <div style={{ background: 'var(--bg-c)', borderRadius: 16, padding: '14px 18px', border: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--tm)', marginBottom: 3 }}>Deliver at</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{state.settings.reminderTime}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button type="button" onClick={() => adjustTime(1)} style={{ width: 30, height: 26, background: 'var(--bg-s)', border: '1px solid var(--bd)', borderRadius: 7, cursor: 'pointer', fontSize: 12, color: 'var(--ts)' }}>▲</button>
            <button type="button" onClick={() => adjustTime(-1)} style={{ width: 30, height: 26, background: 'var(--bg-s)', border: '1px solid var(--bd)', borderRadius: 7, cursor: 'pointer', fontSize: 12, color: 'var(--ts)' }}>▼</button>
          </div>
        </div>
      </div>
      <div className="screen__footer" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button type="button" className="btn-primary" onClick={() => { if (!state.settings.notifEnabled) toggleNotif(); navigate('/onboarding/welcome'); }}>Enable Reminders</button>
        <button type="button" className="btn-ghost" onClick={() => navigate('/onboarding/welcome')}>Maybe later</button>
      </div>
    </div>
  );
}
