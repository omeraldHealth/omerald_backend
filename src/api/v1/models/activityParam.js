const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['created', 'updated', 'deleted', 'uploaded', 'imported'],
  },
  details: {
    type: String,
    trim: true,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  insertedIds: [{
    type: String,
    trim: true,
    default: [],
  }],
  content: {
    type: String,
    required: true,
    trim: true,
  },
  contentName: {
    type: String,
    trim: true,
    default: null,
  },
}, {
  timestamps: { createdAt: 'createdTime', updatedAt: 'lastUpdatedTime' },
});

userActivitySchema.index({ userName: 1, timestamp: -1 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;
