const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    isAdmin: { type: Boolean, default: false },
    userId: { type: mongoose.Types.ObjectId, required: true },
    heading: {type:String},
    message: {type:String},
    tags: [{type:String}]
});

module.exports = mongoose.model("alerts",alertSchema,"alert");