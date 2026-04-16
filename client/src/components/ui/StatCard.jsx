export default function StatCard({ label, value, sub, color = 'primary', icon: Icon }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300',
    green:   'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-300',
    amber:   'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300',
    red:     'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300',
    slate:   'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200',
  };

  return (
    <div className="card flex items-start gap-4">
      {Icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}
