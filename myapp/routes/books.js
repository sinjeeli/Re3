const express = require('express');
const router = express.Router();
const { Book } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.render('index', { books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/new', (req, res, next) => {
  res.render('new-book', { errors: null });
});
//
// GET /books/:id - Show book detail form
router.get('/:id', async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);

    if (!book) {
      // If the book with the provided id is not found, handle the error accordingly
      return res.status(404).render('error', { message: 'Book not found.' });
    }

    res.render('update-book', { book }); // Pass the book data to the Pug template
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
//
// POST /books/:id/update - Updates a book in the database
router.post('/:id/update', async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const { title, author, genre, year } = req.body;

    // Find the book to be updated in the database
    const book = await Book.findByPk(bookId);

    if (!book) {
      // If the book with the provided id is not found, handle the error accordingly
      return res.status(404).render('error', { message: 'Book not found.' });
    }

    // Update the book's details
    book.title = title;
    book.author = author;
    book.genre = genre;
    book.year = year;

    // Save the updated book to the database
    await book.save();

    // Redirect to the book detail page after the update is successful
    res.redirect('/books');
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /books/:id/delete - Deletes a book from the database
router.post('/:id/delete', async (req, res, next) => {
  try {
    const bookId = req.params.id;

    // Find the book to be deleted in the database
    const book = await Book.findByPk(bookId);

    if (!book) {
      // If the book with the provided id is not found, handle the error accordingly
      return res.status(404).render('error', { message: 'Book not found.' });
    }

    // Delete the book from the database
    await book.destroy();

    // Redirect to the books listing page after the deletion is successful
    res.redirect('/books');
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
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

//




module.exports = router;