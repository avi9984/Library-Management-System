const express = require('express');
const router = express.Router();
const { borrowBook, getBorrowBook, returnBook } = require('../controllers/borrow');
const authentication = require('../middlewares/auth');

router.post('/book', authentication, borrowBook);
router.get('/getBook', authentication, getBorrowBook)
router.post('/return-book', authentication, returnBook);




module.exports = router;