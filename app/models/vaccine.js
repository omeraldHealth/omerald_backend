const mongoose = require('mongoose');

const vaccine = new mongoose.Schema({
    name: { type: String, required: true },
});

mongoose.models = {};

const VaccinesModel = mongoose.model('vaccines', vaccine);
module.exports = VaccinesModel;
