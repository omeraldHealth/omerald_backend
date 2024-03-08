const UserSettingsModel = require('../models/userSettings');

// Get all userSetting
const getUserSetting = async (req, res) => {
  try {
    const userSetting = await UserSettingsModel.find();
    res.json(userSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserSettingByKey = async (req, res) => {
  const { key } = req.params;
  try {
    const userSetting = await UserSettingsModel.findOne({key});
    res.json(userSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new userSetting
const createUserSetting = async (req, res) => {
  try {
    const userSetting = await UserSettingsModel.create({key: req.body.key,value: req.body.value });
    res.status(201).json(userSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

// Update a userSetting by ID
const updateUserSetting = async (req, res) => {
  const { key, value } = req.body;
  try {
    // Use findOneAndUpdate with upsert: true to either update the existing document or create a new one if it doesn't exist
    const userSetting = await UserSettingsModel.findOneAndUpdate(
      { key: key }, // filter
      { $set: { key: key, value: value } }, // update
      { new: true, upsert: true } // options
    );
    
    // No need to check if userSetting exists here because findOneAndUpdate with upsert will always return a document
    res.json(userSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

const deleteUserSetting = async (req, res) => {
  const { id } = req.params;
  try {
    const userSetting = await UserSettingsModel.findByIdAndDelete(id);
    if (!userSetting) {
      return res.status(404).json({ error: 'userSetting not found' });
    }
    res.json(userSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUserSetting,
  getUserSettingByKey,
  createUserSetting,
  updateUserSetting,
  deleteUserSetting,
};
