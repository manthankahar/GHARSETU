const mongoose = require("mongoose");

const tiffinSellerSchema = new mongoose.Schema(
    {
        // ==============================
        // BASIC DETAILS
        // ==============================

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


        // ==============================
        // REGISTRATION STATUS
        // ==============================

        registrationStatus: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected"
            ],
            default: "pending"
        },


        // ==============================
        // ACTIVE / INACTIVE
        // ==============================

        isActive: {
            type: Boolean,
            default: false
        },


        // ==============================
        // PROFILE
        // ==============================

        ownerName: {
            type: String,
            default: ""
        },

        email: {
            type: String,
            default: ""
        },


        // ==============================
        // BUSINESS
        // ==============================

        totalEarnings: {
            type: Number,
            default: 0
        },

        activePlans: {
            type: Number,
            default: 0
        },

        inactivePlans: {
            type: Number,
            default: 0
        },

        totalDeliveries: {
            type: Number,
            default: 0
        },


        // ==============================
        // CREATED DATE
        // ==============================

        approvedAt: {
            type: Date,
            default: null
        }
    },

    {
        timestamps: true
    }
);


// ==============================
// MODEL
// ==============================

module.exports = mongoose.model(
    "TiffinSeller",
    tiffinSellerSchema
);