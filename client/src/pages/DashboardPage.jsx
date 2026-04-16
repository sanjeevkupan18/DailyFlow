import { BarChart2, CheckCircle2, Flame, Calendar } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import StatCard from '../components/ui/StatCard';
import ObservationCard from '../components/ui/ObservationCard';
import DailyBarChart from '../components/charts/DailyBarChart';
import CategoryDonut from '../components/charts/CategoryDonut';
import { useTodayStats, useWeeklyStats, useStreak, useCategoryStats, useObservations } from '../hooks/useStats';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { data: today } = useTodayStats();
  const { data: weekly } = useWeeklyStats();
  const { data: streak } = useStreak();
  const { data: catData } = useCategoryStats(30);
  const { data: obsData } = useObservations();

  const weekAvg = weekly?.avgScore || 0;

  return (
    <div className="min-h-screen">
      <Navbar title="Dashboard" subtitle={format(new Date(), 'EEEE, MMMM d, yyyy')} />

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {/* Stat cards row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Today's Score"
            value={`${today?.performanceScore || 0}%`}
            sub={`${today?.completedTasks || 0}/${today?.totalTasks || 0} tasks`}
            icon={BarChart2}
            color="primary"
          />
          <StatCard
            label="Current Streak"
            value={`${streak?.currentStreak || 0} days`}
            sub={`Best: ${streak?.longestStreak || 0} days`}
            icon={Flame}
            color="amber"
          />
          <StatCard
            label="This Week Avg"
            value={`${weekAvg}%`}
            sub="performance score"
            icon={Calendar}
            color="green"
          />
          <StatCard
            label="Today Completed"
            value={today?.completedTasks || 0}
            sub={`of ${today?.totalTasks || 0} planned`}
            icon={CheckCircle2}
            color="slate"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DailyBarChart data={weekly?.days || []} />
          <CategoryDonut data={catData?.categories || []} />
        </div>

        {/* This week's day breakdown */}
        {weekly?.days && (
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">This Week — Day Breakdown</h3>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {weekly.days.map((day) => (
                <div key={day.date} className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-300">{format(new Date(day.date + 'T00:00:00'), 'EEEE, MMM d')}</span>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="text-xs text-slate-400 dark:text-slate-400">{day.completedTasks}/{day.totalTasks} tasks</span>
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${day.completionRate}%`,
                          background: day.completionRate >= 80 ? '#22c55e' : day.completionRate >= 50 ? '#f59e0b' : '#6366f1',
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200 w-10 text-right">{day.completionRate}%</span>
                  </div>
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
