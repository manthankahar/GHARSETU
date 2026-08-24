const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/cart");

// =================================
// CUSTOMER LOGIN PAGE
// =================================

router.get("/login", (req, res) => {
    res.render("customer/login");
});

// =================================
// CUSTOMER SIGNUP PAGE
// =================================

router.get("/signup", (req, res) => {
    res.render("customer/signup");
});

// =================================
// CUSTOMER HOME PAGE
// =================================

router.get("/home", (req, res) => {
    res.render("customer/home");
});

// =================================
// CUSTOMER TIFFINS PAGE
// =================================

router.get("/tiffins", (req, res) => {
    res.render("customer/tiffins");
});

// =================================
// CUSTOMER TIFFIN DETAILS
// =================================

router.get("/tiffins/:id", (req, res) => {

    const tiffinId = req.params.id;

    res.render("customer/tiffinDetails", {
        tiffinId
    });
});

// =================================
// CUSTOMER CART PAGE
// =================================

router.get("/cart", (req, res) => {
    res.render("customer/cart");
});

// =================================
// CUSTOMER CHECKOUT PAGE
// =================================

router.get("/checkout", (req, res) => {
    res.render("customer/checkout");
});

// =================================
// CUSTOMER ORDERS PAGE
// =================================

router.get("/orders", async (req, res) => {

    try {

        const orders = await Order.find()
            .populate("customer", "name email mobile")
            .sort({ createdAt: -1 });

        res.render("customer/orders", {
            orders
        });

    } catch (error) {

        console.error("Orders Page Error:", error);

        res.status(500).send(
            "Failed to load orders"
        );
    }
});

// =================================
// CUSTOMER ORDER DETAILS
// =================================

router.get("/orders/:id", async (req, res) => {

    try {

        const order = await Order.findById(req.params.id)
            .populate("customer", "name email mobile");

        if (!order) {

            return res.status(404).send(
                "Order not found"
            );
        }

        res.render("customer/orderDetails", {
            order
        });

    } catch (error) {

        console.error(
            "Order Details Error:",
            error
        );

        res.status(500).send(
            "Server Error"
        );
    }
});

// =================================
// CUSTOMER PROFILE
// =================================

router.get("/profile", (req, res) => {

    res.render("customer/profile", {
        user: req.user || null
    });

});

// =================================
// CUSTOMER RESTAURANTS
// =================================

router.get("/restaurants", (req, res) => {

    res.render("customer/restaurants", {
        restaurants: []
    });

});

// =================================
// RESTAURANT DETAILS
// =================================

router.get("/restaurants/:id", (req, res) => {

    res.render("customer/restaurantDetails", {
        restaurant: {
            _id: req.params.id,
            name: "Restaurant",
            description: "Restaurant details"
        },
        products: []
    });

});

// =================================
// SEARCH
// =================================

router.get("/search", (req, res) => {

    const q = req.query.q || "";

    res.render("customer/search", {
        q,
        results: []
    });

});

// =================================
// SUBSCRIPTIONS
// =================================

router.get("/subscriptions", (req, res) => {

    res.render("customer/subscriptions", {
        subscriptions: []
    });

});

// =================================
// TRACK ORDER
// =================================

router.get("/track-order", async (req, res) => {

    const orderId = req.query.orderId;

    let order = null;

    if (orderId) {

        try {

            order = await Order.findById(orderId);

        } catch (error) {

            console.log(
                "Track Order Error:",
                error.message
            );

        }
    }

    res.render("customer/trackOrder", {
        orderId,
        order
    });

});

// =================================
// PLACE ORDER
// =================================

router.post("/place-order", async (req, res) => {

    try {

        const {
            name,
            mobile,
            address,
            city,
            pincode,
            payment
        } = req.body;

        // =============================
        // VALIDATION
        // =============================

        if (
            !name ||
            !mobile ||
            !address ||
            !city ||
            !pincode ||
            !payment
        ) {

            return res.status(400).send(
                "Please provide all delivery details"
            );

        }

        // =============================
        // GET CART
        // =============================

        const cart = await Cart.findOne();

        if (
            !cart ||
            !cart.items ||
            cart.items.length === 0
        ) {

            return res.status(400).send(
                "Your cart is empty"
            );

        }

        // =============================
        // PREPARE ORDER ITEMS
        // =============================

        const items = cart.items.map(item => ({

            name: item.name,

            price: item.price,

            quantity: item.quantity

        }));

        // =============================
        // CALCULATE TOTAL
        // =============================

        const subtotal = items.reduce(
            (total, item) =>
                total + (item.price * item.quantity),
            0
        );

        const deliveryCharge = 20;

        const total =
            subtotal + deliveryCharge;

        // =============================
        // CREATE ORDER
        // =============================

        const orderData = {

            items,

            deliveryDetails: {
                name,
                mobile,
                address,
                city,
                pincode
            },

            paymentMethod: payment,

            subtotal,

            deliveryCharge,

            total,

            status: "placed"

        };

        // User logged-in hoy to customer add karishu
        if (req.user && req.user._id) {

            orderData.customer =
                req.user._id;

        }

        const order =
            await Order.create(orderData);

        // =============================
        // CLEAR CART
        // =============================

        cart.items = [];

        await cart.save();

        // =============================
        // REDIRECT
        // =============================

        res.redirect(
            `/customer/orders/${order._id}`
        );

    } catch (error) {

        console.error(
            "PLACE ORDER ERROR:",
            error
        );

        res.status(500).send(
            "Failed to place order"
        );

    }

});

// =================================
// EXPORT
// =================================

module.exports = router;