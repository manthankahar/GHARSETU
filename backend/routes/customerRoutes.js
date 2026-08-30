const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Cart = require("../models/cart");

// =============================================
// RESTAURANT MODELS
// =============================================

const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const RestaurantOrder = require("../models/RestaurantOrder");


// =============================================
// CUSTOMER LOGIN PAGE
// =============================================

router.get("/login", (req, res) => {

    res.render("customer/login");

});


// =============================================
// CUSTOMER SIGNUP PAGE
// =============================================

router.get("/signup", (req, res) => {

    res.render("customer/signup");

});


// =============================================
// CUSTOMER HOME PAGE
// =============================================

router.get("/home", (req, res) => {

    res.render("customer/home");

});


// =============================================
// CUSTOMER TIFFINS PAGE
// =============================================

router.get("/tiffins", (req, res) => {

    res.render("customer/tiffins");

});


// =============================================
// CUSTOMER TIFFIN DETAILS
// =============================================

router.get("/tiffins/:id", (req, res) => {

    const tiffinId = req.params.id;

    res.render("customer/tiffinDetails", {
        tiffinId
    });

});


// =============================================
// CUSTOMER CART PAGE
// =============================================

router.get("/cart", (req, res) => {

    res.render("customer/cart");

});


// =============================================
// CUSTOMER CHECKOUT PAGE
// =============================================

router.get("/checkout", (req, res) => {

    res.render("customer/checkout");

});


// =============================================
// CUSTOMER ORDERS PAGE
// =============================================

router.get("/orders", async (req, res) => {

    try {

        const query = {};

        if (req.user && req.user._id) {

            query.customer = req.user._id;

        }

        const orders = await Order.find(query)
            .populate("customer", "name email mobile")
            .sort({
                createdAt: -1
            });

        res.render("customer/orders", {
            orders
        });

    } catch (error) {

        console.error(
            "Orders Page Error:",
            error
        );

        res.status(500).send(
            "Failed to load orders"
        );

    }

});


// =============================================
// CUSTOMER ORDER DETAILS
// =============================================

