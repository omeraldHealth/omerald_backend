const Category = require('../models/categoryParams');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ deletedAt: null }).lean(); // Use lean() for better performance
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: true, message: 'Failed to fetch categories' });
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
    res.status(400).json({ error: true, message: 'Failed to create category', details: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName, categoryOptions } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(id, { categoryName, categoryOptions }, { new: true });
    if (!category) {
      return res.status(404).json({ error: true, message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: true, message: 'Failed to update category', details: error.message });
  }
};

// Soft delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndUpdate(id, { deletedAt: new Date() });
    if (!category) {
      return res.status(404).json({ error: true, message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: true, message: 'Failed to delete category', details: error.message });
  }
};
