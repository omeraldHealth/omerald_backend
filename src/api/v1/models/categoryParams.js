const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: [true, 'Category name must be unique'], // Clarified the uniqueness constraint with a message
  },
  categoryOptions: {
    type: [String],
    default: []
  }
}, {
  timestamps: true // Simplified timestamp handling
});

categorySchema.index({ categoryName: 1 }, { unique: true, background: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
