const mongoose = require('mongoose');

const doses = new mongoose.Schema({
  name: { type: String, required: true },
  duration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doseDurations',
  },
  vaccine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'vaccines',
  },
  type: Number, // 1 = Recommended age, 2 = Catch up age range, 3 = Vaccine in special situations
});

mongoose.models = {};

const DoseModel = mongoose.model('doses', doses);
module.exports = DoseModel;
