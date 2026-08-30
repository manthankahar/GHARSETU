const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
    {
        // ==========================================
        // RESTAURANT OWNER
        // ==========================================

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // ==========================================
        // BASIC RESTAURANT INFORMATION
        // ==========================================

        restaurantName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
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
            default: "",
            trim: true
        },

        pincode: {
            type: String,
            default: "",
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        // ==========================================
        // RESTAURANT CATEGORY
        // ==========================================

        cuisine: {
            type: String,
            default: "",
            trim: true
        },

        // ==========================================
        // OPENING / CLOSING TIME
        // ==========================================

        openingTime: {
            type: String,
            default: "09:00"
        },

        closingTime: {
            type: String,
            default: "23:00"
        },

        isOpen: {
            type: Boolean,
            default: true
        },

        // ==========================================
        // ONLINE ORDER
        // ==========================================

        acceptsOnlineOrders: {
            type: Boolean,
            default: true
        },

        acceptsCashOrders: {
            type: Boolean,
            default: true
        },

        // ==========================================
        // RESTAURANT APPROVAL
        // ==========================================

        approvalStatus: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected"
            ],
            default: "pending"
        },

        approvedAt: {
            type: Date,
            default: null
        },

        rejectedAt: {
            type: Date,
            default: null
        },

        rejectedReason: {
            type: String,
            default: ""
        },

        // ==========================================
        // RESTAURANT STATS
        // ==========================================

        totalOrders: {
            type: Number,
            default: 0
        },

        completedOrders: {
            type: Number,
            default: 0
        },

        cancelledOrders: {
            type: Number,
            default: 0
        },

        totalRevenue: {
            type: Number,
            default: 0
        },

        totalProfit: {
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
        // RESTAURANT STATUS
        // ==========================================

        isActive: {
            type: Boolean,
            default: true
        },

        // ==========================================
        // PRINTER / STICKER SUPPORT
        // ==========================================

        printOrders: {
            type: Boolean,
            default: false
        },

        stickerOrders: {
            type: Boolean,
            default: false
        },

        printerName: {
            type: String,
            default: ""
        },

        // ==========================================
        // LOCATION
        // ==========================================

        location: {
            lat: {
                type: Number,
                default: null
            },

            lng: {
                type: Number,
                default: null
            }
        }
    },

    {
        timestamps: true
    }
);


// ==========================================
// INDEXES
// ==========================================

restaurantSchema.index({
    owner: 1
});

restaurantSchema.index({
    approvalStatus: 1
});

restaurantSchema.index({
    restaurantName: 1
});


// ==========================================
// EXPORT
// ==========================================

module.exports =
    mongoose.model(
        "Restaurant",
        restaurantSchema
    );