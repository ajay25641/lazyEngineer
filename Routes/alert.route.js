const express = require('express');
const app = express();
const middleware = require('../Middleware/middleware');
const alertController = require("../Controllers/alert.controller");


app.get('/', middleware.isValidToken, alertController.getAllAlerts)
app.post('/', middleware.isValidToken,alertController.createAlert)

module.exports = app;