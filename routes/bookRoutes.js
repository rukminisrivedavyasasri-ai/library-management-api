const express = require("express");

const {
    getBooks,
    getBook,
    addBook,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public - anyone can browse
router.get("/", getBooks);
router.get("/:id", getBook);

// Admin only
router.post("/", protect, adminOnly, addBook);
router.put("/:id", protect, adminOnly, updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

module.exports = router;