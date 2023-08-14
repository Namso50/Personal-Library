/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

require('dotenv').config()
const mongoose = require('mongoose')
const Book = require("./Book")

mongoose.connect(process.env.MONGO_URI)

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let books = await Book.find()
      res.json(books)
    })

    .post(async (req, res) =>{
      let title = req.body.title;
      //response will contain  new book object including atleast _id and title
      if (!title) {
        res.send('missing required field title')
        return
      }
      let book = await Book.create({title})
      res.json({_id: book._id, title : book.title})
    })
      
    .delete(async (req, res) => {
  //if successful response will be 'complete delete successful'
      await Book.deleteMany()
      res.send('complete delete successful')
    }); 



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res ormat: {"_ id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        let book = await Book.findById(bookid)
        if (!book) {
          res.send('no book exists')
          return
        }
        res.json(book)
      } catch {
        res.send('no book exists')
      }      
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        res.send('missing required field comment')
        return
      }

      try {
        let book = await Book.findById(bookid);
        book.commentcount++;
        book.comments.push(comment);
        await book.save();
        res.json(book)
      } catch {
        res.send('no book exists')
      }      
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response  will be 'delete successful'
      try {
        let k = await Book.findByIdAndDelete(bookid)
        if (!k) {
          res.send('no book exists')
          return
        }
        res.send('delete successful')
      } catch {
        res.send('no book exists')
      }
    });
  
};
