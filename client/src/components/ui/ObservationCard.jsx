const typeStyles = {
  success: 'bg-green-50 border-green-100 text-green-800 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-200',
  warning: 'bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-200',
  info:    'bg-blue-50 border-blue-100 text-blue-800 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-200',
  error:   'bg-red-50 border-red-100 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-200',
};

export default function ObservationCard({ observations = [] }) {
  if (!observations.length) return null;
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">✨ Observations</h3>
      <div className="space-y-2">
        {observations.map((obs, i) => (
          <div
            key={i}
            className={`rounded-xl px-3 py-2 border text-sm ${typeStyles[obs.type] || typeStyles.info}`}
          >
            {obs.text}
          </div>
        ))}
      </div>
    </div>
  );
}
