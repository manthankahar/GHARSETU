const mongoose = require("mongoose");

// ======================================================
// TIFFIN SELLER COMPLAINT SCHEMA
// ======================================================

const tiffinComplaintSchema = new mongoose.Schema(
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

            default: null

        },


        // ==================================================
        // ORDER
        // ==================================================

        order: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "TiffinOrder",

            default: null

        },


        // ==================================================
        // SUBJECT
        // ==================================================

        subject: {

            type: String,

            required: true,

            trim: true

        },


        // ==================================================
        // DESCRIPTION
        // ==================================================

        description: {

            type: String,

            required: true,

            trim: true

        },


        // ==================================================
        // MEDIA
        // ==================================================

        media: {

            type: String,

            default: ""

        },


        // ==================================================
        // STATUS
        // ==================================================

        status: {

            type: String,

            enum: [
                "pending",
                "in_progress",
                "resolved",
                "escalated",
                "rejected"
            ],

            default: "pending"

        },


        // ==================================================
        // PRIORITY
        // ==================================================

        priority: {

            type: String,

            enum: [
                "low",
                "medium",
                "high"
            ],

            default: "medium"

        },


        // ==================================================
        // RESPONSE
        // ==================================================

        response: {

            type: String,

            default: ""

        },


        // ==================================================
        // RESOLVED DATE
        // ==================================================

        resolvedAt: {

            type: Date,

            default: null

        },


        // ==================================================
        // ESCALATED DATE
        // ==================================================

        escalatedAt: {

            type: Date,

            default: null

        }

    },

    {

        timestamps: true

    }
);


// ======================================================
// INDEXES
// ======================================================

tiffinComplaintSchema.index({

    seller: 1,

    status: 1,

    createdAt: -1

});


// ======================================================
// MODEL
// ======================================================

const TiffinComplaint =
    mongoose.model(
        "TiffinComplaint",
        tiffinComplaintSchema
    );


// ======================================================
// EXPORT
// ======================================================

module.exports = TiffinComplaint;