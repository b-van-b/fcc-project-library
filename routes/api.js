/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const callback = (res) => {
  return (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  };
};

module.exports = function (app, models) {
  // get Book model from database
  const Book = models.Book;

  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.getCollectionSummary(callback(res));
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      Book.addOne(title, callback(res));
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.delAll(callback(res));
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.getOne(bookid, callback(res));
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      Book.addComment(bookid, comment, callback(res));
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.delOne(bookid, callback(res));
    });
};
