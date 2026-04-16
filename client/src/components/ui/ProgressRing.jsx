export default function ProgressRing({ value = 0, size = 120, strokeWidth = 10, label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const color = value >= 80 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#6366f1';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--df-ring-track)" strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring-circle"
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          fontSize={size / 4.5} fontWeight="700" fill="var(--df-text)">
          {value}%
        </text>
      </svg>
      {label && <p className="text-sm text-slate-500 dark:text-slate-300 font-medium">{label}</p>}
    </div>
  );
}
