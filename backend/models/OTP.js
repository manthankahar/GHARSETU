const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        identifier: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        otp: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: ["email", "mobile"],
            required: true
        },

        purpose: {
            type: String,
            enum: [
                "restaurant_signup",
                "tiffin_seller_signup"
            ],
            required: true
        },

        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);


// Automatically remove expired OTP documents
otpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);


module.exports = mongoose.model(
    "OTP",
    otpSchema
);