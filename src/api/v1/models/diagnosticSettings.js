const mongoose = require("mongoose");

const diagnosticSettingsSchema = new mongoose.Schema({
  settings: {
    FAQs: {
      type: String,
      default: "No Data",
      trim: true,
      validate: {
        validator: (value) => value.length > 0,
        message: 'FAQs cannot be empty'
      }
    },
    PrivacyPolicy: {
      type: String,
      default: "No Data",
      trim: true,
      validate: {
        validator: (value) => value.length > 0,
        message: 'Privacy Policy cannot be empty'
      }
    },
    TermsOfService: {
      type: String,
      default: "No Data",
      trim: true,
      validate: {
        validator: (value) => value.length > 0,
        message: 'Terms of Service cannot be empty'
      }
    },
    PlatformConsent: {
      type: String,
      default: "No Data",
      trim: true,
      validate: {
        validator: (value) => value.length > 0,
        message: 'Platform Consent cannot be empty'
      }
    },
    Disclaimer: {
      type: String,
      default: "No Data",
      trim: true,
      validate: {
        validator: (value) => value.length > 0,
        message: 'Disclaimer cannot be empty'
      }
    },
    CustomerSupport: {
      type: String,
      default: "No Data",
      trim: true,
      validate: {
        validator: (value) => value.length > 0,
        message: 'Customer Support cannot be empty'
      }
    }
  }
}, {
  timestamps: true, // Add created and updated timestamps
  minimize: false, // Ensure empty objects are stored
  toObject: { virtuals: true }, // Ensure virtuals are included when converting the document to an object
  toJSON: { virtuals: true } // Ensure virtuals are included when converting the document to JSON
});

// Export the model directly from the schema definition
module.exports = mongoose.model('DiagnosticSettings', diagnosticSettingsSchema);
