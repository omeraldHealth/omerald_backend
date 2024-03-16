const mongoose = require("mongoose");

const diagnosticSettingsSchema = new mongoose.Schema({
  settings: {
    FAQs: { type: String, description: "Frequently Asked Questions section", default: "No Data" },
    PrivacyPolicy: { type: String, description: "Privacy Policy section", default: "No Data" },
    TermsOfService: { type: String, description: "Terms of Service section", default: "No Data" },
    PlatformConsent: { type: String, description: "Platform Consent section", default: "No Data" },
    Disclaimer: { type: String, description: "Disclaimer section", default: "No Data" },
    CustomerSupport: { type: String, description: "Customer Support section", default: "No Data" },
  }
}, { minimize: false });

mongoose.models = {};

const DiagnosticSettingsModel = mongoose.model('DiagnosticSettings', diagnosticSettingsSchema);

module.exports = DiagnosticSettingsModel;
