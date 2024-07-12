const mongoose = require('mongoose');

const genderRangeDetailsSchema = new mongoose.Schema({
  menopause: { type: Boolean, default: false },
  pregnant: { type: Boolean, default: false },
  trimester: {
    type: String,
    enum: ['first', 'second', 'third', 'none'],
    default: 'none',
  },
  prePuberty: { type: Boolean, default: false },
}, { _id: false });

const bioRefSubCategorySchema = new mongoose.Schema({
  categoryType: String,
  min: Number,
  max: Number,
  unit: String,
}, { _id: false });

const bioRefCustomCategorySchema = new mongoose.Schema({
  categoryName: String,
  subCategory: bioRefSubCategorySchema,
  categoryOptions: [bioRefSubCategorySchema],
}, { _id: false });

const parametersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Parameter name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  aliases: [String],
  units: String,
  bioRefRange: {
    basicRange: [{
      min: Number,
      max: Number,
      unit: String,
    }],
    advanceRange: {
      ageRange: [{
        ageRangeType: { 
          type: String, 
          enum: ['pediatric', 'senior', 'adult'],
          required: [true, 'Age range type is required'],
        },
        unit: String,
        min: Number,
        max: Number,
      }],
      genderRange: [{
        genderRangeType: { 
          type: String, 
          enum: ['male', 'female', 'other'],
          required: [true, 'Gender range type is required'],
        },
        unit: String,
        min: Number,
        max: Number,
        details: genderRangeDetailsSchema,
      }],
      customCategory: [bioRefCustomCategorySchema],
    }
  },
  remedy: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
});

// Export the model directly from the schema definition
module.exports = mongoose.model('Parameter', parametersSchema);
