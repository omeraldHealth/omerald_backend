const mongoose = require("mongoose");

const diagnosticSettingsSchema = new mongoose.Schema({
  settings: {
    FAQs: { type: String, required: true, default: "No Data" },
    PrivacyPolicy: { type: String, required: true, default: "No Data" },
    TermsOfService: { type: String, required: true, default: "No Data" },
    PlatformConsent: { type: String, required: true, default: "No Data" },
    Disclaimer: { type: String, required: true, default: "No Data" },
    CustomerSupport: { type: String, required: true, default: "No Data" },
  }
}, { minimize: false }); // This option prevents MongoDB from automatically removing empty objects

mongoose.models = {};

const DiagnosticSettingsModel = mongoose.model('DiagnosticSettings', diagnosticSettingsSchema);

module.exports = DiagnosticSettingsModel;
