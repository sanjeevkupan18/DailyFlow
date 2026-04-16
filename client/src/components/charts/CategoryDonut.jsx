import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6'];

export default function CategoryDonut({ data = [] }) {
  if (!data.length) return (
    <div className="card flex items-center justify-center h-48 text-sm text-slate-400 dark:text-slate-400">No category data yet</div>
  );

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Tasks by Category</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data} cx="50%" cy="45%" innerRadius={55} outerRadius={80}
            paddingAngle={3} dataKey="total"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid var(--df-tooltip-border)',
              background: 'var(--df-tooltip-bg)',
              color: 'var(--df-tooltip-text)',
              fontSize: 12,
            }}
            formatter={(v, n, p) => [`${v} tasks (${p.payload.completionRate}%)`, p.payload.name]}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
