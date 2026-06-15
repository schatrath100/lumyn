import { INTENTIONS } from '../data/intentions';

interface IntentionsGridProps {
  selected: string[];
  onToggle: (id: string) => void;
}

export function IntentionsGrid({ selected, onToggle }: IntentionsGridProps) {
  return (
    <div className="intentions-grid">
      {INTENTIONS.map((intention) => {
        const isSelected = selected.includes(intention.id);
        return (
          <button
            key={intention.id}
            type="button"
            className={`intentions-grid__item${isSelected ? ' intentions-grid__item--selected' : ''}`}
            onClick={() => onToggle(intention.id)}
          >
            <span className="intentions-grid__icon" aria-hidden>{intention.icon}</span>
            <span className="intentions-grid__label">{intention.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function formatIntentionsSummary(selectedIds: string[]): string {
  if (!selectedIds.length) return 'None selected';
  const labels = selectedIds
    .map((id) => INTENTIONS.find((i) => i.id === id)?.label)
    .filter(Boolean);
  return labels.join(' · ');
}
