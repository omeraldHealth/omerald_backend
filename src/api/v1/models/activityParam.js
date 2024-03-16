const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    index: true,
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: {
      values: ['created', 'updated', 'deleted', 'uploaded', 'imported'],
      message: '{VALUE} is not a supported action'
    },
  },
  details: {
    type: String,
    trim: true,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  insertedIds: {
    type: [String],
    trim: true,
    default: [],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
  },
  contentName: {
    type: String,
    trim: true,
    default: '',
  },
}, {
  timestamps: { createdAt: 'createdTime', updatedAt: 'lastUpdatedTime' },
});

userActivitySchema.index({ userName: 1, timestamp: -1 }, { background: true });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;
