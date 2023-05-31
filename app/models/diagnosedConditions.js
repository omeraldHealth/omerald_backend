const mongoose = require('mongoose');

const diagnoseConditions = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String},
    imageUrl: { type: String },
    aliases: [{ type: String }],
    isActive: { type: Boolean, default: false },
    healthTopicLinks: [
        {
        id: Number,
        title: String,
        url: String,
        label: String,
        value: String,
        },
    ],
});

const DiagnoseConditionsModel = mongoose.model('diagnoseConditions', diagnoseConditions);

module.exports = DiagnoseConditionsModel;
