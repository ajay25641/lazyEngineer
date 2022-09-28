const express = require("express");
const mongoose = require("mongoose");
const apps = require("./main.route");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 9110;
const host = "0.0.0.0";

//const dbUrl=process.env.MONGO_URL;
const dbUrl="mongodb+srv://developer_ajk:ajay%4012345@cluster0.c65dz.mongodb.net/lazyEngineer?retryWrites=true&w=majority";
mongoose
  .connect(dbUrl, { useNewUrlParser: true })
  .then((res) => {
    apps.listen(PORT, host, () => {
      console.log(`Server is running on ${host}:${PORT} `);
    });
  })
  .catch((err) => console.log(err));