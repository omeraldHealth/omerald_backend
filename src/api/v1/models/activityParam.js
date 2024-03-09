const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userName: { type: String, required: true },
  action: { 
    type: String, 
    required: true, 
    enum: ['created', 'updated', 'deleted', 'uploaded', 'imported'], // Enum to restrict action to CRUD operations
  },
  target: { type: String, required: true }, // e.g., 'branch "apollo jay"'
  details: { type: String }, // Additional details if needed, for example, specifics of what was created, updated, etc.
  timestamp: { type: Date, default: Date.now }, // Automatically capture the time of the activity
  deletedAt: { type: Date, default: null },
});

// Optionally, you might want to index fields commonly queried upon
userActivitySchema.index({ userName: 1, timestamp: -1 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;