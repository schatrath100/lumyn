interface ProgressDotsProps {
  total?: number;
  active: number;
}

export function ProgressDots({ total = 6, active }: ProgressDotsProps) {
  return (
    <div className="progress-dots">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`progress-dots__dot${i < active ? ' progress-dots__dot--active' : ''}`}
        />
      ))}
    </div>
  );
}
