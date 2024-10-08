const Book = require('../models/book');
const User = require('../models/user');

const addBook = async (req, res) => {
    try {
        const { title, author, ISBN, genre, price } = req.body;
        if (!(title && author && ISBN && genre && price)) {
            return res.status(400).send({ status: false, message: "Please fill in all fields." });
        }
        if (req.user.userId !== author) {
            return res.status(403).json({ message: 'Access denied: Unauthorized to access this user\'s data' });
        }
        const checkUser = await User.findOne({ _id: author })
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "Author not found" })
        } else if (checkUser.userType !== 'author') {
            return res.status(401).json({ status: false, message: "You are not a author" })
        }
        const checkISBN = await Book.findOne({ ISBN });
        if (checkISBN) {
            return res.status(400).json({ status: false, message: "Duplicate ISBN not allowed" })
        }
        const obj = {
            title,
            author,
            authorName: checkUser.name,
            ISBN,
            genre,
            price,
            publish_year: new Date().toISOString(),
        }

        await Book.create(obj);
        return res.status(201).json({ status: true, message: "Book added successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

const getAllBooks = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;
        const queryParams = req.query;
        let filterQuery = { ...queryParams };
        const totalCount = await Book.countDocuments(filterQuery);
        const checkBooks = await Book.find(queryParams).limit(perPage).skip(skip)
        if (!checkBooks) {
            return res.status(400).json({ status: false, message: "Not have any books" })
        }
        return res.status(200).json({
            status: true,
            message: "All Books",
            data: checkBooks,
            pagination: {
                totalBooks: totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / perPage),
            },
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

const getBookById = async (req, res) => {
    try {
        const id = req.params.id;
        const findBook = await Book.findById({ _id: id });
        if (!findBook) {
            return res.status(404).json({ status: false, message: "Book not found" })
        }
        return res.status(200).json({ status: true, message: "Get Book by id", data: findBook })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

const updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const { title, genre } = req.body
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ status: false, message: "Book not found" });
        }
        if (req.user.userId !== String(book.author) || req.user.userId !== String(book.author)) {
            return res.status(403).json({ message: 'Access denied: Only the user who added the book and is the author can update this book' });
        }

        book.title = title || book.title;
        book.genre = genre || book.genre;

        await book.save();

        return res.status(200).json({ status: true, message: "Book details updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

const deleteBook = async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Book.findById({ _id: id });

        if (!book) {
            return res.status(404).json({ status: false, message: "Book not found or already deleted" });
        }

        // Check if the current user is the one who added
        if (req.user.userId !== String(book.author)) {
            return res.status(403).json({ message: 'Access denied: Only the user who added the book can delete it' });
        }
        await book.deleteOne();

        return res.status(200).json({ status: true, message: "Book deleted successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}
module.exports = { addBook, getAllBooks, getBookById, updateBook, deleteBook }