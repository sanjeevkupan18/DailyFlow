import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const barColor = (value) => {
  if (value >= 80) return '#22c55e';
  if (value >= 50) return '#f59e0b';
  return '#6366f1';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg dark:shadow-black/30 px-3 py-2 text-xs">
        <p className="font-medium text-slate-700 dark:text-slate-200">{label}</p>
        <p className="text-primary-600 dark:text-primary-300">{payload[0].value}% complete</p>
      </div>
    );
  }
  return null;
};

export default function DailyBarChart({ data = [] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), 'EEE'),
  }));

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Daily Completion (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={formatted} barSize={28}>
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--df-chart-tick)' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--df-chart-tick)' }} axisLine={false} tickLine={false} unit="%" width={32} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--df-cursor)' }} />
          <Bar dataKey="completionRate" radius={[6, 6, 0, 0]}>
            {formatted.map((entry, i) => (
              <Cell key={i} fill={barColor(entry.completionRate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
