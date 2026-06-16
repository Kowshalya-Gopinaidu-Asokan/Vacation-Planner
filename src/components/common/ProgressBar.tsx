interface ProgressBarProps {
  value: number;
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md';
  color?: 'primary' | 'success' | 'warning';
}

export function ProgressBar({
  value,
  label,
  showPercent = true,
  size = 'md',
  color = 'primary',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`progress progress--${size}`}>
      {(label || showPercent) && (
        <div className="progress__header">
          {label && <span className="progress__label">{label}</span>}
          {showPercent && <span className="progress__percent">{clamped}%</span>}
        </div>
      )}
      <div className="progress__track">
        <div
          className={`progress__fill progress__fill--${color}`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
