const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vaccine name is required'], // Adds a custom validation message
    unique: [true, 'Vaccine name must be unique'], // Ensures vaccine names are unique with a custom message
    trim: true, // Trims whitespace from the vaccine name
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// If you want to ensure the uniqueness constraint is applied correctly, consider handling errors for unique index violations in your application logic

const VaccinesModel = mongoose.model('Vaccine', vaccineSchema); // Singular name for the model as per best practices

module.exports = VaccinesModel;
