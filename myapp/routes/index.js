var express = require('express');
var router = express.Router();
const { Book } = require('../models');


router.get('/', async (req, res, next) => {
  try {
    const books = await Book.findAll();
    if (books.length === 0) {
      res.json({ message: 'No books found.' });
    } else {
      console.log(books);
      res.json(books);
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
