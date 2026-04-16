const DailyLog = require('../models/DailyLog');
const Task = require('../models/Task');
const { getDateString } = require('../utils/scoreCalculator');

// Helper: date range string array
const dateRange = (startDate, endDate) => {
  const dates = [];
  const cur = new Date(startDate);
  while (cur <= endDate) {
    dates.push(getDateString(new Date(cur)));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};

// @desc  Today's stats
// @route GET /api/stats/today
const getToday = async (req, res, next) => {
  try {
    const today = getDateString(new Date());
    const log = await DailyLog.findOne({ userId: req.user._id, date: today });
    res.json(log || { date: today, totalTasks: 0, completedTasks: 0, completionRate: 0, performanceScore: 0, streak: 0 });
  } catch (error) {
    next(error);
  }
};

// @desc  Stats for a specific day
// @route GET /api/stats/daily?date=YYYY-MM-DD
const getDaily = async (req, res, next) => {
  try {
    const date = req.query.date || getDateString(new Date());
    const log = await DailyLog.findOne({ userId: req.user._id, date });
    res.json(log || { date, totalTasks: 0, completedTasks: 0, completionRate: 0, performanceScore: 0 });
  } catch (error) {
    next(error);
  }
};

// @desc  Weekly stats (last 7 days from today or from a given date)
// @route GET /api/stats/weekly?startDate=YYYY-MM-DD
const getWeekly = async (req, res, next) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);

    const dates = dateRange(startDate, endDate);
    const logs = await DailyLog.find({
      userId: req.user._id,
      date: { $in: dates },
    });

    const logMap = {};
    logs.forEach((l) => { logMap[l.date] = l; });

    const result = dates.map((d) => ({
      date: d,
      completionRate: logMap[d]?.completionRate || 0,
      performanceScore: logMap[d]?.performanceScore || 0,
      totalTasks: logMap[d]?.totalTasks || 0,
      completedTasks: logMap[d]?.completedTasks || 0,
    }));

    const avgScore = result.length
      ? Math.round(result.reduce((s, r) => s + r.performanceScore, 0) / result.length)
      : 0;

    res.json({ days: result, avgScore, weekStart: getDateString(startDate), weekEnd: getDateString(endDate) });
  } catch (error) {
    next(error);
  }
};

// @desc  Monthly stats
// @route GET /api/stats/monthly?month=YYYY-MM
const getMonthly = async (req, res, next) => {
  try {
    const [year, month] = (req.query.month || getDateString(new Date()).slice(0, 7)).split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const dates = dateRange(startDate, endDate);
    const logs = await DailyLog.find({ userId: req.user._id, date: { $in: dates } });

    const logMap = {};
    logs.forEach((l) => { logMap[l.date] = l; });

    const days = dates.map((d) => ({
      date: d,
      completionRate: logMap[d]?.completionRate || 0,
      performanceScore: logMap[d]?.performanceScore || 0,
      totalTasks: logMap[d]?.totalTasks || 0,
      completedTasks: logMap[d]?.completedTasks || 0,
    }));

    const activeDays = days.filter((d) => d.totalTasks > 0);
    const avgScore = activeDays.length
      ? Math.round(activeDays.reduce((s, d) => s + d.performanceScore, 0) / activeDays.length)
      : 0;

    res.json({ days, avgScore, month: req.query.month || getDateString(new Date()).slice(0, 7) });
  } catch (error) {
    next(error);
  }
};

// @desc  Heatmap data for a full year
// @route GET /api/stats/heatmap?year=YYYY
const getHeatmap = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const logs = await DailyLog.find({
      userId: req.user._id,
      date: { $gte: `${year}-01-01`, $lte: `${year}-12-31` },
    }).select('date completionRate performanceScore');

    const logMap = {};
    logs.forEach((l) => { logMap[l.date] = l; });

    const dates = dateRange(startDate, endDate);
    const heatmap = dates.map((d) => ({
      date: d,
      value: logMap[d]?.completionRate || 0,
      score: logMap[d]?.performanceScore || 0,
    }));

    res.json({ year, heatmap });
  } catch (error) {
    next(error);
  }
};

// @desc  Current and longest streak
// @route GET /api/stats/streak
const getStreak = async (req, res, next) => {
  try {
    const logs = await DailyLog.find({ userId: req.user._id, completedTasks: { $gt: 0 } })
      .sort({ date: -1 })
      .select('date completedTasks streak');

    const currentStreak = logs[0]?.streak || 0;
    const longestStreak = logs.reduce((max, l) => Math.max(max, l.streak || 0), 0);

    res.json({ currentStreak, longestStreak, lastActiveDate: logs[0]?.date || null });
  } catch (error) {
    next(error);
  }
};

// @desc  Performance trend over N days
// @route GET /api/stats/trends?period=30
const getTrends = async (req, res, next) => {
  try {
    const days = parseInt(req.query.period) || 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));

    const dates = dateRange(startDate, endDate);
    const logs = await DailyLog.find({ userId: req.user._id, date: { $in: dates } });
    const logMap = {};
    logs.forEach((l) => { logMap[l.date] = l; });

    const trend = dates.map((d) => ({
      date: d,
      performanceScore: logMap[d]?.performanceScore || 0,
      completionRate: logMap[d]?.completionRate || 0,
    }));

    res.json({ trend, period: days });
  } catch (error) {
    next(error);
  }
};

