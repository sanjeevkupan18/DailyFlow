const Category = require('../models/Category');
const Task = require('../models/Task');

// @desc  Get all categories
// @route GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ userId: req.user._id }).sort({ isDefault: -1, name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc  Create category
// @route POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;
    const category = await Category.create({ userId: req.user._id, name, color, icon });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc  Update category
// @route PATCH /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    next(error);
  }
};

// @desc  Delete category
// @route DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, userId: req.user._id });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (category.isDefault) return res.status(400).json({ message: 'Cannot delete default categories' });

    // Unset category from tasks
    await Task.updateMany({ userId: req.user._id, category: req.params.id }, { $unset: { category: 1 } });
    await category.deleteOne();

    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
