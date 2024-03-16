const mongoose = require('mongoose');

const healthTopicLinkSchema = new mongoose.Schema({
  id: Number,
  title: String,
  url: String,
  label: String,
  value: String,
}, { _id: false }); 

const diagnoseConditionsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '', 
  },
  imageUrl: {
    type: String,
    trim: true,
    default: '',
  },
  aliases: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  healthTopicLinks: [healthTopicLinkSchema], 
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

const DiagnoseConditionsModel = mongoose.model('DiagnoseConditions', diagnoseConditionsSchema);

module.exports = DiagnoseConditionsModel;
