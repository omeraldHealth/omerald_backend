const UserActivity = require('../models/activityParam'); // Adjust the path as necessary

const getActivity = async (req, res) => {
    const { id } = req.params;
    try {
      const activity = await UserActivity.find();
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' + error });
    }
  };

// Get activity by ID
const getActivityById = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await UserActivity.findById(id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

// Create a new activity
const createActivity = async (req, res) => {
  const { userName, action, target, details } = req.body;
  try {
    const activity = await UserActivity.create({ userName, action, target, details });
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

// Update an activity by ID
const updateActivity = async (req, res) => {
  const { id } = req.body;
  try {
    const activity = await UserActivity.findByIdAndUpdate(id, req.body, { new: true });
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an activity by ID
const deleteActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await UserActivity.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivity
}