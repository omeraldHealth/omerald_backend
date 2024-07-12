const mongoose = require('mongoose');

// Define a custom validator for URL validation
const urlValidator = {
  validator: (value) => {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(value);
  },
  message: 'Please provide a valid URL.',
};

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
    // required: [true, 'Health topic link URL is required.'],
    trim: true,
    validate: urlValidator, // Using custom validator for URL validation
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
  },
  aliases: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: false,
  },
  healthTopicLinks: {
    type: [healthTopicLinkSchema],
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Export the model directly from the schema definition
module.exports = mongoose.model('DiagnoseConditions', diagnoseConditionsSchema);
