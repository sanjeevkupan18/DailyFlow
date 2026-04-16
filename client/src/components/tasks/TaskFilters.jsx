import useTaskStore from '../../store/taskStore';
import { useCategories } from '../../hooks/useTasks';

const FILTER_TABS = [
  { value: 'all',       label: 'All' },
  { value: 'active',    label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskFilters() {
  const { filterCompleted, setFilterCompleted, filterCategory, setFilterCategory, filterPriority, setFilterPriority } = useTaskStore();
  const { data: categories = [] } = useCategories();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {/* Status tabs */}
      <div className="flex w-full items-center gap-0.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-900/60 sm:w-auto">
        {FILTER_TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilterCompleted(value)}
            className={`flex-1 rounded-lg px-3 py-1 text-xs font-medium transition-all sm:flex-none ${
              filterCompleted === value
                ? 'bg-white dark:bg-slate-950 text-primary-700 dark:text-primary-200 shadow-sm dark:shadow-black/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <select
          className="input w-full text-xs py-1.5 sm:!w-auto"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
        </select>
      )}

      {/* Priority filter */}
      <select
        className="input w-full text-xs py-1.5 sm:!w-auto"
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value)}
      >
        <option value="">All priorities</option>
        {['urgent', 'high', 'medium', 'low'].map((p) => (
          <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
        ))}
      </select>
    </div>
  );
}
