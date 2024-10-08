const express = require('express');
const router = express.Router();
const { addBook, getAllBooks, getBookById, updateBook, deleteBook } = require('../controllers/book')
const authentication = require('../middlewares/auth');

router.post('/add', authentication, addBook);
router.get('/all', getAllBooks);
router.get('/:id', getBookById);
router.put('/update/:id', authentication, updateBook);
router.delete('/delete/:id', authentication, deleteBook);

module.exports = router;