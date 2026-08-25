const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },

        partner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "rejected",
                "reached_restaurant",
                "picked_up",
                "reached_location",
                "completed"
            ],
            default: "pending"
        },

        earning: {
            type: Number,
            default: 100
        },

        currentEarning: {
            type: Number,
            default: 100
        },

        orderAmount: {
            type: Number,
            default: 0
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "online"],
            default: "online"
        },

        pickupVerification: {
            method: {
                type: String,
                enum: ["otp", "photo", null],
                default: null
            },

            otp: {
                type: String,
                default: null
            },

            photo: {
                type: String,
                default: null
            },

            verified: {
                type: Boolean,
                default: false
            }
        },

        acceptedAt: {
            type: Date,
            default: null
        },

        reachedRestaurantAt: {
            type: Date,
            default: null
        },

        pickedUpAt: {
            type: Date,
            default: null
        },

        reachedLocationAt: {
            type: Date,
            default: null
        },

        completedAt: {
            type: Date,
            default: null
        },

        cashDeducted: {
            type: Number,
            default: 0
        },

        onlineAdded: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Delivery",
    deliverySchema
);