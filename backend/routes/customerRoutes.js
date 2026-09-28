const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Cart = require("../models/cart");

const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const RestaurantOrder = require("../models/RestaurantOrder");

const authMiddleware = require("../middleware/authMiddleware");

// =============================================
// HELPER
// =============================================

function getUserId(req) {
    return req.user?.id || req.user?._id || null;
}


// =============================================
// CUSTOMER SIGNUP PAGE
// PUBLIC
// =============================================

router.get("/signup", (req, res) => {
    res.render("customer/signup");
});


// =============================================
// CUSTOMER LOGIN PAGE
// PUBLIC
// =============================================

router.get("/login", (req, res) => {
    res.render("customer/login");
});


// =============================================
// CUSTOMER MAIN PAGE
// PROTECTED
// =============================================

router.get(
    "/home",
    authMiddleware,
    (req, res) => {

        const userId = getUserId(req);

        if (!userId) {
            return res.redirect("/customer/login");
        }

        return res.render(
            "customer/home",
            {
                user: req.user
            }
        );
    }
);


// =============================================
// CUSTOMER TIFFINS
// PUBLIC
// =============================================

router.get("/tiffins", async (req, res) => {

    try {

        const products =
            await MenuItem.find({
                isAvailable: true
            })
            .sort({
                createdAt: -1
            })
            .lean();

        return res.render(
            "customer/tiffins",
            {
                products
            }
        );

    } catch (error) {

        console.error(
            "CUSTOMER TIFFINS ERROR:",
            error
        );

        return res.status(500).send(
            "Failed to load tiffins"
        );
    }
});


// =============================================
// CUSTOMER TIFFIN DETAILS
// PUBLIC
// =============================================

router.get(
    "/tiffins/:id",
    async (req, res) => {

        try {

            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {

                return res.status(400).send(
                    "Invalid tiffin ID"
                );
            }

            const tiffin =
                await MenuItem.findOne({

                    _id: id,

                    isAvailable: true

                })
                .lean();

            if (!tiffin) {

                return res.status(404).send(
                    "Tiffin not found"
                );
            }

            return res.render(
                "customer/tiffinDetails",
                {
                    tiffin
                }
            );

        } catch (error) {

            console.error(
                "TIFFIN DETAILS ERROR:",
                error
            );

            return res.status(500).send(
                "Failed to load tiffin details"
            );
        }
    }
);


// =============================================
// CUSTOMER RESTAURANTS
// PUBLIC
// =============================================

router.get(
    "/restaurants",
    async (req, res) => {

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

            return res.render(
                "customer/restaurants",
                {
                    restaurants
                }
            );

        } catch (error) {

            console.error(
                "CUSTOMER RESTAURANTS ERROR:",
                error
            );

            return res.status(500).send(
                "Failed to load restaurants"
            );
        }
    }
);


// =============================================
// RESTAURANT DETAILS + MENU
// PUBLIC
// =============================================

router.get(
    "/restaurants/:id",
    async (req, res) => {

        try {

            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {

                return res.status(400).send(
                    "Invalid restaurant ID"
                );
            }

            const restaurant =
                await Restaurant.findOne({

                    _id: id,

                    approvalStatus: "approved",

                    isActive: {
                        $ne: false
                    }

                })
                .lean();

            if (!restaurant) {

                return res.status(404).send(
                    "Restaurant not found"
                );
            }

            const menuItems =
                await MenuItem.find({

                    restaurant: restaurant._id,

                    isAvailable: true

                })
                .sort({
                    createdAt: -1
                })
                .lean();

            return res.render(
                "customer/restaurantDetails",
                {
                    restaurant,
                    products: menuItems,
                    menuItems
                }
            );

        } catch (error) {

            console.error(
                "RESTAURANT DETAILS ERROR:",
                error
            );

            return res.status(500).send(
                "Failed to load restaurant details"
            );
        }
    }
);


// =============================================
// CUSTOMER SEARCH
// PUBLIC
// =============================================

router.get(
    "/search",
    async (req, res) => {

        try {

            const q =
                (req.query.q || "").trim();

            let results = [];

            if (q) {

                results =
                    await Restaurant.find({

                        approvalStatus:
                            "approved",

                        isActive: {
                            $ne: false
                        },

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

                    })
                    .sort({
                        createdAt: -1
                    })
                    .lean();
            }

            return res.render(
                "customer/search",
                {
                    q,
                    results
                }
            );

        } catch (error) {

            console.error(
                "CUSTOMER SEARCH ERROR:",
                error
            );

            return res.status(500).send(
                "Search failed"
            );
        }
    }
);


