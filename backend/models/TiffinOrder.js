const mongoose = require("mongoose");

// ======================================================
// TIFFIN ORDER SCHEMA
// ======================================================

const tiffinOrderSchema = new mongoose.Schema(
    {

        // ==================================================
        // TIFFIN SELLER
        // ==================================================

        seller: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "TiffinSeller",

            required: true

        },


        // ==================================================
        // CUSTOMER
        // ==================================================

        customer: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },


        // ==================================================
        // TIFFIN PLAN
        // ==================================================

        plan: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "TiffinPlan",

            default: null

        },


        // ==================================================
        // ORDER TYPE
        // ==================================================

        orderType: {

            type: String,

            enum: [
                "single_tiffin",
                "plan"
            ],

            default: "single_tiffin"

        },


        // ==================================================
        // TIFFIN NAME
        // ==================================================

        tiffinName: {

            type: String,

            required: true,

            trim: true

        },


        // ==================================================
        // QUANTITY
        // ==================================================

        quantity: {

            type: Number,

            required: true,

            min: 1,

            default: 1

        },


        // ==================================================
        // AMOUNT
        // ==================================================

        amount: {

            type: Number,

            required: true,

            min: 0

        },


        // ==================================================
        // CUSTOMER ADDRESS
        // ==================================================

        deliveryAddress: {

            type: String,

            required: true,

            trim: true

        },


        // ==================================================
        // CUSTOMER MOBILE
        // ==================================================

        customerMobile: {

            type: String,

            default: "",

            trim: true

        },


        // ==================================================
        // ORDER STATUS
        // ==================================================

        status: {

            type: String,

            enum: [
                "new",
                "packed",
                "dispatched",
                "delivered",
                "cancelled"
            ],

            default: "new"

        },


        // ==================================================
        // PAYMENT STATUS
        // ==================================================

        paymentStatus: {

            type: String,

            enum: [
                "pending",
                "paid",
                "failed"
            ],

            default: "pending"

        },


        // ==================================================
        // PAYMENT METHOD
        // ==================================================

        paymentMethod: {

            type: String,

            enum: [
                "cash",
                "online"
            ],

            default: "online"

        },


        // ==================================================
        // ORDER DATE
        // ==================================================

        orderDate: {

            type: Date,

            default: Date.now

        },


        // ==================================================
        // PACKED DATE
        // ==================================================

        packedAt: {

            type: Date,

            default: null

        },


        // ==================================================
        // DISPATCHED DATE
        // ==================================================

        dispatchedAt: {

            type: Date,

            default: null

        },


        // ==================================================
        // DELIVERED DATE
        // ==================================================

        deliveredAt: {

            type: Date,

            default: null

        },


        // ==================================================
        // PRINT STATUS
        // ==================================================

        isPrinted: {

            type: Boolean,

            default: false

        }

    },

    {

        timestamps: true

    }
);


// ======================================================
// INDEXES
// ======================================================

tiffinOrderSchema.index({

    seller: 1,

    status: 1,

    createdAt: -1

});


// ======================================================
// MODEL
// ======================================================

const TiffinOrder =
    mongoose.model(
        "TiffinOrder",
        tiffinOrderSchema
    );


// ======================================================
// EXPORT
// ======================================================

module.exports = TiffinOrder;