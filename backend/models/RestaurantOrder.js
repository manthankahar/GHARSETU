const mongoose = require("mongoose");

const restaurantOrderSchema = new mongoose.Schema(
    {
        // ==========================================
        // ORIGINAL CUSTOMER ORDER
        // ==========================================

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true,
            index: true
        },

        // ==========================================
        // RESTAURANT
        // ==========================================

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
            index: true
        },

        // ==========================================
        // CUSTOMER
        // ==========================================

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // ==========================================
        // ORDER STATUS
        // ==========================================

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "preparing",
                "ready",
                "picked_up",
                "delivered",
                "cancelled"
            ],
            default: "pending",
            index: true
        },

        // ==========================================
        // AMOUNT DETAILS
        // ==========================================

        subtotal: {
            type: Number,
            default: 0,
            min: 0
        },

        platformFee: {
            type: Number,
            default: 0,
            min: 0
        },

        deliveryFee: {
            type: Number,
            default: 0,
            min: 0
        },

        restaurantEarning: {
            type: Number,
            default: 0,
            min: 0
        },

        restaurantProfit: {
            type: Number,
            default: 0
        },

        foodCost: {
            type: Number,
            default: 0,
            min: 0
        },

        // ==========================================
        // PAYMENT
        // ==========================================

        paymentMethod: {
            type: String,
            enum: [
                "cash",
                "online",
                "upi",
                "card"
            ],
            default: "online"
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded"
            ],
            default: "pending"
        },

        // ==========================================
        // RIDER / DELIVERY
        // ==========================================

        deliveryPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        delivery: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Delivery",
            default: null
        },

        // ==========================================
        // CUSTOMER DELIVERY INFORMATION
        // ==========================================

        deliveryDetails: {
            name: {
                type: String,
                default: ""
            },

            mobile: {
                type: String,
                default: ""
            },

            address: {
                type: String,
                default: ""
            },

            city: {
                type: String,
                default: ""
            },

            pincode: {
                type: String,
                default: ""
            }
        },

        // ==========================================
        // RESTAURANT ORDER NOTES
        // ==========================================

        restaurantNote: {
            type: String,
            default: ""
        },

        customerNote: {
            type: String,
            default: ""
        },

        // ==========================================
        // CANCELLATION
        // ==========================================

        cancellationReason: {
            type: String,
            default: ""
        },

        cancelledAt: {
            type: Date,
            default: null
        },

        // ==========================================
        // ORDER TIMELINE
        // ==========================================

        acceptedAt: {
            type: Date,
            default: null
        },

        preparingAt: {
            type: Date,
            default: null
        },

        readyAt: {
            type: Date,
            default: null
        },

        pickedUpAt: {
            type: Date,
            default: null
        },

        deliveredAt: {
            type: Date,
            default: null
        },

        // ==========================================
        // PRINT / STICKER
        // ==========================================

        printStatus: {
            type: String,
            enum: [
                "not_printed",
                "printed"
            ],
            default: "not_printed"
        },

        printedAt: {
            type: Date,
            default: null
        },

        stickerStatus: {
            type: String,
            enum: [
                "not_printed",
                "printed"
            ],
            default: "not_printed"
        },

        stickerPrintedAt: {
            type: Date,
            default: null
        }
    },

    {
        timestamps: true
    }
);


// ==========================================
// INDEXES
// ==========================================

restaurantOrderSchema.index({
    restaurant: 1,
    status: 1
});

restaurantOrderSchema.index({
    restaurant: 1,
    createdAt: -1
});

restaurantOrderSchema.index({
    customer: 1,
    createdAt: -1
});


// ==========================================
// EXPORT
// ==========================================

module.exports =
    mongoose.model(
        "RestaurantOrder",
        restaurantOrderSchema
    );