// =============================================
// CUSTOMER CART PAGE
// PROTECTED
// =============================================

router.get(
    "/cart",
    authMiddleware,
    (req, res) => {

        const userId = getUserId(req);

        if (!userId) {
            return res.redirect("/customer/login");
        }

        return res.render(
            "customer/cart",
            {
                user: req.user
            }
        );
    }
);


// =============================================
// CUSTOMER CHECKOUT PAGE
// PROTECTED
// =============================================

router.get(
    "/checkout",
    authMiddleware,
    (req, res) => {

        const userId = getUserId(req);

        if (!userId) {
            return res.redirect("/customer/login");
        }

        return res.render(
            "customer/checkout",
            {
                user: req.user
            }
        );
    }
);


// =============================================
// CUSTOMER ORDERS
// PROTECTED
// =============================================

router.get(
    "/orders",
    authMiddleware,
    async (req, res) => {

        try {

            const userId =
                getUserId(req);

            if (!userId) {
                return res.redirect(
                    "/customer/login"
                );
            }

            const orders =
                await Order.find({
                    customer: userId
                })
                .populate(
                    "customer",
                    "name email mobile"
                )
                .sort({
                    createdAt: -1
                })
                .lean();

            return res.render(
                "customer/orders",
                {
                    orders,
                    user: req.user
                }
            );

        } catch (error) {

            console.error(
                "CUSTOMER ORDERS ERROR:",
                error
            );

            return res.status(500).send(
                "Failed to load orders"
            );
        }
    }
);


// =============================================
// CUSTOMER ORDER DETAILS
// PROTECTED
// =============================================

router.get(
    "/orders/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const userId =
                getUserId(req);

            if (!userId) {
                return res.redirect(
                    "/customer/login"
                );
            }

            const { id } = req.params;

            if (
                !mongoose.Types.ObjectId.isValid(id)
            ) {

                return res.status(400).send(
                    "Invalid order ID"
                );
            }

            const order =
                await Order.findOne({

                    _id: id,

                    customer: userId

                })
                .populate(
                    "customer",
                    "name email mobile"
                )
                .lean();

            if (!order) {

                return res.status(404).send(
                    "Order not found"
                );
            }

            return res.render(
                "customer/orderDetails",
                {
                    order,
                    user: req.user
                }
            );

        } catch (error) {

            console.error(
                "CUSTOMER ORDER DETAILS ERROR:",
                error
            );

            return res.status(500).send(
                "Failed to load order details"
            );
        }
    }
);


// =============================================
// CUSTOMER PROFILE
// PROTECTED
// =============================================

router.get(
    "/profile",
    authMiddleware,
    (req, res) => {

        const userId =
            getUserId(req);

        if (!userId) {
            return res.redirect(
                "/customer/login"
            );
        }

        return res.render(
            "customer/profile",
            {
                user: req.user
            }
        );
    }
);


// =============================================
// CUSTOMER SUBSCRIPTIONS
// PROTECTED
// =============================================

router.get(
    "/subscriptions",
    authMiddleware,
    (req, res) => {

        const userId =
            getUserId(req);

        if (!userId) {
            return res.redirect(
                "/customer/login"
            );
        }

        return res.render(
            "customer/subscriptions",
            {
                subscriptions: [],
                user: req.user
            }
        );
    }
);


// =============================================
// TRACK ORDER
// PROTECTED
// =============================================

router.get(
    "/track-order",
    authMiddleware,
    async (req, res) => {

        try {

            const userId =
                getUserId(req);

            if (!userId) {
                return res.redirect(
                    "/customer/login"
                );
            }

            const orderId =
                req.query.orderId || "";

            let order = null;

            if (
                orderId &&
                mongoose.Types.ObjectId.isValid(
                    orderId
                )
            ) {

                order =
                    await Order.findOne({

                        _id: orderId,

                        customer: userId

                    })
                    .lean();
            }

            return res.render(
                "customer/trackOrder",
                {
                    orderId,
                    order,
                    user: req.user
                }
            );

        } catch (error) {

            console.error(
                "CUSTOMER TRACK ORDER ERROR:",
                error
            );

            return res.status(500).send(
                "Failed to track order"
            );
        }
    }
);


// =============================================
// PLACE ORDER
// PROTECTED
// =============================================

