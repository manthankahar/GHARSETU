const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        partner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        photo: {
            type: String,
            default: null
        },

        video: {
            type: String,
            default: null
        },

        status: {
            type: String,
            enum: [
                "pending",
                "in_progress",
                "resolved"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Complaint",
    complaintSchema
);