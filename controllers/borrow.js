const Borrow = require('../models/borrow');
const User = require('../models/user');
const Book = require('../models/book');


const borrowBook = async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        if (!(userId && bookId)) {
            return res.status(400).json({ status: false, message: "All fields are required" })
        }
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ status: false, message: "User not found" })
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ status: false, message: "Book not found" })
        const obj = {
            userId,
            bookId,
            // title:book.title,
            // author:book.author,
            // genre:book.genre,
            // ISBN:book.ISBN,

            borrowDate: new Date().toISOString(),
        }
        await Borrow.create(obj);
        return res.status(201).json({ status: true, message: "Book borrow successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

const getBorrowBook = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming userId is set from the authentication middleware

        // Fetch only the borrowed books by the authenticated user
        const borrow = await Borrow.find({ userId }).populate('userId').populate('bookId');

        if (!borrow || borrow.length === 0) {
            return res.status(404).json({ status: false, message: "No borrowed books found for this user" });
        }

        // Sanitize the borrow data by removing sensitive fields
        const sanitizedBorrow = borrow.map(b => {
            const borrowObj = b.toObject(); // Convert Mongoose document to plain object
            if (borrowObj.userId && borrowObj.userId.password) {
                delete borrowObj.userId.password; // Remove password from user object
            }
            return borrowObj;
        });

        return res.status(200).json({ status: true, message: "Borrowed books retrieved successfully", data: sanitizedBorrow });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};



const returnBook = async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        if (!(userId && bookId)) {
            return res.status(400).json({ message: 'UserID, BookID are required' });
        }
        // Find the borrow record where the user hasn't returned the book (returnDate is null)
        const borrow = await Borrow.findOne({ userId, bookId, returnDate: null });
        if (!borrow) {
            return res.status(404).json({ status: false, message: 'Borrow record not found or book already returned' });
        }

        // Set the return date
        borrow.returnDate = new Date().toISOString();
        await borrow.save();

        return res.status(200).json({ status: true, message: "Book returned successfully", data: borrow });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

module.exports = { borrowBook, getBorrowBook, returnBook }


