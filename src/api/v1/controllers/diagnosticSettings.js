const DiagnosticSettingsModel = require('../models/diagnosticSettings');

// Get all diagnosticSetting
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
  const {settings} = req.body;
  try {
    const diagnosticSetting = await DiagnosticSettingsModel.create(settings);
    res.status(201).json(diagnosticSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};
// Update a diagnosticSetting by ID
const updateDiagnosticSetting = async (req, res) => {
  try {
    const filter = {};

    const update = { $set: { settings: req.body[0]?.settings } };
    // Setting 'upsert' to true ensures that if no document exists, it will create one.
    const options = { upsert: true, new: true };

    // Using 'findOneAndUpdate' with an empty filter.
    // This will update the first document found or insert if none exists.
    const userSetting = await DiagnosticSettingsModel.findOneAndUpdate(filter, update, options);
    console.log(userSetting)
    res.json(userSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

module.exports = {
  getDiagnosticSetting,
  createDiagnosticSetting,
  updateDiagnosticSetting,
};
