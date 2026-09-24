const express = require("express");

const {
    requestBook,
    getMyBorrows,
    getAllBorrows,
    approveBorrow,
    rejectBorrow,
    returnBook
} = require("../controllers/borrowController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// USER
router.post("/", protect, requestBook);
router.get("/my", protect, getMyBorrows);

// ADMIN
router.get("/", protect, adminOnly, getAllBorrows);
router.patch("/:id/approve", protect, adminOnly, approveBorrow);
router.patch("/:id/reject", protect, adminOnly, rejectBorrow);
router.patch("/:id/return", protect, adminOnly, returnBook);

module.exports = router;