const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // Store as 'YYYY-MM-DD' string for easy querying
      required: true,
    },
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }, // 0-100
    performanceScore: { type: Number, default: 0 }, // 0-100 (priority-weighted)
    categoryBreakdown: [
      {
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        categoryName: { type: String },
        total: { type: Number, default: 0 },
        completed: { type: Number, default: 0 },
      },
    ],
    streak: { type: Number, default: 0 },
    notes: { type: String, default: '', maxlength: 500 },
  },
  { timestamps: true }
);

// Unique log per user per day
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
