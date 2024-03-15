const UserActivity = require('../models/activityParam'); // Adjust the path as necessary

const getActivity = async (req, res) => {
  // Assuming `id` is used for something specific in your function, but it's not utilized in the given example.
  const { id } = req.params;
  try {
    // Find activities excluding soft-deleted ones, sort them by the 'timestamp' field in descending order, and limit the results to 15.
    const activity = await UserActivity.find({ deletedAt: null }) // Exclude soft-deleted documents
                                        .sort({ timestamp: -1 })
                                        .limit(15);
    if (!activity || activity.length === 0) {
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
    const activity = await UserActivity.findOne({ _id: id, deletedAt: null });

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
  const { userName, action, details, contentName, content,insertedIds } = req.body;
  try {
    const activity = await UserActivity.create({ userName, action, contentName, content, details, insertedIds });
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

const deleteActivity = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the current user to get the phoneNumber
    const activity = await UserActivity.findByIdAndUpdate(id, { deletedAt: new Date()});
     
    if (!activity) {
      throw new Error('activity not found');
    }
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    // Handle error appropriately
  }
};

module.exports = {
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivity
}