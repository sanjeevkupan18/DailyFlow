import api from './axiosInstance';

export const statsApi = {
  getToday: () => api.get('/stats/today').then((r) => r.data),
  getDaily: (date) => api.get('/stats/daily', { params: { date } }).then((r) => r.data),
  getWeekly: () => api.get('/stats/weekly').then((r) => r.data),
  getMonthly: (month) => api.get('/stats/monthly', { params: { month } }).then((r) => r.data),
  getHeatmap: (year) => api.get('/stats/heatmap', { params: { year } }).then((r) => r.data),
  getStreak: () => api.get('/stats/streak').then((r) => r.data),
  getTrends: (period) => api.get('/stats/trends', { params: { period } }).then((r) => r.data),
  getCategories: (period) => api.get('/stats/categories', { params: { period } }).then((r) => r.data),
  getObservations: () => api.get('/stats/observations').then((r) => r.data),
};

export const categoryApi = {
  getAll: () => api.get('/categories').then((r) => r.data),
  create: (data) => api.post('/categories', data).then((r) => r.data),
  update: (id, data) => api.patch(`/categories/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};
