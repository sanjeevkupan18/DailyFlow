export default function StreakBadge({ streak = 0, longest = 0 }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="text-3xl leading-none">🔥</div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Current Streak</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{streak} <span className="text-base font-normal text-slate-400 dark:text-slate-400">days</span></p>
        {longest > 0 && (
          <p className="text-xs text-slate-400 mt-1">Best: {longest} days</p>
        )}
      </div>
    </div>
  );
}
