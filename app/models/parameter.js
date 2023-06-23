const mongoose = require('mongoose');

const parameters = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  aliases: { type: [String] },
  units: {type: String},
  bioRefRange: {
    reportType: String,
    genders: [
      {
        genderType: String,
        ageRanges: [
          {
            rangeType: String,
            min: Number,
            max: Number,
            advance: [
              {
                advanceType: String,
                min: Number,
                max: Number
              }
            ]
          }
        ]
      }
    ]
  },
  isActive: { type: Boolean, default: false },
});

mongoose.models = {};

const ParametersModel = mongoose.model('parameters', parameters);

module.exports = ParametersModel;
