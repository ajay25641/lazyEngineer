const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    univercity: { type: String, default: null },
    timeCreated: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("users",userschema,"user");