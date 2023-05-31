const mongoose = require("mongoose")

const samples = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
});

mongoose.models = {};

const SamplesModel = mongoose.model('samples', samples);

module.exports = SamplesModel
