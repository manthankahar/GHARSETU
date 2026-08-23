const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                tiffinId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Tiffin"
                },

                name: {
                    type: String,
                    required: true
                },

                price: {
                    type: Number,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],

        deliveryDetails: {
            name: {
                type: String,
                required: true
            },

            mobile: {
                type: String,
                required: true
            },

            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            pincode: {
                type: String,
                required: true
            }
        },

        paymentMethod: {
            type: String,
            enum: ["cod", "online"],
            default: "cod"
        },

        subtotal: {
            type: Number,
            required: true
        },

        deliveryCharge: {
            type: Number,
            default: 20
        },

        total: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: [
                "placed",
                "confirmed",
                "preparing",
                "out_for_delivery",
                "delivered",
                "cancelled"
            ],
            default: "placed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);