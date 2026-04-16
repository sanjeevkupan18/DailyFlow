import api from './axiosInstance';

export const taskApi = {
  getAll: (params) => api.get('/tasks', { params }).then((r) => r.data),
  getOne: (id) => api.get(`/tasks/${id}`).then((r) => r.data),
  create: (data) => api.post('/tasks', data).then((r) => r.data),
  update: (id, data) => api.patch(`/tasks/${id}`, data).then((r) => r.data),
  toggle: (id) => api.patch(`/tasks/${id}/toggle`).then((r) => r.data),
  delete: (id) => api.delete(`/tasks/${id}`).then((r) => r.data),
  reorder: (tasks) => api.patch('/tasks/reorder', { tasks }).then((r) => r.data),
};
