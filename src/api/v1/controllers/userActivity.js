const UserActivity = require('../models/activityParam'); // Adjust the path as necessary

// Get recent activities (limited to 15) sorted by timestamp in descending order
const getActivity = async (req, res) => {
  try {
    const activities = await UserActivity.find({ deletedAt: null }) // Exclude soft-deleted documents
                                         .sort({ timestamp: -1 })
                                         .limit(300);
    if (!activities || activities.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json(activities);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get activity by ID
const getActivityById = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await UserActivity.findOne({ _id: id, deletedAt: null });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new activity
const createActivity = async (req, res) => {
  const { userName, action, details, contentName, content, insertedIds } = req.body;
  try {
    const activity = await UserActivity.create({ userName, action, contentName, content, details, insertedIds });
    res.status(201).json(activity);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
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
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Soft delete an activity by ID
const deleteActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await UserActivity.findByIdAndUpdate(id, { deletedAt: new Date() });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
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