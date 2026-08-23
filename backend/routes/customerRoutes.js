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
// CUSTOMER ORDER DETAILS PAGE
// =================================

router.get("/orders/:id", async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).send("Order not found");

        }

        res.render("customer/orderDetails", {
            order
        });

    } catch (error) {

        console.error("Order Details Error:", error);

        res.status(500).send("Server Error");

    }

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

        if (!cart || !cart.items || cart.items.length === 0) {

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

        const total = subtotal + deliveryCharge;


        // =============================
        // CREATE ORDER
        // =============================

        const order = await Order.create({

            customer: req.user._id,

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

        });


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

        console.error("PLACE ORDER ERROR:", error);

        res.status(500).send(
            "Failed to place order"
        );

    }

});
module.exports = router;