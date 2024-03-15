const mongoose = require("mongoose")

const createUnitValidator = (unitName) => ({
  type: Number,
  default: 0,
  validate: {
    validator: function(value) {
      return value >= 0;
    },
    message: props => `${props.value} is not a valid ${unitName}!`
  }
});

const validitySchema = {
  year: createUnitValidator('year'),
  month: createUnitValidator('month'),
  week: createUnitValidator('week'),
  day: createUnitValidator('day'),
  hour: createUnitValidator('hour')
};

const samples = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  imageUrl: { type: String },
  deletedAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  validity: validitySchema, 
});
  
mongoose.models = {};

const SamplesModel = mongoose.model('samples', samples);

module.exports = SamplesModel
