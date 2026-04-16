const Task = require('../models/Task');
const DailyLog = require('../models/DailyLog');
const { calculatePerformanceScore, calculateCategoryBreakdown, getDateString } = require('../utils/scoreCalculator');

// Rebuild daily log after any task change
const rebuildDailyLog = async (userId, dateStr) => {
  const startOfDay = new Date(dateStr + 'T00:00:00.000Z');
  const endOfDay = new Date(dateStr + 'T23:59:59.999Z');

  const tasks = await Task.find({
    userId,
    dueDate: { $gte: startOfDay, $lte: endOfDay },
    isDeleted: false,
  }).populate('category', 'name color');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const performanceScore = calculatePerformanceScore(tasks);
  const categoryBreakdown = calculateCategoryBreakdown(tasks);

  // Calculate streak
  const yesterday = new Date(dateStr);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getDateString(yesterday);
  const yesterdayLog = await DailyLog.findOne({ userId, date: yesterdayStr });
  const streak = yesterdayLog && yesterdayLog.completedTasks > 0
    ? (yesterdayLog.streak || 0) + (completedTasks > 0 ? 1 : 0)
    : completedTasks > 0 ? 1 : 0;

  await DailyLog.findOneAndUpdate(
    { userId, date: dateStr },
    { userId, date: dateStr, totalTasks, completedTasks, completionRate, performanceScore, categoryBreakdown, streak },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

// @desc  Create task
// @route POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, tags, dueDate, estimatedMinutes, isRecurring, recurringDays, order } = req.body;

    const task = await Task.create({
      userId: req.user._id,
      title, description, category, priority, tags, dueDate, estimatedMinutes, isRecurring, recurringDays, order,
    });

    await rebuildDailyLog(req.user._id, getDateString(new Date(dueDate)));
    await task.populate('category', 'name color icon');
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc  Get tasks with filters
// @route GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const { date, category, priority, completed, page = 1, limit = 50 } = req.query;
    const query = { userId: req.user._id, isDeleted: false };

    if (date) {
      const start = new Date(date + 'T00:00:00.000Z');
      const end = new Date(date + 'T23:59:59.999Z');
      query.dueDate = { $gte: start, $lte: end };
    }
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (completed !== undefined) query.isCompleted = completed === 'true';

    const tasks = await Task.find(query)
      .populate('category', 'name color icon')
      .sort({ order: 1, priority: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Task.countDocuments(query);
    res.json({ tasks, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single task
// @route GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id, isDeleted: false })
      .populate('category', 'name color icon');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc  Update task
// @route PATCH /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name color icon');

    if (!task) return res.status(404).json({ message: 'Task not found' });
    await rebuildDailyLog(req.user._id, getDateString(new Date(task.dueDate)));
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc  Toggle task completion
// @route PATCH /api/tasks/:id/toggle
const toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id, isDeleted: false });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.isCompleted = !task.isCompleted;
    task.completedAt = task.isCompleted ? new Date() : null;
    await task.save();
    await task.populate('category', 'name color icon');

    await rebuildDailyLog(req.user._id, getDateString(new Date(task.dueDate)));
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc  Soft delete task
// @route DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isDeleted: true },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await rebuildDailyLog(req.user._id, getDateString(new Date(task.dueDate)));
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc  Reorder tasks (bulk update order field)
// @route PATCH /api/tasks/reorder
const reorderTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body; // [{ id, order }]
    const ops = tasks.map(({ id, order }) =>
      Task.updateOne({ _id: id, userId: req.user._id }, { order })
    );
    await Promise.all(ops);
    res.json({ message: 'Tasks reordered' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, toggleTask, deleteTask, reorderTasks };
