const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true, // Trims whitespace
    required: [true, 'User name is required'],
  },
  phoneNumber: {
    type: String,
    trim: true,
    required: [true, 'Phone number is required'],
    unique: [true, 'Phone number must be unique'],
    match: [/^\+\d{10,14}$/, 'Please fill a valid phone number'], // Validates phone number format
  },
  role: {
    type: String,
    default: 'sme',
    enum: ['sme', 'admin', 'user', 'legal'], // Specifies allowed roles
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: { createdAt: 'createdTime', updatedAt: 'lastUpdatedTime' }, // Automatically manage creation and update timestamps
});

// Pre-save hook for additional validations or transformations if necessary
userSchema.pre('save', function(next) {
  // Example: Ensure userName is processed or validated further if needed
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
