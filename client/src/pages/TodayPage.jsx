import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import TaskList from '../components/tasks/TaskList';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskForm from '../components/tasks/TaskForm';
import ProgressRing from '../components/ui/ProgressRing';
import ObservationCard from '../components/ui/ObservationCard';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';
import { useTodayStats, useObservations } from '../hooks/useStats';
import { greetingByHour } from '../utils/dateHelpers';

export default function TodayPage() {
  const user = useAuthStore((s) => s.user);
  const { selectedDate, setSelectedDate, openForm } = useTaskStore();
  const { data: stats } = useTodayStats();
  const { data: obsData } = useObservations();

  const changeDay = (delta) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(format(d, 'yyyy-MM-dd'));
  };

  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen">
      <Navbar
        title={isToday ? greetingByHour(user?.name) : format(new Date(selectedDate), 'EEEE, MMMM d')}
        subtitle={isToday ? format(new Date(), 'EEEE, MMMM d, yyyy') : undefined}
      />

      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {/* Date navigator */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => changeDay(-1)} className="btn-ghost p-2"><ChevronLeft size={16} /></button>
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
              <Calendar size={14} className="text-primary-500" />
              {format(new Date(selectedDate), 'MMM d, yyyy')}
              {isToday && <span className="badge bg-primary-100 dark:bg-primary-500/15 text-primary-700 dark:text-primary-200 ml-1">Today</span>}
            </div>
            <button onClick={() => changeDay(1)} className="btn-ghost p-2"><ChevronRight size={16} /></button>
          </div>

          <button onClick={() => openForm()} className="btn-primary flex w-full items-center justify-center gap-2 sm:w-auto">
            <Plus size={16} />
            Add Task
          </button>
        </div>

        {/* Progress summary */}
        {isToday && stats && stats.totalTasks > 0 && (
          <div className="card mb-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
            <ProgressRing value={stats.completionRate} size={90} strokeWidth={8} />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Today's Progress</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl">
                {stats.completedTasks} <span className="text-sm font-normal text-slate-400 dark:text-slate-400 sm:text-base">of {stats.totalTasks} tasks done</span>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-xs text-slate-400">Performance</p>
                  <p className="text-sm font-semibold text-primary-600">{stats.performanceScore}% score</p>
                </div>
                {stats.streak > 0 && (
                  <div>
                    <p className="text-xs text-slate-400">Streak</p>
                    <p className="text-sm font-semibold text-amber-600">🔥 {stats.streak} days</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-4">
          <TaskFilters />
        </div>

        {/* Task list */}
        <TaskList />

        {/* Observations */}
        {obsData?.observations?.length > 0 && (
          <div className="mt-6">
            <ObservationCard observations={obsData.observations.slice(0, 3)} />
          </div>
        )}
      </div>

      <TaskForm />
    </div>
  );
}
