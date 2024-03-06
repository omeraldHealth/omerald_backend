const mongoose = require('mongoose');

const params = {
    name: {type:String},
    value: {type: String},
    unit:{type:String},
    range: {type:String}
}

const analysedParams = new mongoose.Schema({
    file: { type: String },
    parsedData: [params]
});

const AnalysedParams = mongoose.model('parsedparams', analysedParams);

module.exports = AnalysedParams;