// @desc  Category breakdown over a period
// @route GET /api/stats/categories?period=30
const getCategories = async (req, res, next) => {
  try {
    const days = parseInt(req.query.period) || 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));

    const start = new Date(getDateString(startDate) + 'T00:00:00.000Z');
    const end = new Date(getDateString(endDate) + 'T23:59:59.999Z');

    const tasks = await Task.find({
      userId: req.user._id,
      dueDate: { $gte: start, $lte: end },
      isDeleted: false,
    }).populate('category', 'name color icon');

    const catMap = {};
    tasks.forEach((t) => {
      const key = t.category?._id?.toString() || 'uncategorized';
      const name = t.category?.name || 'Uncategorized';
      const color = t.category?.color || '#888';
      if (!catMap[key]) catMap[key] = { name, color, total: 0, completed: 0 };
      catMap[key].total++;
      if (t.isCompleted) catMap[key].completed++;
    });

    const categories = Object.entries(catMap).map(([id, data]) => ({
      id,
      ...data,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }));

    res.json({ categories, period: days });
  } catch (error) {
    next(error);
  }
};

// @desc  Auto-generated text observations
// @route GET /api/stats/observations
const getObservations = async (req, res, next) => {
  try {
    const logs = await DailyLog.find({ userId: req.user._id }).sort({ date: -1 }).limit(90);
    const observations = [];

    if (logs.length === 0) {
      return res.json({ observations: [{ type: 'info', text: 'Add and complete tasks to start seeing observations.' }] });
    }

    // Current streak
    const streak = logs[0]?.streak || 0;
    if (streak >= 7) observations.push({ type: 'success', text: `🔥 You're on a ${streak}-day streak! Incredible consistency.` });
    else if (streak >= 3) observations.push({ type: 'success', text: `⚡ ${streak}-day streak! Keep the momentum going.` });

    // Average score last 7 days
    const last7 = logs.slice(0, 7).filter((l) => l.totalTasks > 0);
    if (last7.length > 0) {
      const avg = Math.round(last7.reduce((s, l) => s + l.performanceScore, 0) / last7.length);
      if (avg >= 80) observations.push({ type: 'success', text: `📈 Your 7-day average score is ${avg}% — excellent performance!` });
      else if (avg >= 50) observations.push({ type: 'info', text: `📊 7-day average: ${avg}%. You're making steady progress.` });
      else observations.push({ type: 'warning', text: `📉 7-day average is ${avg}%. Try breaking tasks into smaller pieces.` });
    }

    // Best day of week
    const dayTotals = {};
    logs.forEach((l) => {
      const day = new Date(l.date).toLocaleDateString('en-US', { weekday: 'long' });
      if (!dayTotals[day]) dayTotals[day] = { total: 0, count: 0 };
      dayTotals[day].total += l.performanceScore;
      dayTotals[day].count++;
    });
    const bestDay = Object.entries(dayTotals)
      .map(([day, d]) => ({ day, avg: Math.round(d.total / d.count) }))
      .sort((a, b) => b.avg - a.avg)[0];
    if (bestDay) observations.push({ type: 'info', text: `📅 You perform best on ${bestDay.day}s with an average score of ${bestDay.avg}%.` });

    // Completion trend
    const recentAvg = last7.length ? last7.reduce((s, l) => s + l.completionRate, 0) / last7.length : 0;
    const older = logs.slice(7, 14).filter((l) => l.totalTasks > 0);
    if (older.length > 0) {
      const olderAvg = older.reduce((s, l) => s + l.completionRate, 0) / older.length;
      const diff = Math.round(recentAvg - olderAvg);
      if (diff > 10) observations.push({ type: 'success', text: `📊 Completion rate improved by ${diff}% compared to the previous week!` });
      else if (diff < -10) observations.push({ type: 'warning', text: `⚠️ Completion rate dropped ${Math.abs(diff)}% from last week. Consider reducing your daily task load.` });
    }

    // Overload warning
    const overloaded = logs.filter((l) => l.totalTasks > 10 && l.completionRate < 50);
    if (overloaded.length >= 3) observations.push({ type: 'warning', text: '📌 You often set more than 10 tasks with low completion. Try setting fewer, higher-priority tasks each day.' });

    // Perfect days
    const perfectDays = logs.filter((l) => l.completionRate === 100 && l.totalTasks > 0).length;
    if (perfectDays >= 5) observations.push({ type: 'success', text: `🏆 You've had ${perfectDays} perfect days (100% completion) in the last 3 months!` });

    res.json({ observations: observations.slice(0, 6) });
  } catch (error) {
    next(error);
  }
};

module.exports = { getToday, getDaily, getWeekly, getMonthly, getHeatmap, getStreak, getTrends, getCategories, getObservations };
