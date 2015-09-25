var express = require('express');
var routes = function(Book) {
  var bookRouter = express.Router();
  var booksController = require('../controllers/booksController')(Book);
  bookRouter.route('/')
    .post(booksController.post)
    .get(booksController.get);


  bookRouter.use('/:bookId', function(req, res, next) {
    Book.findById(req.params.bookId, function(err, book) {
      if(err)
        res.status(500).send(err);
      else if (book) {
        req.book = book;
        next();
      } else {
        res.status(404).send("No Book Found")
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
      book.save(function(err) {
        if(err)
          res.status(500).send(err)
        else
          res.json(book);
      });
    })
    .patch(function(req, res) {
      var book = req.book;
      if(req.body._id)
        delete req.body._id;
      for(var prop in req.body) {
        book[prop] = req.body[prop];
      }
      book.save(function(err) {
        if(err)
          res.status(500).send(err)
        else
          res.json(book);
      });
    })
    .delete(function(req, res) {
      req.book.remove(function(err) {
        if(err)
          res.status(500).send(err)
        else
          res.status(204).send("Book Deleted");
      })
    });

  return bookRouter;
};

module.exports = routes;
