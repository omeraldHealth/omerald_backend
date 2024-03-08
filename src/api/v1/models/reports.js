const mongoose = require("mongoose")

var reports = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  sample: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'samples',
  },
  diagnoseConditions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'diagnoseConditions',
    },
  ],
  parameters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'parameters',
    },
  ],
  isActive: { type: Boolean, default: false },
});

mongoose.models = {};

var ReportsModel = mongoose.model('reports', reports);

module.exports = ReportsModel