const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    index: true, // Ensures faster queries by userName
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: {
      values: ['created', 'updated', 'deleted', 'uploaded', 'imported'],
      message: '{VALUE} is not a supported action', // Custom message for enum validation
    },
  },
  details: {
    type: String,
    trim: true,
    default: '', // Provides a default empty string for details
  },
  timestamp: {
    type: Date,
    default: Date.now, // Captures the activity timestamp; consider relying on createdAt for creation timestamp
  },
  deletedAt: {
    type: Date,
    default: null, // For logical deletion
  },
  insertedIds: {
    type: [String],
    default: [], // Ensures the field is always an array
  },
  content: {
    type: String,
    trim: true, // Trims whitespace from content
  },
  contentName: {
    type: String,
    trim: true,
    default: '', // Default empty string for contentName
  },
}, {
  timestamps: { createdAt: 'createdTime', updatedAt: 'lastUpdatedTime' }, // Auto-manages created and updated timestamps
});

// Consider whether the timestamp field is redundant with the automatic timestamps, and if so, it may be removed to optimize the schema.

userActivitySchema.index({ userName: 1, 'timestamps.createdAt': -1 }, { background: true }); // Optimizes sorting by creation time

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;
