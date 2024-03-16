const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, 'Category name is required'], // Adding a validation message
    trim: true, // Trims whitespace around the category name
    unique: true, // Ensures categoryName is unique across all documents
  },
  categoryOptions: {
    type: [String],
    default: [],
  },
  createdTime: {
    type: Date,
    default: Date.now,
    immutable: true, // Ensures createdTime cannot be modified
  },
  lastUpdatedTime: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: { createdAt: 'createdTime', updatedAt: 'lastUpdatedTime' }, // Use Mongoose's timestamps option
});

// Ensure the `unique` property on `categoryName` is enforced.
// Note: Mongoose's `unique` isn't a validator but tells Mongoose to create a unique index.
categorySchema.index({ categoryName: 1 }, { unique: true });

// Pre-update middleware for `updateOne` and `findOneAndUpdate` operations
categorySchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ lastUpdatedTime: new Date() }); // Correctly update lastUpdatedTime
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
