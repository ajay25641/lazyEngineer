const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const { PATH } = require('./CommonLib/constant');
const alertRoute = require('./Routes/alert.route');
const authRoute = require('./Routes/auth.route');


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send('welcome to new');
});

app.use(PATH.ALERT, alertRoute);
app.use(PATH.AUTH, authRoute);


module.exports = app;