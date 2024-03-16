const mongoose = require('mongoose');

// Utility to create validators for different units of time
const createUnitValidator = (unitName) => ({
  type: Number,
  default: 0,
  min: [0, `${unitName} must be a positive number`], // Ensures the value is non-negative with a custom message
  validate: {
    validator: Number.isInteger,
    message: `${unitName} must be an integer` // Provides a clear message for validation failure
  }
});

const validitySchema = new mongoose.Schema({
  year: createUnitValidator('year'),
  month: createUnitValidator('month'),
  week: createUnitValidator('week'),
  day: createUnitValidator('day'),
  hour: createUnitValidator('hour')
}, { _id: false }); // Prevents automatic creation of _id for this sub-document

const sampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sample name is required'],
    unique: [true, 'Sample name must be unique'],
    trim: true, // Trims whitespace
  },
  description: {
    type: String,
    trim: true, // Ensures clean and consistent data storage
    default: ''
  },
  imageUrl: {
    type: String,
    trim: true, // Cleans up the imageUrl field
    default: ''
  },
  deletedAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validity: validitySchema // Incorporates the validitySchema
}, {
  timestamps: true // Enables automatic handling of createdAt and updatedAt timestamps
});

const SamplesModel = mongoose.model('Sample', sampleSchema); // Singular form for the model name as a best practice

module.exports = SamplesModel;
