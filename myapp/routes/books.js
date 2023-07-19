// routes/books.js
const express = require('express');
const router = express.Router();
const { Book } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.render('layout', { books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/new', (req, res, next) => {
  res.render('new-book', { error: null });
});

// POST /books/new - Posts a new book to the database
router.post('/new', async (req, res, next) => {
  try {
    const { title, author, genre, year } = req.body;

    // Check if any required field is missing
    if (!title || !author || !genre || !year) {
      // If any required field is missing, render the new-book.pug template with an error message
      return res.render('new-book', { error: 'All fields are required.' });
    }

    // Create the new book in the database
    await Book.create({
      title,
      author,
      genre,
      year,
    });

    // Redirect to /books route after successful creation
    res.redirect('/books');
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      // If the error is a Sequelize validation error, render the form with error message(s) and data of invalid new book
      const book = await Book.build(req.body);
      return res.render("form-error", {
        title: "Create New Book",
        book,
        errors: err.errors,
      });
    } else {
      // Throw other errors that will be caught in the error handling middleware
      return next(err);
    }
  }
});

module.exports = router;
