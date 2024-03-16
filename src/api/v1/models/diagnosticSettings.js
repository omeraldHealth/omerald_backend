const mongoose = require("mongoose");

const diagnosticSettingsSchema = new mongoose.Schema({
  FAQs: {
    type: String,
    default: "No Data"
  },
  PrivacyPolicy: {
    type: String,
    default: "No Data"
  },
  TermsOfService: {
    type: String,
    default: "No Data"
  },
  PlatformConsent: {
    type: String,
    default: "No Data"
  },
  Disclaimer: {
    type: String,
    default: "No Data"
  },
  CustomerSupport: {
    type: String,
    default: "No Data"
  }
}, {
  timestamps: true, // Add created and updated timestamps
  minimize: false, // Ensure empty objects are stored
  toObject: { virtuals: true }, // Ensure virtuals are included when converting the document to an object
  toJSON: { virtuals: true } // Ensure virtuals are included when converting the document to JSON
});

const DiagnosticSettingsModel = mongoose.model('DiagnosticSettings', diagnosticSettingsSchema);

module.exports = DiagnosticSettingsModel;
