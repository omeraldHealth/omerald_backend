const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Report name is required.'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  imageUrl: {
    type: String,
    trim: true,
    default: '',
  },
  sample: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sample',
    required: [true, 'Sample reference is required.'],
  }],
  diagnoseConditions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiagnoseConditions', // Consistent naming with the referenced model
    required: [true, 'Diagnose Condition reference is required.'],
  }],
  parameters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parameter',
    required: [true, 'Parameter reference is required.'],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Index for improving query performance on frequently accessed fields
reportSchema.index({ isActive: 1, name: 1 });

// Export the model directly from the schema definition
module.exports = mongoose.model('Report', reportSchema);
