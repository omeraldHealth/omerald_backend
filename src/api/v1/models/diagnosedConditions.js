const mongoose = require('mongoose');

const healthTopicLinkSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, 'Health topic link ID is required.'],
  },
  title: {
    type: String,
    required: [true, 'Health topic link title is required.'],
    trim: true,
  },
  url: {
    type: String,
    required: [true, 'Health topic link URL is required.'],
    trim: true,
    match: [/^https?:\/\/.+/i, 'Please provide a valid URL.'], // Simple regex for URL validation
  },
  label: {
    type: String,
    trim: true,
  },
  value: {
    type: String,
    trim: true,
  },
}, { _id: false });

const diagnoseConditionsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
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
    match: [/^https?:\/\/.+/i, 'Please provide a valid image URL.'], // Simple regex for URL validation
  },
  aliases: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  healthTopicLinks: {
    type: [healthTopicLinkSchema],
    validate: {
      validator: function(v) {
        return v.length > 0; // Ensure there's at least one health topic link
      },
      message: 'At least one health topic link is required.'
    }
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const DiagnoseConditionsModel = mongoose.model('DiagnoseConditions', diagnoseConditionsSchema);

module.exports = DiagnoseConditionsModel;
