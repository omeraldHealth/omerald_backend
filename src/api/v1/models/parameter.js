const mongoose = require('mongoose');

const parameters = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  aliases: { type: [String] },
  units: {type: String},
  bioRefRange: [{
    rangeType: {type:String},
    min: {type:Number},
    max:{type:Number},
    advanceRange: {
        reportType:  {type:String},
        genderType:  {type:String},
        ageRanges: [
          {
            ageRangeType:  {type:String},
            min: {type:Number},
            max:{type:Number},
          }
        ],
        criticality:[
          {
            criticalityType: {type:String},
            min: {type:Number},
            max:{type:Number},
          }
        ]
    }
  }],
  isActive: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  });
  

mongoose.models = {};

const ParametersModel = mongoose.model('parameters', parameters);

module.exports = ParametersModel;
