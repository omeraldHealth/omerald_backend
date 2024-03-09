const mongoose = require("mongoose")

const samples = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  imageUrl: { type: String },
  deletedAt: { type: Date, default: null },
  });
  
  samples.pre(/^find/, function(next) {
    this.where({ deletedAt: null });
    next();
  });
mongoose.models = {};

const SamplesModel = mongoose.model('samples', samples);

module.exports = SamplesModel
