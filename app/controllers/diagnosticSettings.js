const DiagnosticSettingsModel = require('../models/diagnosticSettings');

// Get all diagnosticSetting
const getDiagnosticSetting = async (req, res) => {
  try {
    const diagnosticSetting = await DiagnosticSettingsModel.find();
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
    const diagnosticSetting = await DiagnosticSettingsModel.findOneAndUpdate({key:key},req.body, { new: true });
    if (!diagnosticSetting) {
      return res.status(404).json({ error: 'diagnosticSetting not found' });
    }
    res.json(diagnosticSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDiagnosticSetting,
  getDiagnosticSettingByKey,
  createDiagnosticSetting,
  updateDiagnosticSetting,
};
