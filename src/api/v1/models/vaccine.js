const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vaccine name is required'],
    unique: true, // Ensure uniqueness constraint directly specified
    trim: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Index for improving query performance on frequently accessed fields
vaccineSchema.index({ name: 1 });

// Error handling middleware
vaccineSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Vaccine name must be unique'));
  } else {
    next(error);
  }
});

const VaccineModel = mongoose.model('Vaccine', vaccineSchema); // Singular name for the model as per best practices

module.exports = VaccineModel;
