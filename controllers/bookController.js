const Book = require("../models/Book");

// Get all books
const getBooks = async (req, res) => {
    try {
        const books = await Book.find();

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Get one book
const getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Add book - ADMIN
const addBook = async (req, res) => {
    try {
        const {
            title,
            author,
            category,
            quantity
        } = req.body;

        if (!title || !author || !category || quantity === undefined) {
            return res.status(400).json({
                message: "Title, author, category and quantity are required"
            });
        }

        const book = await Book.create({
            title,
            author,
            category,
            quantity,
            availableQuantity: quantity
        });

        res.status(201).json({
            message: "Book added successfully",
            book
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Update book - ADMIN
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        const {
            title,
            author,
            category,
            quantity
        } = req.body;

        book.title = title || book.title;
        book.author = author || book.author;
        book.category = category || book.category;

        if (quantity !== undefined) {
            const borrowedCopies =
                book.quantity - book.availableQuantity;

            if (quantity < borrowedCopies) {
                return res.status(400).json({
                    message: "Quantity cannot be less than currently borrowed copies"
                });
            }

            book.quantity = quantity;
            book.availableQuantity = quantity - borrowedCopies;
        }

        await book.save();

        res.status(200).json({
            message: "Book updated successfully",
            book
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Delete book - ADMIN
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getBooks,
    getBook,
    addBook,
    updateBook,
    deleteBook
};