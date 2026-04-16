import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import {
  useCreateTask,
  useUpdateTask,
  useCategories,
} from "../../hooks/useTasks";
import useTaskStore from "../../store/taskStore";

const PRIORITIES = ["low", "medium", "high", "urgent"];

const emptyForm = (date) => ({
  title: "",
  description: "",
  priority: "medium",
  category: "",
  tags: "",
  estimatedMinutes: "",
  dueDate: date,
});

export default function TaskForm() {
  const { isFormOpen, editingTask, closeForm, selectedDate } = useTaskStore();
  const { data: categories = [] } = useCategories();
  const { mutate: createTask, isPending: creating } = useCreateTask();
  const { mutate: updateTask, isPending: updating } = useUpdateTask();

  const [form, setForm] = useState(emptyForm(selectedDate));

  useEffect(() => {
    if (!isFormOpen) return;

    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        priority: editingTask.priority || "medium",
        category: editingTask.category?._id || "",
        tags: editingTask.tags?.join(", ") || "",
        estimatedMinutes: editingTask.estimatedMinutes || "",
        dueDate: format(new Date(editingTask.dueDate), "yyyy-MM-dd"),
      });
    } else {
      setForm(emptyForm(selectedDate));
    }
  }, [isFormOpen, editingTask, selectedDate]);

  if (!isFormOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      category: form.category || undefined,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      estimatedMinutes: form.estimatedMinutes
        ? Number(form.estimatedMinutes)
        : undefined,
      dueDate: form.dueDate,
    };

    if (editingTask) {
      updateTask(
        { id: editingTask._id, data: payload },
        { onSuccess: closeForm },
      );
    } else {
      createTask(payload, { onSuccess: closeForm });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm animate-fade-in">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-transparent bg-white shadow-xl animate-bounce-in dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/30">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 dark:border-slate-800 sm:px-6">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">
            {editingTask ? "Edit Task" : "New Task"}
          </h2>
          <button onClick={closeForm} className="btn-ghost p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
              Task title *
            </label>
            <input
              className="input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
              Description
            </label>
            <textarea
              className="input resize-none h-20"
              placeholder="Optional details..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
                Priority
              </label>
              <select
                className="input"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
                Category
              </label>
              <select
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
                Due date
              </label>
              <input
                type="date"
                className="input"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
                Est. minutes
              </label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 30"
                min={1}
                max={480}
                value={form.estimatedMinutes}
                onChange={(e) =>
                  setForm({ ...form, estimatedMinutes: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
              Tags (comma separated)
            </label>
            <input
              className="input"
              placeholder="design, urgent, review"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={closeForm}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={creating || updating}
            >
              {creating || updating
                ? "Saving..."
                : editingTask
                  ? "Save Changes"
                  : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
