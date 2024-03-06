const mongoose = require('mongoose');

const ignoredParams =new mongoose.Schema({
  name: {type:String},
  value: {type: String},
  unit:{type:String},
  range: {type:String},
  category: {type:String}
});

mongoose.models = {};

const IgnoredParams = mongoose.model('ignoredParams', ignoredParams);

module.exports = IgnoredParams;
