const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
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
        // RESTAURANT
        // ==========================================

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            default: null,
            index: true
        },

        // ==========================================
        // ORDER ITEMS
        // ==========================================

        items: [
            {
                // New restaurant menu item
                menuItem: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "MenuItem",
                    default: null
                },

                // Old tiffin support
                tiffinId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Tiffin",
                    default: null
                },

                name: {
                    type: String,
                    required: true,
                    trim: true
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                // Food type
                foodType: {
                    type: String,
                    enum: [
                        "veg",
                        "non-veg",
                        "egg"
                    ],
                    default: "veg"
                },

                // Item total
                itemTotal: {
                    type: Number,
                    default: 0,
                    min: 0
                }
            }
        ],

        // ==========================================
        // DELIVERY DETAILS
        // ==========================================

        deliveryDetails: {
            name: {
                type: String,
                required: true,
                trim: true
            },

            mobile: {
                type: String,
                required: true,
                trim: true
            },

            address: {
                type: String,
                required: true,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true
            },

            pincode: {
                type: String,
                required: true,
                trim: true
            }
        },

        // ==========================================
        // PAYMENT
        // ==========================================

        paymentMethod: {
            type: String,
            enum: [
                "cod",
                "online",
                "upi",
                "card"
            ],
            default: "cod"
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
        // PRICE DETAILS
        // ==========================================

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        deliveryCharge: {
            type: Number,
            default: 20,
            min: 0
        },

        platformFee: {
            type: Number,
            default: 0,
            min: 0
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        // ==========================================
        // ORDER STATUS
        // ==========================================

        status: {
            type: String,
            enum: [
                "placed",
                "confirmed",
                "preparing",
                "ready",
                "out_for_delivery",
                "delivered",
                "cancelled"
            ],
            default: "placed",
            index: true
        },

        // ==========================================
        // RESTAURANT ORDER LINK
        // ==========================================

        restaurantOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RestaurantOrder",
            default: null
        },

        // ==========================================
        // DELIVERY LINK
        // ==========================================

        delivery: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Delivery",
            default: null
        },

        deliveryPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        // ==========================================
        // CUSTOMER / RESTAURANT NOTES
        // ==========================================

        customerNote: {
            type: String,
            default: "",
            trim: true
        },

        restaurantNote: {
            type: String,
            default: "",
            trim: true
        },

        // ==========================================
        // CANCELLATION
        // ==========================================

        cancellationReason: {
            type: String,
            default: "",
            trim: true
        },

        cancelledAt: {
            type: Date,
            default: null
        },

        // ==========================================
        // ORDER TIMELINE
        // ==========================================

        confirmedAt: {
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

        outForDeliveryAt: {
            type: Date,
            default: null
        },

        deliveredAt: {
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

orderSchema.index({
    customer: 1,
    createdAt: -1
});

orderSchema.index({
    restaurant: 1,
    createdAt: -1
});

orderSchema.index({
    restaurant: 1,
    status: 1
});


// ==========================================
// AUTO CALCULATE ITEM TOTAL
// ==========================================

orderSchema.pre(
    "save",
    function (next) {

        if (this.items && this.items.length > 0) {

            this.items.forEach(item => {

                item.itemTotal =
                    Number(item.price || 0) *
                    Number(item.quantity || 1);

            });

        }

        next();
    }
);


// ==========================================
// EXPORT
// ==========================================

module.exports =
    mongoose.model(
        "Order",
        orderSchema
    );