const mongoose = require('mongoose');

const doseDurationSchema = new mongoose.Schema({
  duration: {
    type: {
      type: String, 
      required: [true, 'Duration type is required'],
      enum: {
        values: ['days', 'weeks', 'months', 'years'],
        message: 'Invalid duration type. Must be one of: days, weeks, months, years'
      },
      trim: true
    },
    value: {
      type: String, 
      required: [true, 'Duration value is required'],
      trim: true
    }
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export the model directly from the schema definition
module.exports = mongoose.model('DoseDuration', doseDurationSchema);
