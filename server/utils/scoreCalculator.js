const PRIORITY_WEIGHTS = { low: 1, medium: 2, high: 3, urgent: 4 };

/**
 * Calculate priority-weighted performance score (0-100)
 */
const calculatePerformanceScore = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;

  const totalWeight = tasks.reduce(
    (sum, t) => sum + (PRIORITY_WEIGHTS[t.priority] || 2),
    0
  );
  const earnedWeight = tasks
    .filter((t) => t.isCompleted)
    .reduce((sum, t) => sum + (PRIORITY_WEIGHTS[t.priority] || 2), 0);

  if (totalWeight === 0) return 0;
  return Math.round((earnedWeight / totalWeight) * 100);
};

/**
 * Calculate category breakdown from tasks array
 */
const calculateCategoryBreakdown = (tasks) => {
  const map = {};
  tasks.forEach((task) => {
    const key = task.category
      ? task.category._id?.toString() || task.category.toString()
      : 'uncategorized';
    const name = task.category?.name || 'Uncategorized';
    if (!map[key]) {
      map[key] = { categoryId: key, categoryName: name, total: 0, completed: 0 };
    }
    map[key].total++;
    if (task.isCompleted) map[key].completed++;
  });
  return Object.values(map);
};

/**
 * Get date string in YYYY-MM-DD format (local timezone-safe)
 */
const getDateString = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

module.exports = { calculatePerformanceScore, calculateCategoryBreakdown, getDateString };
