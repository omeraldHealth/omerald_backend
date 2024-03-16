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

// Create a new userSetting
const createUserSetting = async (req, res) => {
  const {settings} = req.body;
  try {
    const userSetting = await UserSettingsModel.create(settings);
    res.status(201).json(userSetting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

// Update a userSetting by ID
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
    console.log(userSetting)
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
