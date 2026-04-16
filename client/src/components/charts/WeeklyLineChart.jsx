import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Dot } from 'recharts';
import { format, parseISO } from 'date-fns';

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  if (payload.completionRate === 100) {
    return <circle cx={cx} cy={cy} r={5} fill="#22c55e" stroke="var(--df-surface)" strokeWidth={2} />;
  }
  return <circle cx={cx} cy={cy} r={3} fill="#6366f1" stroke="var(--df-surface)" strokeWidth={1.5} />;
};

export default function WeeklyLineChart({ data = [] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), 'EEE'),
  }));

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Weekly Performance</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--df-chart-grid)" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--df-chart-tick)' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--df-chart-tick)' }} axisLine={false} tickLine={false} unit="%" width={32} />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid var(--df-tooltip-border)',
              background: 'var(--df-tooltip-bg)',
              color: 'var(--df-tooltip-text)',
              fontSize: 12,
            }}
            formatter={(v) => [`${v}%`, 'Completion']}
          />
          <Line
            type="monotone" dataKey="completionRate"
            stroke="#6366f1" strokeWidth={2.5}
            dot={<CustomDot />} activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
