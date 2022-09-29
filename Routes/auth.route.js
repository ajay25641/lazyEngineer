const express = require('express');
const app = express();
const authController = require('../Controllers/auth.controller');

app.post('/ajay2564', authController.signUp);
app.post('/signIn', authController.signIn);
app.put('/signOut', authController.signOut);
app.get('/failed', (req, res) => {
    res.send("Some error occured while login to google");
});

module.exports = app;