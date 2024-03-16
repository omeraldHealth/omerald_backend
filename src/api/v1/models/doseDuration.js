const mongoose = require('mongoose');

const doseDurationSchema = new mongoose.Schema({
  duration: {
    type: {
      type: String, 
      required: [true, 'Duration type is required'], // Enhanced readability with validation message
      enum: ['days', 'weeks', 'months', 'years'], // Assuming these are your intended types
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

const DoseDurationModel = mongoose.model('DoseDuration', doseDurationSchema);
module.exports = DoseDurationModel;
