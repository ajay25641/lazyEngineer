const express = require('express');
const app = express();
const userController = require('../Controllers/user.controller');
const middleware = require('../Middleware/middleware');

app.get('/', middleware.isValidToken, userController.getAllUser)
app.get('/:userId', middleware.isValidToken, userController.getUserById);
app.put('/:userId', middleware.isValidToken, userController.updateUser);
app.delete('/:userId', middleware.isValidToken, userController.deleteUser);
app.get('/dashboard', userController.dashboard);

module.exports = app;