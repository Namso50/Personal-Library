/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const idToDelete = "64da99290f0f72172f5e8380"
const idToGet = '64da99010f0f72172f5e837b'

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', async () => {
        chai.request(server)
          .keepOpen()
          .post('/api/books')
          .send({title: "with title"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'a book should contain title');
            assert.property(res.body, '_id', 'a book should contain _id');    
          });
      });
      
      test('Test POST /api/books with no title given', async () => {
        chai.request(server)
          .keepOpen()
          .post('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field title')
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books', async () => {
        chai.request(server)
          .keepOpen()
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  async () => {
        chai.request(server)
          .keepOpen()
          .get('/api/books/3214')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  async () => {
        chai.request(server)
          .keepOpen()
          .get(`/api/books/${idToGet}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'commentcount', 'a book should contain commentcount');
            assert.property(res.body, 'title', 'a book should contain title');
            assert.property(res.body, '_id', 'a book should contain _id'); 
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', async () => {
        chai.request(server)
          .keepOpen()
          .post(`/api/books/${idToGet}`)
          .send({comment: "test comment"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'commentcount', 'a book should contain commentcount');
            assert.property(res.body, 'title', 'a book should contain title');
            assert.property(res.body, '_id', 'a book should contain _id');
            assert.include(res.body.comments, 'test comment', "comment not found") 
          });
      });

      test('Test POST /api/books/[id] without comment field', async () => {
        chai.request(server)
          .keepOpen()
          .post(`/api/books/${idToGet}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field comment') 
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', async () => {
        chai.request(server)
          .keepOpen()
          .post(`/api/books/${idToGet}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists') 
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', async () => {
        chai.request(server)
          .keepOpen()
          .delete(`/api/books/${idToDelete}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful') 
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', async () => {
        chai.request(server)
          .keepOpen()
          .delete(`/api/books/35434`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists') 
          });
      });

    });

  });
  
});
