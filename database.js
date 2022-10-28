"use strict";
require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

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

// models
const Book = mongoose.model("Book", bookSchema);

// add functionality to models
Book.addOne = (title, done) => {
  console.log("Adding new book: " + title);
  // reject missing title
  if (!title) return done("missing required field title");
  // create and save new book
  const book = new Book({ title: title, comments: [] });
  book.save((err, data) => {
    // handle errors
    if (err) return console.log(err);
    if (!data) return console.log("save function returned no book document!");
    // return saved book document
    done(null, data);
  });
};

Book.addComment = (_id, comment, done) => {
  console.log("Adding comment to book: " + _id);
  console.log(`- Comment: "${comment}"`);
  // reject missing comment
  if (!comment) return done("missing required field comment");
  // reject invalid _id
  if (!ObjectId.isValid(_id)) return done("no book exists");
  // find and update book
  Book.findByIdAndUpdate(
    _id,
    { $push: { comments: comment } },
    { new: true },
    (err, data) => {
      if (err) return console.log(err);
      // null data indicates the book was not found
      if (!data) return done("no book exists");
      // otherwise, return the new book
      console.log("Success: " + JSON.stringify(data));
      done(null, data);
    }
  );
};

Book.getOne = (_id, done) => {
  // reject missing or invalid _id
  if (!_id) return done("missing required field id");
  if (!ObjectId.isValid(_id)) return done("no book exists");
  // find book
  console.log("Retrieving single book: " + _id);
  Book.findById(_id)
    .select({ __v: 0 })
    .exec((err, data) => {
      // handle errors
      if (err) return console.log(err);
      if (!data) return done("no book exists");
      // return book
      return done(null, data);
    });
};

Book.getCollectionSummary = (done) => {
  Book.aggregate()
    .project({
      _id: 1,
      title: 1,
      commentcount: { $size: "$comments" },
    })
    .exec((err, data) => {
      if (err) return console.log(err);
      return done(null, data);
    });
};

// exports
module.exports = { connect, models: { Book } };
