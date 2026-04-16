import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function MonthlyAreaChart({ data = [] }) {
  const formatted = data
    .filter((d) => d.totalTasks > 0)
    .map((d) => ({ ...d, label: format(parseISO(d.date), 'MMM d') }));

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Monthly Performance Score</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={formatted}>
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--df-chart-grid)" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--df-chart-tick)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--df-chart-tick)' }} axisLine={false} tickLine={false} unit="%" width={32} />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid var(--df-tooltip-border)',
              background: 'var(--df-tooltip-bg)',
              color: 'var(--df-tooltip-text)',
              fontSize: 12,
            }}
            formatter={(v) => [`${v}%`, 'Score']}
          />
          <Area type="monotone" dataKey="performanceScore" stroke="#6366f1" strokeWidth={2}
            fill="url(#scoreGrad)" dot={false} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
