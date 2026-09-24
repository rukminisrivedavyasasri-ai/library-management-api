const Borrow = require("../models/Borrow");
const Book = require("../models/Book");

// USER - Request a book
const requestBook = async (req, res) => {
    try {
        const { bookId } = req.body;

        if (!bookId) {
            return res.status(400).json({
                message: "Book ID is required"
            });
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        if (book.availableQuantity <= 0) {
            return res.status(400).json({
                message: "Book is currently unavailable"
            });
        }

        const existingRequest = await Borrow.findOne({
            user: req.user.id,
            book: bookId,
            status: { $in: ["PENDING", "APPROVED"] }
        });

        if (existingRequest) {
            return res.status(409).json({
                message: "You already have an active request for this book"
            });
        }

        const borrow = await Borrow.create({
            user: req.user.id,
            book: bookId
        });

        res.status(201).json({
            message: "Book request created successfully",
            borrow
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// USER - View own borrowing records
const getMyBorrows = async (req, res) => {
    try {
        const borrows = await Borrow.find({
            user: req.user.id
        })
        .populate("book", "title author category")
        .sort({ createdAt: -1 });

        res.status(200).json(borrows);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ADMIN - View all borrowing records
const getAllBorrows = async (req, res) => {
    try {
        const borrows = await Borrow.find()
            .populate("user", "name email role")
            .populate("book", "title author category")
            .sort({ createdAt: -1 });

        res.status(200).json(borrows);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ADMIN - Approve request
const approveBorrow = async (req, res) => {
    try {
        const borrow = await Borrow.findById(req.params.id);

        if (!borrow) {
            return res.status(404).json({
                message: "Borrow request not found"
            });
        }

        if (borrow.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending requests can be approved"
            });
        }

        const book = await Book.findById(borrow.book);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        if (book.availableQuantity <= 0) {
            return res.status(400).json({
                message: "Book is no longer available"
            });
        }

        book.availableQuantity -= 1;
        await book.save();

        borrow.status = "APPROVED";
        borrow.approvedAt = new Date();
        await borrow.save();

        res.status(200).json({
            message: "Borrow request approved",
            borrow
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ADMIN - Reject request
const rejectBorrow = async (req, res) => {
    try {
        const borrow = await Borrow.findById(req.params.id);

        if (!borrow) {
            return res.status(404).json({
                message: "Borrow request not found"
            });
        }

        if (borrow.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending requests can be rejected"
            });
        }

        borrow.status = "REJECTED";
        await borrow.save();

        res.status(200).json({
            message: "Borrow request rejected",
            borrow
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ADMIN - Mark book as returned
const returnBook = async (req, res) => {
    try {
        const borrow = await Borrow.findById(req.params.id);

        if (!borrow) {
            return res.status(404).json({
                message: "Borrow record not found"
            });
        }

        if (borrow.status !== "APPROVED") {
            return res.status(400).json({
                message: "Only approved books can be returned"
            });
        }

        const book = await Book.findById(borrow.book);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        book.availableQuantity += 1;

        if (book.availableQuantity > book.quantity) {
            book.availableQuantity = book.quantity;
        }

        await book.save();

        borrow.status = "RETURNED";
        borrow.returnedAt = new Date();
        await borrow.save();

        res.status(200).json({
            message: "Book marked as returned",
            borrow
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    requestBook,
    getMyBorrows,
    getAllBorrows,
    approveBorrow,
    rejectBorrow,
    returnBook
};