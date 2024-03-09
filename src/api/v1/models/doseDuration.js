const mongoose = require('mongoose');

const doseDurations = new mongoose.Schema({
  duration: { 
    type: {type: String, required: true},
    value: {type: String, required: true}
   },
   deletedAt: { type: Date, default: null },
  });
  
  doseDurations.pre(/^find/, function(next) {
    this.where({ deletedAt: null });
    next();
  });

mongoose.models = {};

const DoseDurationsModel = mongoose.model('doseDurations', doseDurations);
module.exports = DoseDurationsModel;
