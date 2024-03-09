const mongoose = require('mongoose');

const vaccine = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    deletedAt: { type: Date, default: null },
});

mongoose.models = {};

const VaccinesModel = mongoose.model('vaccines', vaccine);
module.exports = VaccinesModel;
