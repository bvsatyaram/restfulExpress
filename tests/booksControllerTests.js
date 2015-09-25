var should = require('should'),
    sinon = require('sinon');

describe('BooksController', function() {
  describe('Post', function() {
    it('should not allow an empty title on post', function() {
      var Book = function(book) {this.save = function(){}};
      var req = {
        body: {
          author: 'BV'
        }
      };
      var res = {
        status: sinon.spy(),
        send: sinon.spy()
      };

      var booksController = require('../controllers/booksController')(Book);
      booksController.post(req, res);
      res.status.calledWith(400).should.equal(true, 'Bad Status ' + res.status.args[0][0]);
      res.send.calledWith('Title is required').should.equal(true);
    })
  });
});
