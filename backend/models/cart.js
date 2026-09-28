const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        // ==========================================
        // CUSTOMER
        // ==========================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // ==========================================
        // CART ITEMS
        // ==========================================

        items: [
            {
                // ======================================
                // ITEM TYPE
                // ======================================

                itemType: {
                    type: String,
                    enum: [
                        "product",
                        "menuItem"
                    ],
                    required: true
                },

                // ======================================
                // TIFFIN / PRODUCT
                // ======================================

                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    default: null
                },

                // ======================================
                // RESTAURANT MENU ITEM
                // ======================================

                menuItem: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "MenuItem",
                    default: null
                },

                // ======================================
                // QUANTITY
                // ======================================

                quantity: {
                    type: Number,
                    default: 1,
                    min: 1
                }
            }
        ]
    },
    {
        timestamps: true
    }
);


// ==========================================
// USER + CART INDEX
// ==========================================

cartSchema.index({
    user: 1
});


// ==========================================
// EXPORT
// ==========================================

module.exports =
    mongoose.model(
        "Cart",
        cartSchema
    );