var express = require('express');
var routes = function(Book) {
  var bookRouter = express.Router();
  bookRouter.route('/')
    .post(function(req, res) {
      var book = new Book(req.body);

      book.save();
      res.status(201).send(book);
    })
    .get(function(req, res) {
      var query = {};
      if (req.query.genre) {
        query.genre = req.query.genre;
      }
      Book.find(query, function(err, books) {
        if(err)
          res.status(500).send(err);
        else
          res.json(books);
      });
    });


  bookRouter.use('/:bookId', function(req, res, next) {
    Book.findById(req.params.bookId, function(err, book) {
      if(err)
        res.status(500).send(err);
      else if (book) {
        req.book = book;
        next();
      } else {
        req.status(404).send("No Book Found")
      }
    });
  });
  bookRouter.route('/:bookId')
    .get(function(req, res) {
      res.json(req.book);
    })
    .put(function(req, res) {
      var book = req.book;
      book.title = req.body.title;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.read = req.body.read;
      book.save();
      res.json(book);
    })
    .patch(function(req, res) {
      var book = req.book;
      if(req.body.title != undefined)
        book.title = req.body.title;
      if(req.body.author != undefined)
        book.author = req.body.author;
      if(req.body.genre != undefined)
        book.genre = req.body.genre;
      if(req.body.read != undefined)
        book.read = req.body.read;
      book.save();
      res.json(book);
    });

  return bookRouter;
};

module.exports = routes;
