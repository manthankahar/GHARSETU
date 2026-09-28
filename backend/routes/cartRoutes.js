const express = require("express");
const router = express.Router();

const Cart = require("../models/cart");
const Product = require("../models/Product");
const MenuItem = require("../models/MenuItem");

const authMiddleware =
    require("../middleware/authMiddleware");


// ==========================================
// HELPER: USER ID
// ==========================================

function getUserId(req) {

    return req.user._id || req.user.id;

}


// ==========================================
// HELPER: VALIDATE ITEM TYPE
// ==========================================

function isValidItemType(itemType) {

    return [
        "product",
        "menuItem"
    ].includes(itemType);

}


// ==========================================
// HELPER: GET ITEM ID
// ==========================================

function getItemId(item) {

    if (!item) {
        return null;
    }

    if (item.itemType === "menuItem") {

        return item.menuItem
            ? item.menuItem.toString()
            : null;

    }

    return item.product
        ? item.product.toString()
        : null;

}


// ==========================================
// GET CART
// ==========================================

router.get(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const userId =
                getUserId(req);


            const cart =
                await Cart.findOne({
                    user: userId
                })
                .populate("items.product")
                .populate("items.menuItem")
                .lean();


            // ======================================
            // EMPTY CART
            // ======================================

            if (!cart) {

                return res.json({

                    success: true,

                    items: [],

                    subtotal: 0,

                    total: 0

                });

            }


            let subtotal = 0;


            // ======================================
            // CLEAN / CALCULATE ITEMS
            // ======================================

            const validItems =
                cart.items
                    .filter(item => {

                        if (
                            item.itemType ===
                            "product"
                        ) {

                            return !!item.product;

                        }


                        if (
                            item.itemType ===
                            "menuItem"
                        ) {

                            return !!item.menuItem;

                        }


                        return false;

                    })
                    .map(item => {

                        let itemData = null;


                        // =================================
                        // PRODUCT
                        // =================================

                        if (
                            item.itemType ===
                            "product"
                        ) {

                            itemData =
                                item.product;

                        }


                        // =================================
                        // MENU ITEM
                        // =================================

                        if (
                            item.itemType ===
                            "menuItem"
                        ) {

                            itemData =
                                item.menuItem;

                        }


                        const price =
                            item.itemType ===
                            "menuItem"

                                ? Number(
                                    itemData.finalPrice ||
                                    itemData.price ||
                                    0
                                )

                                : Number(
                                    itemData.price ||
                                    0
                                );


                        const quantity =
                            Math.max(
                                1,
                                Number(
                                    item.quantity || 1
                                )
                            );


                        const itemTotal =
                            price * quantity;


                        subtotal +=
                            itemTotal;


                        return {

                            ...item,

                            price,

                            itemTotal

                        };

                    });


            // ======================================
            // DELIVERY
            // ======================================

            const deliveryCharge =
                validItems.length > 0
                    ? 20
                    : 0;


            const total =
                subtotal +
                deliveryCharge;


            return res.json({

                success: true,

                items:
                    validItems,

                subtotal,

                deliveryCharge,

                total

            });


        } catch (error) {

            console.error(
                "GET CART ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to load cart"

            });

        }

    }
);


// ==========================================
// ADD TO CART
// ==========================================

router.post(
    "/add",
    authMiddleware,
    async (req, res) => {

        try {

            const userId =
                getUserId(req);


            const {
                itemType,
                productId,
                menuItemId,
                quantity = 1
            } = req.body;


            // ======================================
            // VALIDATE TYPE
            // ======================================

            if (
                !itemType ||
                !isValidItemType(itemType)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Valid itemType is required"

                });

            }


            // ======================================
            // QUANTITY
            // ======================================

            const addQuantity =
                Math.max(
                    1,
                    Number(quantity) || 1
                );


            let itemId = null;

            let itemData = null;


            // ======================================
            // PRODUCT
            // ======================================

            if (
                itemType ===
                "product"
            ) {

                if (!productId) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Product ID is required"

                    });

                }


                itemId =
                    productId;


                itemData =
                    await Product.findById(
                        productId
                    );


                if (!itemData) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Product not found"

                    });

                }


                if (
                    itemData.isAvailable ===
                    false
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Product is not available"

                    });

                }

            }


            // ======================================
            // MENU ITEM
            // ======================================

            if (
                itemType ===
                "menuItem"
            ) {

                if (!menuItemId) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Menu item ID is required"

                    });

                }


                itemId =
                    menuItemId;


                itemData =
                    await MenuItem.findById(
                        menuItemId
                    );


                if (!itemData) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Menu item not found"

                    });

                }


                if (
                    itemData.isAvailable ===
                    false ||
                    itemData.isActive ===
                    false
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Menu item is not available"

                    });

                }

            }


            // ======================================
            // FIND CART
            // ======================================

            let cart =
                await Cart.findOne({
                    user: userId
                });


            if (!cart) {

                cart =
                    new Cart({

                        user: userId,

                        items: []

                    });

            }


            // ======================================
            // FIND EXISTING ITEM
            // ======================================

            const existingItem =
                cart.items.find(item => {

                    if (
                        item.itemType !==
                        itemType
                    ) {

                        return false;

                    }


                    return (
                        getItemId(item) ===
                        itemId.toString()
                    );

                });


            // ======================================
            // UPDATE EXISTING
            // ======================================

            if (existingItem) {

                existingItem.quantity =
                    Number(
                        existingItem.quantity || 0
                    ) +
                    addQuantity;

            }


            // ======================================
            // ADD NEW
            // ======================================

            else {

                if (
                    itemType ===
                    "product"
                ) {

                    cart.items.push({

                        itemType:
                            "product",

                        product:
                            productId,

                        menuItem:
                            null,

                        quantity:
                            addQuantity

                    });

                }


                if (
                    itemType ===
                    "menuItem"
                ) {

                    cart.items.push({

                        itemType:
                            "menuItem",

                        product:
                            null,

                        menuItem:
                            menuItemId,

                        quantity:
                            addQuantity

                    });

                }

            }


            await cart.save();


            const finalQuantity =
                existingItem

                    ? existingItem.quantity

                    : addQuantity;


            return res.json({

                success: true,

                message:
                    itemType === "menuItem"

                        ? "Restaurant item added to cart"

                        : "Tiffin added to cart",

                itemType,

                quantity:
                    finalQuantity

            });


        } catch (error) {

            console.error(
                "ADD CART ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to add item to cart"

            });

        }

    }
);


