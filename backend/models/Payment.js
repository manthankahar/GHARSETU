const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        paymentId: {
            type: String,
            unique: true,
            trim: true
        },

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMethod: {
            type: String,
            enum: [
                "upi",
                "card",
                "netbanking",
                "wallet",
                "cod"
            ],
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "successful",
                "failed",
                "refunded"
            ],
            default: "pending"
        },

        transactionId: {
            type: String,
            trim: true,
            default: null
        },

        transactionReference: {
            type: String,
            trim: true,
            default: null
        },

        gateway: {
            type: String,
            trim: true,
            default: null
        },

        failureReason: {
            type: String,
            trim: true,
            default: null
        },

        refundAmount: {
            type: Number,
            min: 0,
            default: 0
        },

        refundReason: {
            type: String,
            trim: true,
            default: null
        },

        paidAt: {
            type: Date,
            default: null
        },

        refundedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);


/* =========================================
   AUTO GENERATE PAYMENT ID
========================================= */

paymentSchema.pre("save", async function(next) {

    if (this.paymentId) {
        return next();
    }

    try {

        const count = await mongoose.model("Payment").countDocuments();

        this.paymentId =
            "PAY-" +
            String(count + 1).padStart(6, "0");

        next();

    } catch (error) {

        next(error);

    }

});


/* =========================================
   INDEXES
========================================= */

paymentSchema.index({
    order: 1
});

paymentSchema.index({
    customer: 1
});

paymentSchema.index({
    status: 1
});

paymentSchema.index({
    paymentMethod: 1
});

paymentSchema.index({
    createdAt: -1
});


module.exports = mongoose.model("Payment", paymentSchema);