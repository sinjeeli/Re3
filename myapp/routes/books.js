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
  res.render('new-book', { errors: null });
});

// POST /books/new - Posts a new book to the database
router.post('/new', async (req, res, next) => {
  try {
    const { title, author, genre, year } = req.body;

    // Check if any required field is missing
    if (!title || !author) {
      const errors = [];
      if (!title) {
        errors.push({ message: 'Title is required.' });
      }
      if (!author) {
        errors.push({ message: 'Author is required.' });
      }

      // Render the form with error message(s) and data of invalid new book
      return res.render('new-book', {
        title: 'Create New Book',
        errors: errors,
        book: { title, author, genre, year }, // Pass the form data back to the view to fill the inputs
      });
    }

    // Attempt to create the new book in the database
    const book = await Book.create({
      title,
      author,
      genre,
      year,
    });

    // Redirect to /books route
    res.redirect('/books');
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      // If the error is a Sequelize validation error, render the form with error message(s) and data of invalid new book
      const errors = err.errors.map((error) => ({ message: error.message }));
      res.render('new-book', {
        title: 'Create New Book',
        errors: errors, // Pass the validation errors
        book: { title, author, genre, year }, // Pass the form data back to the view to fill the inputs
      });
    } else {
      // Throw other errors that will be caught in the error handling middleware
      next(err);
    }
  }
});

module.exports = router;