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

const getDiagnosticSettingByKey = async (req, res) => {
  const { key } = req.params;
  try {
    const diagnosticSetting = await DiagnosticSettingsModel.findOne({key});
    res.json(diagnosticSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new diagnosticSetting
const createDiagnosticSetting = async (req, res) => {
  try {
    const diagnosticSetting = await DiagnosticSettingsModel.create({key: req.body.key,value: req.body.value });
    res.status(201).json(diagnosticSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

// Update a diagnosticSetting by ID
const updateDiagnosticSetting = async (req, res) => {
  const { key } = req.body;
  try {
    // Update the existing diagnosticSetting document or create a new one if it doesn't exist
    const diagnosticSetting = await DiagnosticSettingsModel.findOneAndUpdate(
      { key: key }, // filter
      req.body, // update with the full request body
      { new: true, upsert: true } // options: return the updated document and upsert
    );
    
    // Since upsert is true, diagnosticSetting will always be defined, either as the updated or the newly created document
    res.json(diagnosticSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};


module.exports = {
  getDiagnosticSetting,
  getDiagnosticSettingByKey,
  createDiagnosticSetting,
  updateDiagnosticSetting,
};
