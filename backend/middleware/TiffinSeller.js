const mongoose = require("mongoose");

const tiffinSellerSchema = new mongoose.Schema(
    {

        // =========================
        // SELLER BASIC DETAILS
        // =========================

        mobile: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        tiffinCompanyName: {
            type: String,
            required: true,
            trim: true
        },

        address: {
            type: String,
            required: true,
            trim: true
        },


        // =========================
        // REGISTRATION STATUS
        // =========================

        status: {
            type: String,

            enum: [
                "pending",
                "approved",
                "rejected"
            ],

            default: "pending"
        },


        // =========================
        // APPROVAL DETAILS
        // =========================

        approvedAt: {
            type: Date,
            default: null
        },

        rejectedAt: {
            type: Date,
            default: null
        },

        rejectionReason: {
            type: String,
            default: ""
        }

    },

    {
        timestamps: true
    }
);


module.exports = mongoose.model(
    "TiffinSeller",
    tiffinSellerSchema
);