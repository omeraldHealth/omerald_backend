const mongoose = require('mongoose');

const doseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dose name is required'],
    trim: true, // Trims whitespace from the start and end
  },
  duration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoseDuration', // Ensure this matches the model name you use for dose durations
    required: [true, 'Dose duration reference is required'],
  },
  vaccine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaccine', // Ensure this matches the model name you use for vaccines
    required: [true, 'Vaccine reference is required'],
  },
  type: {
    type: Number,
    required: [true, 'Dose type is required'],
    enum: [1, 2, 3], // Enum to ensure type value is among the defined options
    // 1 = Recommended age, 2 = Catch up age range, 3 = Vaccine in special situations
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

const DoseModel = mongoose.model('doses', doseSchema);
module.exports = DoseModel;
