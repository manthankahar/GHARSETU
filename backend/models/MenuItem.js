const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
    {
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
        // BASIC MENU INFORMATION
        // ==========================================

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        category: {
            type: String,
            default: "Other",
            trim: true
        },

        // ==========================================
        // FOOD TYPE
        // ==========================================

        foodType: {
            type: String,
            enum: [
                "veg",
                "non-veg",
                "egg"
            ],
            default: "veg"
        },

        // ==========================================
        // PRICE
        // ==========================================

        price: {
            type: Number,
            required: true,
            min: 0
        },

        // ==========================================
        // DISCOUNT / OFFER
        // ==========================================

        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        finalPrice: {
            type: Number,
            default: 0,
            min: 0
        },

        // ==========================================
        // FOOD IMAGE
        // ==========================================

        image: {
            type: String,
            default: ""
        },

        // ==========================================
        // AVAILABILITY
        // ==========================================

        isAvailable: {
            type: Boolean,
            default: true,
            index: true
        },

        // ==========================================
        // STOCK
        // ==========================================

        stock: {
            type: Number,
            default: 0,
            min: 0
        },

        trackStock: {
            type: Boolean,
            default: false
        },

        // ==========================================
        // PREPARATION TIME
        // ==========================================

        preparationTime: {
            type: Number,
            default: 20,
            min: 1
        },

        // ==========================================
        // CUSTOMER ORDERS
        // ==========================================

        totalOrders: {
            type: Number,
            default: 0
        },

        // ==========================================
        // RATING
        // ==========================================

        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        totalReviews: {
            type: Number,
            default: 0
        },

        // ==========================================
        // MENU ITEM STATUS
        // ==========================================

        isActive: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true
    }
);


// ==========================================
// AUTO CALCULATE FINAL PRICE
// ==========================================

menuItemSchema.pre(
    "save",
    function (next) {

        const originalPrice =
            Number(this.price || 0);

        const discount =
            Number(this.discount || 0);

        const discountAmount =
            (originalPrice * discount) / 100;

        this.finalPrice =
            Math.max(
                0,
                originalPrice - discountAmount
            );

        next();
    }
);


// ==========================================
// INDEXES
// ==========================================

menuItemSchema.index({
    restaurant: 1,
    isAvailable: 1
});

menuItemSchema.index({
    restaurant: 1,
    category: 1
});

menuItemSchema.index({
    restaurant: 1,
    isActive: 1
});


// ==========================================
// EXPORT
// ==========================================

module.exports =
    mongoose.model(
        "MenuItem",
        menuItemSchema
    );