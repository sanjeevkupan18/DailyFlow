import TaskCard from './TaskCard';
import useTaskStore from '../../store/taskStore';
import { useTasks } from '../../hooks/useTasks';
import { CheckCircle2, Inbox } from 'lucide-react';

export default function TaskList() {
  const { selectedDate, filterCompleted, filterCategory, filterPriority } = useTaskStore();

  const params = { date: selectedDate };
  if (filterCategory) params.category = filterCategory;
  if (filterPriority) params.priority = filterPriority;
  if (filterCompleted === 'active') params.completed = 'false';
  if (filterCompleted === 'completed') params.completed = 'true';

  const { data: tasks = [], isLoading } = useTasks(params);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1,2,3].map((i) => (
          <div key={i} className="task-card animate-pulse">
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700/60" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-3/4" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {filterCompleted === 'completed' ? (
          <>
            <CheckCircle2 size={40} className="text-slate-200 dark:text-slate-700 mb-3" />
            <p className="text-slate-400 dark:text-slate-400 text-sm">No completed tasks yet today</p>
          </>
        ) : (
          <>
            <Inbox size={40} className="text-slate-200 dark:text-slate-700 mb-3" />
            <p className="text-slate-500 dark:text-slate-300 font-medium mb-1">No tasks for this day</p>
            <p className="text-slate-400 dark:text-slate-400 text-sm">Click "+ Add Task" to get started</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => <TaskCard key={task._id} task={task} />)}
    </div>
  );
}
