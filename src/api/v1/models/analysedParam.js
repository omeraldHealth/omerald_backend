const mongoose = require('mongoose');

const analysedParams = {
    name: {type:String},
    value: {type: String},
    unit:{type:String},
    range: {type:String}
}

const AnalysedParams = mongoose.model('parsedparams', analysedParams);

module.exports = AnalysedParams;
