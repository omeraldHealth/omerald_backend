// controllers/diagnosticLandingController.js
const expressAsyncHandler = require('express-async-handler');
const DiagnosticLandingSettings = require('../models/diagnosticLanding'); // Adjust the import path as needed

exports.createOrUpdateLandingSettings = expressAsyncHandler(async (req, res) => {
  const existingSettings = await DiagnosticLandingSettings.findOne();

  if (existingSettings) {
    // Update existing settings
    const updatedSettings = await DiagnosticLandingSettings.findByIdAndUpdate(
      existingSettings._id, req.body,
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
  const { id } = req.body;

  console.log(DiagnosticLandingSettings.findById(id));
  try {
    const settings = await DiagnosticLandingSettings.findByIdAndUpdate(id, { landing: {deletedAt: Date.now() }});
    console.log(settings);
    if (!settings) {
      return res.status(404).json({ error: 'Landing Settings not found' });
    }
    res.json({ message: 'Landing Settings deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_SECRET_REGION,
});

const s3 = new AWS.S3();

exports.uploadDiagImages = expressAsyncHandler(async (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  
  const params = {
      Bucket: 'omerald-diagnostic', // Set your bucket name
      Key: `uploads/${req.file.originalname}`, // File name you want to save as
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read' // Adjust ACL according to your requirements
  };

  try {
      const data = await s3.upload(params).promise();
      res.send({ url: data.Location });
  } catch (err) {
      res.status(500).send(err.message);
  }
});
