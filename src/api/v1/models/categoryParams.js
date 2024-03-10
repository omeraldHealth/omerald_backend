const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: { type: String },
  categoryOptions: [{type: String}]
});

const Category = mongoose.model('category', categorySchema);

module.exports = Category;
