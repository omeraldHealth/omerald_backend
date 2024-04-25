const mongoose = require("mongoose");

const diagnosticLandingSchema = new mongoose.Schema({
  landing: {
    customerLogos: [{
      url: {
        type: String,
        required: [true, 'URL is required'],
        trim: true
      },
      title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
      },
      meta: {
        type: String,
        trim: true
      }
    }],
    advertisementBanners: [{
      url: {
        type: String,
        required: [true, 'URL is required'],
        trim: true
      },
      title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
      },
      meta: {
        type: String,
        trim: true
      },
    }],
    getStartedUrl: {
      type: String,
      trim: true
    },
    demoVideoUrl: {
      type: String,
      trim: true
    },
    testimonials: [{
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
      },
      rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        trim: true
      },
      reviewDate: {
        type: Date,
        default: Date.now
      }
    }],
    deletedAt: {
      type: Date,
      default: null,
    },
  }
}, {
  timestamps: true, // Add created and updated timestamps
});

// Export the model directly from the schema definition
module.exports = mongoose.model('DiagnosticLandingSettings', diagnosticLandingSchema);
