import { Radar, RadarChart as ReRadar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function RadarChart({ data = [] }) {
  if (!data.length) return null;

  const formatted = data.map((d) => ({ subject: d.name, value: d.completionRate }));

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Category Completion Radar</h3>
      <ResponsiveContainer width="100%" height={220}>
        <ReRadar data={formatted} cx="50%" cy="50%" outerRadius={80}>
          <PolarGrid stroke="var(--df-chart-grid)" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--df-muted)' }} />
          <Radar name="Completion %" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
          <Tooltip
            formatter={(v) => [`${v}%`, 'Completion']}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid var(--df-tooltip-border)',
              background: 'var(--df-tooltip-bg)',
              color: 'var(--df-tooltip-text)',
              fontSize: 12,
            }}
          />
        </ReRadar>
      </ResponsiveContainer>
    </div>
  );
}
