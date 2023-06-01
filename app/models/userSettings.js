const mongoose  = require("mongoose")

const userSettings = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Mixed,
  isActive: { type: Boolean, default: true },
});

mongoose.models = {};

const UserSettingsModel = mongoose.model('userSettings', userSettings);

module.exports = UserSettingsModel