router.get("/orders/:id", async (req, res) => {

    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {

            return res.status(400).send(
                "Invalid order ID"
            );

        }

        const order = await Order.findById(
            req.params.id
        )
        .populate(
            "customer",
            "name email mobile"
        );

        if (!order) {

            return res.status(404).send(
                "Order not found"
            );

        }

        res.render(
            "customer/orderDetails",
            {
                order
            }
        );

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


// =============================================
// CUSTOMER PROFILE
// =============================================

router.get("/profile", (req, res) => {

    res.render("customer/profile", {
        user: req.user || null
    });

});


// =============================================
// CUSTOMER RESTAURANTS
// =============================================
// Only APPROVED restaurants visible to customers
// =============================================

router.get("/restaurants", async (req, res) => {

    try {

        const restaurants =
            await Restaurant.find({

                approvalStatus: "approved",

                isActive: {
                    $ne: false
                }

            })
            .sort({
                createdAt: -1
            })
            .lean();

        res.render(
            "customer/restaurants",
            {
                restaurants
            }
        );

    } catch (error) {

        console.error(
            "Restaurants Page Error:",
            error
        );

        res.status(500).send(
            "Failed to load restaurants"
        );

    }

});


// =============================================
// RESTAURANT DETAILS + MENU
// =============================================

router.get(
    "/restaurants/:id",
    async (req, res) => {

        try {

            // ---------------------------------
            // CHECK RESTAURANT ID
            // ---------------------------------

            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {

                return res.status(400).send(
                    "Invalid restaurant ID"
                );

            }


            // ---------------------------------
            // GET APPROVED RESTAURANT
            // ---------------------------------

            const restaurant =
                await Restaurant.findOne({

                    _id: req.params.id,

                    approvalStatus: "approved"

                }).lean();


            if (!restaurant) {

                return res.status(404).send(
                    "Restaurant not found or not approved"
                );

            }


            // ---------------------------------
            // GET AVAILABLE MENU
            // ---------------------------------

            const menuItems =
                await MenuItem.find({

                    restaurant:
                        restaurant._id,

                    isAvailable:
                        true

                })
                .sort({
                    createdAt: -1
                })
                .lean();


            // ---------------------------------
            // SHOW RESTAURANT PAGE
            // ---------------------------------

            res.render(
                "customer/restaurantDetails",
                {

                    restaurant,

                    products:
                        menuItems,

                    menuItems

                }
            );

        } catch (error) {

            console.error(
                "Restaurant Details Error:",
                error
            );

            res.status(500).send(
                "Failed to load restaurant details"
            );

        }

    }
);


// =============================================
// SEARCH
// =============================================

router.get("/search", async (req, res) => {

    try {

        const q =
            req.query.q || "";


        let results = [];


        if (q.trim()) {

            results =
                await Restaurant.find({

                    approvalStatus:
                        "approved",

                    $or: [

                        {
                            name: {
                                $regex: q,
                                $options: "i"
                            }
                        },

                        {
                            description: {
                                $regex: q,
                                $options: "i"
                            }
                        }

                    ]

                }).lean();

        }


        res.render(
            "customer/search",
            {
                q,
                results
            }
        );

    } catch (error) {

        console.error(
            "Search Error:",
            error
        );

        res.status(500).send(
            "Search failed"
        );

    }

});


// =============================================
// SUBSCRIPTIONS
// =============================================

router.get("/subscriptions", (req, res) => {

    res.render(
        "customer/subscriptions",
        {
            subscriptions: []
        }
    );

});


// =============================================
// TRACK ORDER
// =============================================

router.get(
    "/track-order",
    async (req, res) => {

        const orderId =
            req.query.orderId;

        let order = null;


        if (orderId) {

            try {

                if (
                    mongoose.Types.ObjectId.isValid(
                        orderId
                    )
                ) {

                    order =
                        await Order.findById(
                            orderId
                        );

                }

            } catch (error) {

                console.log(
                    "Track Order Error:",
                    error.message
                );

            }

        }


        res.render(
            "customer/trackOrder",
            {
                orderId,
                order
            }
        );

    }
);


// =============================================
// PLACE ORDER
// =============================================

router.post(
    "/place-order",
    async (req, res) => {

        try {

            const {

                name,

                mobile,

                address,

                city,

                pincode,

                payment,

                restaurantId

            } = req.body;


            // =================================
            // VALIDATION
            // =================================

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


            // =================================
            // RESTAURANT VALIDATION
            // =================================

            if (!restaurantId) {

                return res.status(400).send(
                    "Restaurant is required"
                );

            }


            if (
                !mongoose.Types.ObjectId.isValid(
                    restaurantId
                )
            ) {

                return res.status(400).send(
                    "Invalid restaurant ID"
                );

            }


            // =================================
            // GET APPROVED RESTAURANT
            // =================================

            const restaurant =
                await Restaurant.findOne({

                    _id: restaurantId,

                    approvalStatus:
                        "approved",

                    isActive: {
                        $ne: false
                    }

                }).lean();


            if (!restaurant) {

                return res.status(404).send(
                    "Restaurant not available"
                );

            }


            // =================================
            // GET CART
            // =================================

            const cart =
                await Cart.findOne();


            if (
                !cart ||
                !cart.items ||
                cart.items.length === 0
            ) {

                return res.status(400).send(
                    "Your cart is empty"
                );

            }


            // =================================
            // PREPARE ORDER ITEMS
            // =================================

            const items =
                cart.items.map(item => ({

                    name:
                        item.name,

                    price:
                        Number(
                            item.price || 0
                        ),

                    quantity:
                        Number(
                            item.quantity || 1
                        ),

                    // Keep restaurant/menu relation
                    menuItem:
                        item.product ||
                        item.menuItem ||
                        null

                }));


            // =================================
            // CALCULATE SUBTOTAL
            // =================================

            const subtotal =
                items.reduce(

                    (total, item) =>

                        total +
                        (
                            Number(item.price) *
                            Number(item.quantity)
                        ),

                    0

                );


            // =================================
            // DELIVERY CHARGE
            // =================================

            const deliveryCharge =
                20;


            // =================================
            // TOTAL
            // =================================

            const total =
                subtotal +
                deliveryCharge;


            // =================================
            // FOOD COST
            // =================================
            // If cart item has foodCost use it.
            // Otherwise 0.

            const foodCost =
                cart.items.reduce(

                    (total, item) =>

                        total +
                        (
                            Number(
                                item.foodCost || 0
                            ) *
                            Number(
                                item.quantity || 1
                            )
                        ),

                    0

                );


            // =================================
            // CREATE MAIN CUSTOMER ORDER
            // =================================

            const orderData = {

                items,

                deliveryDetails: {

                    name,

                    mobile,

                    address,

                    city,

                    pincode

                },

                paymentMethod:
                    payment,

                subtotal,

                deliveryCharge,

                total,

                status:
                    "placed"

            };


            // =================================
            // ADD CUSTOMER
            // =================================

            if (
                req.user &&
                req.user._id
            ) {

                orderData.customer =
                    req.user._id;

            }


            // =================================
            // CREATE ORDER
            // =================================

            const order =
                await Order.create(
                    orderData
                );


            // =================================
            // CREATE RESTAURANT ORDER
            // =================================

            let restaurantOrder =
                null;


            if (
                req.user &&
                req.user._id
            ) {

                restaurantOrder =
                    await RestaurantOrder.create({

                        order:
                            order._id,

                        restaurant:
                            restaurantId,

                        customer:
                            req.user._id,

                        status:
                            "pending",

                        subtotal:
                            subtotal,

                        platformFee:
                            0,

                        deliveryFee:
                            deliveryCharge,

                        restaurantEarning:
                            subtotal,

                        restaurantProfit:
                            subtotal - foodCost,

                        foodCost:
                            foodCost

                    });

            } else {

                console.log(
                    "RestaurantOrder not created because customer is not logged in."
                );

            }


            // =================================
            // CLEAR CART
            // =================================

            cart.items = [];

            await cart.save();


            // =================================
            // SUCCESS
            // =================================

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

    }
);


// =============================================
// EXPORT
// =============================================

module.exports = router;