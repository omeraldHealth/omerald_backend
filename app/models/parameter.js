const mongoose = require('mongoose');

const parameters = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  aliases: { type: [String] },
  units: {type: String},
  bioRefRange: {
    min: String,
    max: String,
  },
  isActive: { type: Boolean, default: false },
});

mongoose.models = {};

const ParametersModel = mongoose.model('parameters', parameters);

module.exports = ParametersModel;
