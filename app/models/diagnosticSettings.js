const mongoose  = require("mongoose")

const diagnosticSettings = new mongoose.Schema({
  key: { type: String, required: true },
  value: mongoose.Mixed
});

mongoose.models = {};

const DiagnosticSettingsModel = mongoose.model('diagnosticSetting',diagnosticSettings);

module.exports = DiagnosticSettingsModel

