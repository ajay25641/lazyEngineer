const express = require("express");
const mongoose = require("mongoose");
const apps = require("./main.route");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;
const host = "0.0.0.0";

const dbUrl=process.env.MONGO_URL;

mongoose
  .connect(dbUrl, { useNewUrlParser: true })
  .then((res) => {
    apps.listen(PORT, host, () => {
      console.log(`Server is running on ${host}:${PORT} `);
    });
  })
  .catch((err) => console.log(err));