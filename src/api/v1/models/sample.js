const mongoose = require("mongoose")

const samples = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  imageUrl: { type: String },
  deletedAt: { type: Date, default: null },
  validity: {
    value: {
      type: Number,
      required: true,
      min: 1, // Assuming validity must be at least 1 unit
    },
    unit: {
      type: String,
      required: true,
      enum: ['minutes','hours', 'days', 'months', 'years'], // Restrict to these units
    },
  },

  });
  
mongoose.models = {};

const SamplesModel = mongoose.model('samples', samples);

module.exports = SamplesModel
