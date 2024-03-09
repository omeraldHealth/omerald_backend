const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String },
  userName: {
    type: String
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: { 
    type: String, 
    default: 'sme' 
  },
  deletedAt: { type: Date, default: null },
});

userSchema.pre(/^find/, function(next) {
  this.where({ deletedAt: null });
  next();
});

const UserTable = mongoose.model('User', userSchema);

module.exports = UserTable;
