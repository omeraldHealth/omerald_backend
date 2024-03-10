const mongoose = require('mongoose');


const parameters = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  aliases: { type: [String] },
  units: {type: String},
  bioRefRange: [{
    basicRange: {
      min: {type:Number},
      max:{type:Number},
    },
    advanceRange: {
        ageRange: [
          {
            ageRangeType: { 
              type: String, 
              enum: ['pediatric', 'senior', 'adult'], // Ensures only these values are allowed
              required: true 
            },
            unit: {type:String},
            min: {type:Number},
            max:{type:Number},
          }
        ],
        genderRange:  [
          {
            generRangeType: { 
              type: String, 
              enum: ['male', 'female', 'other'], // Ensures only these values are allowed
              required: true 
            },
            unit: {type:String},
            min: {type:Number},
            max:{type:Number},
            details: {
              menopause: { 
                type: Boolean, 
                default: false,
              },
              pregnant: { 
                type: Boolean, 
                default: false
              },
              trimester: {
                type: {
                  type: String,
                  enum: ['first', 'second', 'third', 'none'],
                  default: 'none',
                },
                  unit: { type: String },
                  min: { type: String },
                  max: { type: String },
              },
              prePuberty: { 
                type: Boolean, 
                default: false,
              }
            }
          }
        ],
        customCategory: [{
          categoryName: { type: String },
          subCategory: {categoryName: String,
            categoryOptions: [{
              categoryType: { type: String },
              min: { type: Number },
              max: { type: Number },
              unit: { type: String }
          }]}, // Recursive relationship
          categoryOptions: [{
            categoryType: { type: String },
            min: { type: Number },
            max: { type: Number },
            unit: { type: String }
          }]
        }]
    }
  }],
  isActive: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  });
  

mongoose.models = {};

const ParametersModel = mongoose.model('parameters', parameters);

module.exports = ParametersModel;
