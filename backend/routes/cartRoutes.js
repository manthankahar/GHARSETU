const express = require("express");

const router = express.Router();

const Cart = require("../models/cart");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");


// =====================================
// GET CART
// =====================================

router.get("/", async (req, res) => {

    try {

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        if (!cart) {

            return res.json({
                items: [],
                total: 0
            });

        }

        let total = 0;

        cart.items.forEach(item => {

            if (item.product) {

                total +=
                    item.product.price *
                    item.quantity;

            }

        });

        res.json({
            items: cart.items,
            total
        });

    } catch (error) {

        console.error(
            "GET CART ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to load cart"
        });

    }

});


// =====================================
// ADD TO CART
// =====================================

router.post("/add", async (req, res) => {

    try {

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const {
            productId,
            quantity = 1
        } = req.body;

        if (!productId) {

            return res.status(400).json({
                message: "Product ID is required"
            });

        }

        const product =
            await Product.findById(productId);

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        if (!product.isAvailable) {

            return res.status(400).json({
                message: "Product is not available"
            });

        }

        let cart =
            await Cart.findOne({
                user: req.user._id
            });

        if (!cart) {

            cart = new Cart({
                user: req.user._id,
                items: []
            });

        }

        const existingItem =
            cart.items.find(
                item =>
                    item.product.toString() ===
                    productId
            );

        if (existingItem) {

            existingItem.quantity +=
                Number(quantity);

        } else {

            cart.items.push({
                product: productId,
                quantity: Number(quantity)
            });

        }

        await cart.save();

        res.json({
            success: true,
            message: "Product added to cart",
            cart
        });

    } catch (error) {

        console.error(
            "ADD CART ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to add product to cart"
        });

    }

});


// =====================================
// UPDATE CART QUANTITY
// =====================================

router.put("/update", async (req, res) => {

    try {

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const {
            productId,
            change
        } = req.body;

        const cart =
            await Cart.findOne({
                user: req.user._id
            });

        if (!cart) {

            return res.status(404).json({
                message: "Cart not found"
            });

        }

        const item =
            cart.items.find(
                item =>
                    item.product.toString() ===
                    productId
            );

        if (!item) {

            return res.status(404).json({
                message: "Product not found in cart"
            });

        }

        item.quantity += Number(change);

        if (item.quantity <= 0) {

            cart.items =
                cart.items.filter(
                    cartItem =>
                        cartItem.product.toString() !==
                        productId
                );

        }

        await cart.save();

        res.json({
            success: true,
            message: "Cart updated"
        });

    } catch (error) {

        console.error(
            "UPDATE CART ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to update cart"
        });

    }

});


// =====================================
// REMOVE FROM CART
// =====================================

router.delete("/remove", async (req, res) => {

    try {

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const {
            productId
        } = req.body;

        const cart =
            await Cart.findOne({
                user: req.user._id
            });

        if (!cart) {

            return res.status(404).json({
                message: "Cart not found"
            });

        }

        cart.items =
            cart.items.filter(
                item =>
                    item.product.toString() !==
                    productId
            );

        await cart.save();

        res.json({
            success: true,
            message: "Product removed from cart"
        });

    } catch (error) {

        console.error(
            "REMOVE CART ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to remove product"
        });

    }

});


// =====================================
// CLEAR CART
// =====================================

router.delete("/clear", async (req, res) => {

    try {

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const cart =
            await Cart.findOne({
                user: req.user._id
            });

        if (!cart) {

            return res.json({
                success: true,
                message: "Cart already empty"
            });

        }

        cart.items = [];

        await cart.save();

        res.json({
            success: true,
            message: "Cart cleared"
        });

    } catch (error) {

        console.error(
            "CLEAR CART ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to clear cart"
        });

    }

});


module.exports = router;