"use strict";
require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// initiate connection to database
const connect = () => {
  console.log("Attempting to connect to database...");
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        resolve("Connected to database!");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// schemas
const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  comments: [String],
});



// exports
module.exports = { connect, models: { Book } };
