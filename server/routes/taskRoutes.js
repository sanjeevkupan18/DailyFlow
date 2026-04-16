const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');
const {
  createTask, getTasks, getTask, updateTask, toggleTask, deleteTask, reorderTasks,
} = require('../controllers/taskController');

router.use(protect, apiLimiter);

router.route('/').get(getTasks).post(createTask);
router.patch('/reorder', reorderTasks);
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);
router.patch('/:id/toggle', toggleTask);

module.exports = router;
