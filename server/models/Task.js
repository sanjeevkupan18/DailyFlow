const mongoose = require('mongoose');

const PRIORITY_WEIGHTS = { low: 1, medium: 2, high: 3, urgent: 4 };

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    priorityWeight: {
      type: Number,
      default: 2,
    },
    tags: {
      type: [String],
      default: [],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      index: true,
    },
    estimatedMinutes: {
      type: Number,
      default: null,
      min: 1,
      max: 480,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringDays: {
      type: [String],
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Set priority weight automatically
taskSchema.pre('save', function (next) {
  this.priorityWeight = PRIORITY_WEIGHTS[this.priority] || 2;
  next();
});

taskSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.priority) {
    update.priorityWeight = PRIORITY_WEIGHTS[update.priority] || 2;
  }
  next();
});

// Compound index for fetching tasks by user and date
taskSchema.index({ userId: 1, dueDate: 1, isDeleted: 1 });

module.exports = mongoose.model('Task', taskSchema);
