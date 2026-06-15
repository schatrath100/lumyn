import { useState } from 'react';
import type { AppSettings, ReminderFrequency } from '../types';
import { ReminderTimePicker } from './ReminderTimePicker';
import { getDailyWord } from '../lib/daily-word';
import type { UserProfile } from '../types';
import { requestRemindersPermission } from '../lib/reminder-scheduler';

const FREQUENCIES: { id: ReminderFrequency; label: string }[] = [
  { id: 'off', label: 'Off' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
];

const WEEKDAY_SYMBOLS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface RemindersSheetProps {
  settings: AppSettings;
  profile: UserProfile;
  onClose: () => void;
  onChange: (partial: Partial<AppSettings>) => void;
}

export function RemindersSheet({ settings, profile, onClose, onChange }: RemindersSheetProps) {
  const [deniedMessage, setDeniedMessage] = useState<string | null>(null);
  const daily = getDailyWord(new Date(), profile);
  const freq = settings.reminderFrequency;

  const selectFrequency = async (next: ReminderFrequency) => {
    setDeniedMessage(null);
    if (next === 'off') {
      onChange({ reminderFrequency: 'off' });
      return;
    }
    const result = await requestRemindersPermission();
    if (!result.ok) {
      onChange({ reminderFrequency: 'off' });
      setDeniedMessage(result.message ?? 'Notifications are blocked.');
      return;
    }
    onChange({ reminderFrequency: next });
  };

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <div
        className="sheet-panel"
        role="dialog"
        aria-labelledby="reminders-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-panel__handle" aria-hidden />
        <h2 id="reminders-sheet-title" className="display" style={{ fontSize: 22, margin: '0 0 6px' }}>
          Reminders
        </h2>
        <p style={{ fontSize: 12, color: 'var(--tm)', margin: '0 0 18px', lineHeight: 1.55 }}>
          A gentle nudge for your daily switch word practice.
        </p>

        {freq !== 'off' && (
          <div className="reminder-preview">
            <div className="eyebrow" style={{ marginBottom: 8, fontWeight: 600 }}>Notification preview</div>
            <div className="reminder-preview__card">
              <div className="reminder-preview__app">Lumyn</div>
              <div className="reminder-preview__title">Your word for today: {daily.word.word} ✦</div>
              <div className="reminder-preview__body">
                Repeat {daily.word.reps}× before your first task. Let it lift you.
              </div>
            </div>
          </div>
        )}

        <div className="frequency-picker" role="radiogroup" aria-label="Reminder frequency">
          {FREQUENCIES.map((f) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={freq === f.id}
              className={`frequency-picker__btn${freq === f.id ? ' frequency-picker__btn--active' : ''}`}
              onClick={() => void selectFrequency(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {deniedMessage && (
          <p className="publish-combo-hint" role="alert" style={{ marginTop: 12 }}>
            {deniedMessage}
          </p>
        )}

        {freq !== 'off' && (
          <>
            <div className="reminder-time-row">
              <ReminderTimePicker
                time={settings.reminderTime}
                onTimeChange={(time) => onChange({ reminderTime: time })}
                timeSize={22}
              />
            </div>

            {freq === 'weekly' && (
              <div className="weekday-picker">
                <div className="eyebrow" style={{ marginBottom: 10, fontWeight: 600 }}>Day</div>
                <div className="weekday-picker__row" role="radiogroup" aria-label="Reminder day">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <button
                      key={day}
                      type="button"
                      role="radio"
                      aria-checked={settings.reminderWeekday === day}
                      className={`weekday-picker__btn${settings.reminderWeekday === day ? ' weekday-picker__btn--active' : ''}`}
                      onClick={() => onChange({ reminderWeekday: day })}
                    >
                      {WEEKDAY_SYMBOLS[day - 1]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <button type="button" className="btn-primary" style={{ marginTop: 20 }} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
