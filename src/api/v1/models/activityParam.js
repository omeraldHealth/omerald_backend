const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userName: { type: String, required: true },
  action: { 
    type: String, 
    required: true, 
    enum: ['created', 'updated', 'deleted', 'uploaded', 'imported'], // Enum to restrict action to CRUD operations
  },
  details: { type: String }, // Additional details if needed, for example, specifics of what was created, updated, etc.
  timestamp: { type: Date, default: Date.now }, // Automatically capture the time of the activity
  deletedAt: { type: Date, default: null },
  insertedIds: [{type: String}],
  content: {
    type: String,
    // required: true,
    // enum: ['dc', 'reports', 'params', 'samples', 'vaccines', 'doses', 'doseDuration']
  },
  contentName: { type: String }, // e.g., 'branch "apollo jay"'
});

// Optionally, you might want to index fields commonly queried upon
userActivitySchema.index({ userName: 1, timestamp: -1 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;