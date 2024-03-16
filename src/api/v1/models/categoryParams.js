const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
  categoryOptions: {
    type: [String],
    default: []
  },
  createdTime: {
    type: Date,
    default: Date.now,
    immutable: true // Created time should not be modified
  },
  lastUpdatedTime: {
    type: Date,
    default: Date.now
  }
});

categorySchema.index({ categoryName: 1 }, { unique: true }); // Index for faster lookup by category name

// Pre-save hook to update last updated time
categorySchema.pre('save', function(next) {
  this.lastUpdatedTime = new Date();
  next();
});

// Pre-update hook to update last updated time
categorySchema.pre('findOneAndUpdate', function(next) {
  this.lastUpdatedTime = new Date();
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
