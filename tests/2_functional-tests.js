/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { faker } = require("@faker-js/faker");

let deleteBookId;

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          const data = { title: faker.random.words() };
          chai
            .request(server)
            .post("/api/books")
            .send(data)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.property(
                res.body,
                "_id",
                "Book object should contain _id"
              );
              assert.property(
                res.body,
                "title",
                "Book object should contain name"
              );
              assert.equal(
                res.body.title,
                data.title,
                "Book object name should equal input name"
              );
              // get book ID to delete later
              deleteBookId = res.body._id;
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(
                res.body,
                "missing required field title",
                "should report error if no title given"
              );
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/invalid-id")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(
              res.body,
              "no book exists",
              "should report no book exists"
            );
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get("/api/books/" + deleteBookId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, "_id", "Book should contain _id");
            assert.property(res.body, "title", "Book should contain title");
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          const data = {
            comment: faker.random.words(5),
          };
          chai
            .request(server)
            .post("/api/books/" + deleteBookId)
            .send(data)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              const lastComment = res.body.comments.length - 1;
              assert.equal(
                res.body.comments[lastComment],
                data.comment,
                "last comment added should be the submitted one"
              );
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          const data = {
            comment: "",
          };
          chai
            .request(server)
            .post("/api/books/" + deleteBookId)
            .send(data)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(
                res.body,
                "missing required field comment",
                "should report comment field is missing"
              );
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          const data = {
            comment: faker.random.words(5),
          };
          chai
            .request(server)
            .post("/api/books/fake-id")
            .send(data)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(
                res.body,
                "no book exists",
                "should report no book exists"
              );
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/" + deleteBookId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(
              res.body,
              "delete successful",
              "should report successful deletion"
            );
            done();
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/thisisnotavalidid")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(
              res.body,
              "no book exists",
              "should report error if no valid id"
            );
            done();
          });
      });
    });
  });
});
