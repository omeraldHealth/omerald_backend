// controllers/diagnosticLandingController.js
const expressAsyncHandler = require('express-async-handler');
const DiagnosticLandingSettings = require('../models/diagnosticLanding'); // Adjust the import path as needed

exports.createOrUpdateLandingSettings = expressAsyncHandler(async (req, res) => {
  const existingSettings = await DiagnosticLandingSettings.findOne();

  if (existingSettings) {
    // Update existing settings
    const updatedSettings = await DiagnosticLandingSettings.findByIdAndUpdate(
      existingSettings._id,
      { landing: req.body },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: 'Landing settings updated successfully',
      data: updatedSettings
    });
  } else {
    // Create new settings if not existing
    const newSettings = await DiagnosticLandingSettings.create({ landing: req.body });
    res.status(201).json({
      message: 'Landing settings created successfully',
      data: newSettings
    });
  }
});

exports.getLandingSettings = expressAsyncHandler(async (req, res) => {
  const settings = await DiagnosticLandingSettings.findOne();
  if (!settings) {
    res.status(404).json({ message: 'Landing settings not found' });
  } else {
    res.status(200).json(settings);
  }
});

exports.deleteLandingSettings = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const settings = await DiagnosticLandingSettings.findByIdAndUpdate(id, { deletedAt: Date.now() });
    if (!settings) {
      return res.status(404).json({ error: 'Landing Settings not found' });
    }
    res.json({ message: 'Landing Settings deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
