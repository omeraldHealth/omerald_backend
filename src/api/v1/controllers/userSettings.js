const UserSettingsModel = require('../models/userSettings');

// Get the user settings
const getUserSetting = async (req, res) => {
  try {
    const userSetting = await UserSettingsModel.findOne();
    if (!userSetting) {
      throw new DatabaseError('No user settings found');
    }
    res.json(userSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// Create a new user setting
const createUserSetting = async (req, res) => {
  const { settings } = req.body;
  try {
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
      res.status(400).json({ error: 'Invalid settings object' });
    }

    const userSetting = await UserSettingsModel.create(settings);
    res.status(201).json(userSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// Update the user settings
const updateUserSetting = async (req, res) => {
  try {
    // Since there's only one settings document, we can use an empty filter object.
    // This means "match the first document you find", which in this case, is the only document.
    const filter = {};

    const update = { $set: { settings: req.body[0]?.settings } };
    // Setting 'upsert' to true ensures that if no document exists, it will create one.
    const options = { upsert: true, new: true };

    // Using 'findOneAndUpdate' with an empty filter.
    // This will update the first document found or insert if none exists.
    const userSetting = await UserSettingsModel.findOneAndUpdate(filter, update, options);
    res.json(userSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

module.exports = {
  getUserSetting,
  createUserSetting,
  updateUserSetting,
};
