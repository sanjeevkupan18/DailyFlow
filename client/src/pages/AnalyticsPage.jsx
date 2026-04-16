import { useState } from 'react';
import { format } from 'date-fns';
import Navbar from '../components/layout/Navbar';
import WeeklyLineChart from '../components/charts/WeeklyLineChart';
import MonthlyAreaChart from '../components/charts/MonthlyAreaChart';
import HeatmapCalendar from '../components/charts/HeatmapCalendar';
import RadarChart from '../components/charts/RadarChart';
import ObservationCard from '../components/ui/ObservationCard';
import { useWeeklyStats, useMonthlyStats, useHeatmap, useCategoryStats, useObservations, useStreak, useTrends } from '../hooks/useStats';
import { currentMonth, currentYear } from '../utils/dateHelpers';

const PERIODS = ['Weekly', 'Monthly', 'Yearly'];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('Monthly');
  const [month, setMonth] = useState(currentMonth());
  const year = currentYear();

  const { data: weekly } = useWeeklyStats();
  const { data: monthly } = useMonthlyStats(month);
  const { data: heatmap } = useHeatmap(year);
  const { data: catData } = useCategoryStats(30);
  const { data: obsData } = useObservations();
  const { data: streak } = useStreak();

  return (
    <div className="min-h-screen">
      <Navbar title="Analytics" subtitle="Detailed performance insights" />

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {/* Period selector */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex w-full items-center gap-0.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-900/60 sm:w-auto">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all sm:flex-none sm:px-4 ${
                  period === p
                    ? 'bg-white dark:bg-slate-950 text-primary-700 dark:text-primary-200 shadow-sm dark:shadow-black/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {period === 'Monthly' && (
            <input
              type="month"
              className="input w-full text-sm sm:!w-auto"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          )}
        </div>

        {/* Top stats bar */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Current Streak', value: `${streak?.currentStreak || 0}d`, emoji: '🔥' },
            { label: 'Longest Streak', value: `${streak?.longestStreak || 0}d`, emoji: '🏆' },
            { label: 'Monthly Avg', value: `${monthly?.avgScore || 0}%`, emoji: '📊' },
            { label: 'Last Active', value: streak?.lastActiveDate ? format(new Date(streak.lastActiveDate + 'T00:00:00'), 'MMM d') : '—', emoji: '📅' },
          ].map(({ label, value, emoji }) => (
            <div key={label} className="card text-center">
              <p className="text-xl mb-1">{emoji}</p>
              <p className="text-xs text-slate-400 font-medium">{label}</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        {period === 'Weekly' && <WeeklyLineChart data={weekly?.days || []} />}

        {period === 'Monthly' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MonthlyAreaChart data={monthly?.days || []} />
            <RadarChart data={catData?.categories || []} />
          </div>
        )}

        {period === 'Yearly' && (
          <HeatmapCalendar data={heatmap?.heatmap || []} year={year} />
        )}

        {/* Category breakdown table */}
        {catData?.categories?.length > 0 && (
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Category Breakdown (Last 30 Days)</h3>
            <div className="space-y-3">
              {catData.categories.map((cat) => (
                <div key={cat.id} className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color || '#6366f1' }} />
                  <span className="w-full text-sm text-slate-700 dark:text-slate-200 sm:w-28 sm:flex-shrink-0">{cat.name}</span>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 sm:flex-1">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.completionRate}%`, background: cat.color || '#6366f1' }}
                    />
                  </div>
                  <span className="w-full text-left text-xs font-medium text-slate-600 dark:text-slate-300 sm:w-16 sm:text-right">
                    {cat.completed}/{cat.total} ({cat.completionRate}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observations */}
        {obsData?.observations?.length > 0 && (
          <ObservationCard observations={obsData.observations} />
        )}
      </div>
    </div>
  );
}
