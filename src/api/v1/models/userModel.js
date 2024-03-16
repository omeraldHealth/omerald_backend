const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    required: [true, 'User name is required'],
  },
  phoneNumber: {
    type: String,
    trim: true,
    required: [true, 'Phone number is required'],
    unique: true, // Ensure uniqueness constraint directly specified
    match: [/^\+\d{10,14}$/, 'Please fill a valid phone number'],
  },
  role: {
    type: String,
    default: 'sme',
    enum: ['sme', 'admin', 'user', 'legal'],
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: { createdAt: 'createdTime', updatedAt: 'lastUpdatedTime' },
});

// Index for improving query performance on frequently accessed fields
userSchema.index({ userName: 1, role: 1 });

// Pre-save hook for additional validations or transformations
userSchema.pre('save', function(next) {
  // Example: Ensure userName is processed or validated further if needed
  next();
});

// Error handling middleware
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Phone number must be unique'));
  } else {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
