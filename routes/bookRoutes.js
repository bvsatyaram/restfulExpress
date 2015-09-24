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