// ==========================================
// UPDATE QUANTITY
// ==========================================

router.put(
    "/update",
    authMiddleware,
    async (req, res) => {

        try {

            const userId =
                getUserId(req);


            const {
                itemType,
                productId,
                menuItemId,
                change
            } = req.body;


            // ======================================
            // VALIDATE TYPE
            // ======================================

            if (
                !itemType ||
                !isValidItemType(itemType)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Valid itemType is required"

                });

            }


            const changeValue =
                Number(change);


            if (
                !Number.isFinite(
                    changeValue
                ) ||
                changeValue === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid quantity change"

                });

            }


            const itemId =
                itemType === "menuItem"
                    ? menuItemId
                    : productId;


            if (!itemId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Item ID is required"

                });

            }


            // ======================================
            // FIND CART
            // ======================================

            const cart =
                await Cart.findOne({
                    user: userId
                });


            if (!cart) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Cart not found"

                });

            }


            // ======================================
            // FIND ITEM
            // ======================================

            const item =
                cart.items.find(
                    cartItem => {

                        return (
                            cartItem.itemType ===
                            itemType &&

                            getItemId(
                                cartItem
                            ) ===
                            itemId.toString()
                        );

                    }
                );


            if (!item) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Item not found in cart"

                });

            }


            // ======================================
            // CHANGE QUANTITY
            // ======================================

            const newQuantity =
                Number(
                    item.quantity || 1
                ) +
                changeValue;


            // ======================================
            // REMOVE WHEN ZERO
            // ======================================

            if (
                newQuantity <= 0
            ) {

                cart.items =
                    cart.items.filter(
                        cartItem => {

                            return !(
                                cartItem.itemType ===
                                itemType &&

                                getItemId(
                                    cartItem
                                ) ===
                                itemId.toString()
                            );

                        }
                    );


                await cart.save();


                return res.json({

                    success: true,

                    message:
                        "Item removed from cart",

                    quantity: 0

                });

            }


            // ======================================
            // SAVE NEW QUANTITY
            // ======================================

            item.quantity =
                newQuantity;


            await cart.save();


            return res.json({

                success: true,

                message:
                    "Cart updated",

                quantity:
                    newQuantity

            });


        } catch (error) {

            console.error(
                "UPDATE CART ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to update cart"

            });

        }

    }
);


// ==========================================
// REMOVE ITEM
// ==========================================

router.delete(
    "/remove",
    authMiddleware,
    async (req, res) => {

        try {

            const userId =
                getUserId(req);


            const {
                itemType,
                productId,
                menuItemId
            } = req.body;


            if (
                !itemType ||
                !isValidItemType(itemType)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Valid itemType is required"

                });

            }


            const itemId =
                itemType === "menuItem"
                    ? menuItemId
                    : productId;


            if (!itemId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Item ID is required"

                });

            }


            const cart =
                await Cart.findOne({
                    user: userId
                });


            if (!cart) {

                return res.json({

                    success: true,

                    message:
                        "Cart already empty"

                });

            }


            const oldLength =
                cart.items.length;


            cart.items =
                cart.items.filter(
                    item => {

                        return !(
                            item.itemType ===
                            itemType &&

                            getItemId(
                                item
                            ) ===
                            itemId.toString()
                        );

                    }
                );


            await cart.save();


            return res.json({

                success: true,

                message:
                    cart.items.length <
                    oldLength

                        ? "Item removed from cart"

                        : "Item was not in cart"

            });


        } catch (error) {

            console.error(
                "REMOVE CART ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to remove item"

            });

        }

    }
);


// ==========================================
// CLEAR CART
// ==========================================

router.delete(
    "/clear",
    authMiddleware,
    async (req, res) => {

        try {

            const userId =
                getUserId(req);


            const cart =
                await Cart.findOne({
                    user: userId
                });


            if (!cart) {

                return res.json({

                    success: true,

                    message:
                        "Cart already empty"

                });

            }


            cart.items = [];


            await cart.save();


            return res.json({

                success: true,

                message:
                    "Cart cleared"

            });


        } catch (error) {

            console.error(
                "CLEAR CART ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to clear cart"

            });

        }

    }
);


module.exports = router;