interface ToggleProps {
  on: boolean;
  onToggle: () => void;
  label?: string;
}

export function Toggle({ on, onToggle, label }: ToggleProps) {
  return (
    <button
      type="button"
      className={`toggle${on ? ' toggle--on' : ''}`}
      onClick={onToggle}
      aria-pressed={on}
      aria-label={label}
    >
      <span className="toggle__thumb" />
    </button>
  );
}
