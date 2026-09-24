const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },

        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED", "RETURNED"],
            default: "PENDING"
        },

        requestedAt: {
            type: Date,
            default: Date.now
        },

        approvedAt: {
            type: Date
        },

        returnedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Borrow", borrowSchema);