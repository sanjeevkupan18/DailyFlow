const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.use(protect);

router.route('/').get(getCategories).post(createCategory);
router.route('/:id').patch(updateCategory).delete(deleteCategory);

module.exports = router;
