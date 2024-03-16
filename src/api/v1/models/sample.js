const mongoose = require('mongoose');

// Utility to create validators for different units of time
const createUnitValidator = (unitName) => ({
  type: Number,
  default: 0,
  min: [0, `${unitName} must be a positive number`],
  validate: {
    validator: Number.isInteger,
    message: `${unitName} must be an integer`
  }
});

const validitySchema = new mongoose.Schema({
  year: createUnitValidator('year'),
  month: createUnitValidator('month'),
  week: createUnitValidator('week'),
  day: createUnitValidator('day'),
  hour: createUnitValidator('hour')
}, { _id: false });

const sampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sample name is required'],
    unique: true, // Unique constraint directly specified
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  imageUrl: {
    type: String,
    trim: true,
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
  validity: validitySchema
}, {
  timestamps: true
});

// Index for improving query performance on frequently accessed fields
sampleSchema.index({ name: 1 });

const SampleModel = mongoose.model('Sample', sampleSchema);

module.exports = SampleModel;
