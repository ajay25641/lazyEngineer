const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true }
});

module.exports = mongoose.model("getToken",tokenSchema,"token");