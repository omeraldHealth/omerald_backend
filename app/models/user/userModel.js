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
});

const User = mongoose.model('User', userSchema);

module.exports = User;
