import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressDots } from '../../components/ProgressDots';
import { ReminderTimePicker } from '../../components/ReminderTimePicker';
import { StatusBar } from '../../components/StatusBar';
import { getDailyWord } from '../../lib/daily-word';
import { enableDailyReminders } from '../../lib/reminder-scheduler';
import { useApp } from '../../context/AppContext';

export function RemindersScreen() {
  const navigate = useNavigate();
  const { state, setReminderTime, toggleNotif } = useApp();
  const [notice, setNotice] = useState<string | null>(null);
  const daily = getDailyWord(new Date(), state.profile);

  const handleTimeChange = (time: string) => {
    setReminderTime(time);
    if (!state.settings.notifEnabled) toggleNotif();
  };

  const enable = async () => {
    setNotice(null);
    const result = await enableDailyReminders(state.profile, state.settings.reminderTime);
    if (!state.settings.notifEnabled && result.ok) toggleNotif();
    if (!result.ok && result.message) setNotice(result.message);
    navigate('/onboarding/welcome');
  };

  return (
    <div className="screen screen--card">
      <StatusBar />
      <ProgressDots total={8} active={6} />
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
        <div style={{ background: 'var(--bg-c)', borderRadius: 16, padding: '14px 18px', border: '1px solid var(--bd)' }}>
          <ReminderTimePicker time={state.settings.reminderTime} onTimeChange={handleTimeChange} />
        </div>
      </div>
      <div className="screen__footer" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notice && <p style={{ fontSize: 11, color: 'var(--tm)', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>{notice}</p>}
        <button type="button" className="btn-primary" onClick={enable}>Enable Reminders</button>
        <button type="button" className="btn-ghost" onClick={() => navigate('/onboarding/welcome')}>Maybe later</button>
      </div>
    </div>
  );
}