router.post(
    "/place-order",
    authMiddleware,
    async (req, res) => {

        try {

            const userId =
                getUserId(req);

            if (!userId) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Please login first"

                });
            }


            // -----------------------------------------
            // GET DATA
            // -----------------------------------------

            const {
                name,
                mobile,
                address,
                city,
                pincode,
                payment,
                restaurantId
            } = req.body;


            // -----------------------------------------
            // VALIDATION
            // -----------------------------------------

            if (
                !name ||
                !mobile ||
                !address ||
                !city ||
                !pincode ||
                !payment
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please fill all delivery details"

                });
            }


            // -----------------------------------------
            // RESTAURANT ID
            // -----------------------------------------

            if (!restaurantId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Restaurant is required"

                });
            }


            if (
                !mongoose.Types.ObjectId.isValid(
                    restaurantId
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid restaurant ID"

                });
            }


            // -----------------------------------------
            // CHECK RESTAURANT
            // -----------------------------------------

            const restaurant =
                await Restaurant.findOne({

                    _id: restaurantId,

                    approvalStatus: "approved",

                    isActive: {
                        $ne: false
                    }

                })
                .lean();


            if (!restaurant) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Restaurant is not available"

                });
            }


            // -----------------------------------------
            // GET CART
            // -----------------------------------------

            const cart =
                await Cart.findOne({

                    user: userId

                })
                .populate(
                    "items.product"
                )
                .populate(
                    "items.menuItem"
                );


            if (
                !cart ||
                !cart.items ||
                cart.items.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Your cart is empty"

                });
            }


            // -----------------------------------------
            // PREPARE ITEMS
            // -----------------------------------------

            const items =
                cart.items
                .map(item => {

                    let product = null;

                    if (
                        item.itemType === "menuItem"
                    ) {

                        product =
                            item.menuItem;

                    } else {

                        product =
                            item.product;

                    }

                    if (!product) {
                        return null;
                    }

                    const price =
                        Number(
                            product.finalPrice ||
                            product.price ||
                            0
                        );

                    return {

                        name:
                            product.name ||
                            "Food Item",

                        price,

                        quantity:
                            Number(
                                item.quantity || 1
                            ),

                        menuItem:
                            item.itemType ===
                            "menuItem"
                                ? product._id
                                : null

                    };

                })
                .filter(Boolean);


            if (items.length === 0) {

                return res.status(400).json({

                    success: false,

                    message:
                        "No valid items in cart"

                });
            }


            // -----------------------------------------
            // SUBTOTAL
            // -----------------------------------------

            const subtotal =
                items.reduce(
                    (sum, item) => {

                        return (
                            sum +
                            (
                                Number(item.price) *
                                Number(item.quantity)
                            )
                        );

                    },
                    0
                );


            // -----------------------------------------
            // DELIVERY CHARGE
            // -----------------------------------------

            const deliveryCharge = 20;


            // -----------------------------------------
            // TOTAL
            // -----------------------------------------

            const total =
                subtotal +
                deliveryCharge;


            // -----------------------------------------
            // FOOD COST
            // -----------------------------------------

            const foodCost =
                cart.items.reduce(
                    (sum, item) => {

                        let product = null;

                        if (
                            item.itemType === "menuItem"
                        ) {

                            product =
                                item.menuItem;

                        } else {

                            product =
                                item.product;

                        }

                        if (!product) {
                            return sum;
                        }

                        const cost =
                            Number(
                                product.foodCost || 0
                            );

                        const quantity =
                            Number(
                                item.quantity || 1
                            );

                        return (
                            sum +
                            (
                                cost *
                                quantity
                            )
                        );

                    },
                    0
                );


            // -----------------------------------------
            // CREATE CUSTOMER ORDER
            // -----------------------------------------

            const order =
                await Order.create({

                    customer:
                        userId,

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

                });


            // -----------------------------------------
            // CREATE RESTAURANT ORDER
            // -----------------------------------------

            await RestaurantOrder.create({

                order:
                    order._id,

                restaurant:
                    restaurantId,

                customer:
                    userId,

                status:
                    "pending",

                subtotal,

                platformFee:
                    0,

                deliveryFee:
                    deliveryCharge,

                restaurantEarning:
                    subtotal,

                restaurantProfit:
                    subtotal -
                    foodCost,

                foodCost

            });


            // -----------------------------------------
            // CLEAR CART
            // -----------------------------------------

            cart.items = [];

            await cart.save();


            // -----------------------------------------
            // SUCCESS
            // -----------------------------------------

            return res.status(201).json({

                success: true,

                message:
                    "Order placed successfully",

                orderId:
                    order._id

            });

        } catch (error) {

            console.error(
                "CUSTOMER PLACE ORDER ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to place order",

                error:
                    error.message

            });
        }
    }
);


// =============================================
// EXPORT
// =============================================

module.exports = router;