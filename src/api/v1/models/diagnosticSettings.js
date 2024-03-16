const mongoose = require("mongoose");

const diagnosticSettingsSchema = new mongoose.Schema({
  settings: {
    FAQs: {
      type: String,
      default: "No Data",
      trim: true,
      validate: [value => value.length > 0, 'FAQs cannot be empty']
    },
    PrivacyPolicy: {
      type: String,
      default: "No Data",
      trim: true,
      validate: [value => value.length > 0, 'Privacy Policy cannot be empty']
    },
    TermsOfService: {
      type: String,
      default: "No Data",
      trim: true,
      validate: [value => value.length > 0, 'Terms of Service cannot be empty']
    },
    PlatformConsent: {
      type: String,
      default: "No Data",
      trim: true,
      validate: [value => value.length > 0, 'Platform Consent cannot be empty']
    },
    Disclaimer: {
      type: String,
      default: "No Data",
      trim: true,
      validate: [value => value.length > 0, 'Disclaimer cannot be empty']
    },
    CustomerSupport: {
      type: String,
      default: "No Data",
      trim: true,
      validate: [value => value.length > 0, 'Customer Support cannot be empty']
    }
  }
}, {
  timestamps: true, // Add created and updated timestamps
  minimize: false, // Ensure empty objects are stored
  toObject: { virtuals: true }, // Ensure virtuals are included when converting the document to an object
  toJSON: { virtuals: true } // Ensure virtuals are included when converting the document to JSON
});

const DiagnosticSettingsModel = mongoose.model('DiagnosticSettings', diagnosticSettingsSchema);

module.exports = DiagnosticSettingsModel;
