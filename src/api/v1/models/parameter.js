const mongoose = require('mongoose');

const bioRefSubCategorySchema = new mongoose.Schema({
  categoryName: String,
  categoryOptions: [{
    categoryType: String,
    min: Number,
    max: Number,
    unit: String,
  }],
}, { _id: false });

const bioRefCustomCategorySchema = new mongoose.Schema({
  categoryName: String,
  subCategory: bioRefSubCategorySchema,
  categoryOptions: [{
    categoryType: String,
    min: Number,
    max: Number,
    unit: String,
  }],
}, { _id: false });

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

const parametersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
          required: true,
        },
        unit: String,
        min: Number,
        max: Number,
      }],
      genderRange: [{
        genderRangeType: { 
          type: String, 
          enum: ['male', 'female', 'other'],
          required: true,
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

// Exclude logically deleted documents by default in find queries
parametersSchema.pre(/^find/, function(next) {
  this.where({ deletedAt: null });
  next();
});

const ParametersModel = mongoose.model('Parameter', parametersSchema);

module.exports = ParametersModel;
