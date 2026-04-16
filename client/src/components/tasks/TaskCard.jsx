import { useState } from 'react';
import { Pencil, Trash2, Clock, Tag } from 'lucide-react';
import { useToggleTask, useDeleteTask } from '../../hooks/useTasks';
import useTaskStore from '../../store/taskStore';

const PRIORITY_BADGE = {
  low:    'badge-low',
  medium: 'badge-medium',
  high:   'badge-high',
  urgent: 'badge-urgent',
};

export default function TaskCard({ task }) {
  const { mutate: toggle } = useToggleTask();
  const { mutate: deleteTask } = useDeleteTask();
  const openForm = useTaskStore((s) => s.openForm);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    setDeleting(true);
    deleteTask(task._id, { onSettled: () => setDeleting(false) });
  };

  return (
    <div className={`task-card group ${task.isCompleted ? 'completed' : ''}`}>
      {/* Checkbox */}
      <button
        className={`task-checkbox ${task.isCompleted ? 'checked' : ''}`}
        onClick={() => toggle(task._id)}
        aria-label="Toggle complete"
      >
        {task.isCompleted && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug ${task.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
            {task.title}
          </p>
          {/* Actions - visible on hover */}
          <div className="flex flex-shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            <button onClick={() => openForm(task)} className="btn-ghost p-1 h-auto text-slate-400 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-300">
              <Pencil size={13} />
            </button>
            <button onClick={handleDelete} disabled={deleting} className="btn-ghost p-1 h-auto text-slate-400 dark:text-slate-400 hover:text-red-500">
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className={`badge ${PRIORITY_BADGE[task.priority] || 'badge-medium'}`}>
            {task.priority}
          </span>

          {task.category && (
            <span className="badge bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-200" style={{ borderLeft: `3px solid ${task.category.color}` }}>
              {task.category.icon} {task.category.name}
            </span>
          )}

          {task.estimatedMinutes && (
            <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-400">
              <Clock size={10} /> {task.estimatedMinutes}m
            </span>
          )}

          {task.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="flex items-center gap-0.5 text-xs text-slate-400 dark:text-slate-400">
              <Tag size={9} /> {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
