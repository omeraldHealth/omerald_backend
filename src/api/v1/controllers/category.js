const Category = require('../models/categoryParams');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ deletedAt: null });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  const { categoryName, categoryOptions } = req.body;

  try {
    const category = new Category({ categoryName, categoryOptions });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName, categoryOptions } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.categoryName = categoryName;
    category.categoryOptions = categoryOptions;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Soft delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.deletedAt = new Date();
    await category.save();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
