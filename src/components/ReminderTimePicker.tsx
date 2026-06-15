import { adjustReminderTime } from '../lib/reminder-time';

interface ReminderTimePickerProps {
  time: string;
  onTimeChange: (time: string) => void;
  timeSize?: number;
}

export function ReminderTimePicker({ time, onTimeChange, timeSize = 24 }: ReminderTimePickerProps) {
  const adjust = (delta: number) => {
    onTimeChange(adjustReminderTime(time, delta));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 11, color: 'var(--tm)', marginBottom: 3 }}>Deliver at</div>
        <div style={{ fontSize: timeSize, fontWeight: 600 }}>{time}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button
          type="button"
          onClick={() => adjust(1)}
          aria-label="Later reminder time"
          style={{ width: 30, height: 26, background: 'var(--bg-s)', border: '1px solid var(--bd)', borderRadius: 7, cursor: 'pointer', fontSize: 12, color: 'var(--ts)' }}
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => adjust(-1)}
          aria-label="Earlier reminder time"
          style={{ width: 30, height: 26, background: 'var(--bg-s)', border: '1px solid var(--bd)', borderRadius: 7, cursor: 'pointer', fontSize: 12, color: 'var(--ts)' }}
        >
          ▼
        </button>
      </div>
    </div>
  );
}
