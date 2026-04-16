const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getToday, getDaily, getWeekly, getMonthly, getHeatmap,
  getStreak, getTrends, getCategories, getObservations,
} = require('../controllers/statsController');

router.use(protect);

router.get('/today', getToday);
router.get('/daily', getDaily);
router.get('/weekly', getWeekly);
router.get('/monthly', getMonthly);
router.get('/heatmap', getHeatmap);
router.get('/streak', getStreak);
router.get('/trends', getTrends);
router.get('/categories', getCategories);
router.get('/observations', getObservations);

module.exports = router;
