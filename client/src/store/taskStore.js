import { create } from 'zustand';
import { format } from 'date-fns';

const useTaskStore = create((set) => ({
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  filterCategory: '',
  filterPriority: '',
  filterCompleted: 'all', // 'all' | 'active' | 'completed'
  isFormOpen: false,
  editingTask: null,

  setSelectedDate: (date) => set({ selectedDate: date }),
  setFilterCategory: (category) => set({ filterCategory: category }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  setFilterCompleted: (completed) => set({ filterCompleted: completed }),
  openForm: (task = null) => set({ isFormOpen: true, editingTask: task }),
  closeForm: () => set({ isFormOpen: false, editingTask: null }),
}));

export default useTaskStore;
