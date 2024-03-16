const DiagnosticSettingsModel = require('../models/diagnosticSettings');

// Get all diagnosticSettings
const getDiagnosticSetting = async (req, res) => {
  try {
    const diagnosticSetting = await DiagnosticSettingsModel.find({});
    res.json(diagnosticSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new diagnosticSetting
const createDiagnosticSetting = async (req, res) => {
  const { settings } = req.body;
  try {
    const diagnosticSetting = await DiagnosticSettingsModel.create({ settings });
    res.status(201).json(diagnosticSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a diagnosticSetting by ID
const updateDiagnosticSetting = async (req, res) => {
  try {
    const filter = {}; // No filter needed as we want to update the first document found or insert if none exists

    // Using 'findOneAndUpdate' with an empty filter.
    // This will update the first document found or insert if none exists.
    const update = { $set: { settings: req.body?.settings || {} } };
    const options = { upsert: true, new: true };

    const diagnosticSetting = await DiagnosticSettingsModel.findOneAndUpdate(filter, update, options);
    res.json(diagnosticSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDiagnosticSetting,
  createDiagnosticSetting,
  updateDiagnosticSetting,
};
