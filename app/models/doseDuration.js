const mongoose = require('mongoose');

const doseDurations = new mongoose.Schema({
  duration: { type: String, required: true },
});

mongoose.models = {};

const DoseDurationsModel = mongoose.model('doseDurations', doseDurations);
module.exports = DoseDurationsModel;
