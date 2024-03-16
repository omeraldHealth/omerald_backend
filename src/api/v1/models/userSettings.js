const mongoose = require("mongoose");

const userSettingsSchema = new mongoose.Schema({
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
  timestamps: true, // Enable automatic handling of createdAt and updatedAt
  minimize: false, // Ensure empty objects are preserved
});

const UserSettingsModel = mongoose.model('UserSettings', userSettingsSchema);

module.exports = UserSettingsModel;
