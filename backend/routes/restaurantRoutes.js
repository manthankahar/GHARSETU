const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const Restaurant =
    require("../models/Restaurant");

const MenuItem =
    require("../models/MenuItem");

const RestaurantOrder =
    require("../models/RestaurantOrder");

const User =
    require("../models/user");

const restaurantAuth =
    require("../middleware/restaurantAuth");


// ======================================================
// DASHBOARD
// ======================================================

router.get(
    "/dashboard",
    restaurantAuth,
    async (req, res) => {

        try {

            const restaurantId =
                req.restaurantId;


            // ==========================================
            // ORDERS
            // ==========================================

            const orders =
                await RestaurantOrder.find({
                    restaurant:
                        restaurantId
                })
                .populate(
                    "customer",
                    "name email mobile"
                )
                .populate({
                    path: "order",
                    populate: {
                        path: "items"
                    }
                })
                .sort({
                    createdAt: -1
                })
                .lean();


            // ==========================================
            // MENU ITEMS
            // ==========================================

            const menuItems =
                await MenuItem.find({
                    restaurant:
                        restaurantId
                })
                .sort({
                    createdAt: -1
                })
                .lean();


            // ==========================================
            // ORDER STATS
            // ==========================================

            const totalOrders =
                orders.length;


            const pendingOrders =
                orders.filter(
                    order =>
                        order.status ===
                        "pending"
                ).length;


            const preparingOrders =
                orders.filter(
                    order =>
                        order.status ===
                        "preparing"
                ).length;


            const readyOrders =
                orders.filter(
                    order =>
                        order.status ===
                        "ready"
                ).length;


            const completedOrders =
                orders.filter(
                    order =>
                        [
                            "delivered",
                            "picked_up"
                        ].includes(
                            order.status
                        )
                ).length;


            // ==========================================
            // SALES
            // ==========================================

            const completedOrderList =
                orders.filter(
                    order =>
                        [
                            "delivered",
                            "picked_up"
                        ].includes(
                            order.status
                        )
                );


            const totalSales =
                completedOrderList.reduce(
                    (
                        sum,
                        order
                    ) => {

                        return (
                            sum +
                            Number(
                                order.restaurantEarning ||
                                0
                            )
                        );

                    },
                    0
                );


            // ==========================================
            // PROFIT
            // ==========================================

            const totalProfit =
                completedOrderList.reduce(
                    (
                        sum,
                        order
                    ) => {

                        return (
                            sum +
                            Number(
                                order.restaurantProfit ||
                                0
                            )
                        );

                    },
                    0
                );


            // ==========================================
            // RENDER DASHBOARD
            // ==========================================

            res.render(
                "restaurant/dashboard",
                {

                    restaurant:
                        req.restaurant,

                    orders,

                    menuItems,

                    totalOrders,

                    pendingOrders,

                    preparingOrders,

                    readyOrders,

                    completedOrders,

                    totalSales,

                    totalEarnings:
                        totalSales,

                    totalProfit,

                    rating:
                        0

                }
            );


        } catch (error) {

            console.error(
                "Restaurant Dashboard Error:",
                error
            );

            res.status(500).send(
                "Failed to load restaurant dashboard."
            );

        }

    }
);


// ======================================================
// MENU
// ======================================================

router.get(
    "/menu",
    restaurantAuth,
    async (req, res) => {

        try {

            const menuItems =
                await MenuItem.find({

                    restaurant:
                        req.restaurantId

                })
                .sort({
                    createdAt: -1
                })
                .lean();


            res.render(
                "restaurant/menu",
                {

                    restaurant:
                        req.restaurant,

                    menuItems

                }
            );


        } catch (error) {

            console.error(
                "Restaurant Menu Error:",
                error
            );

            res.status(500).send(
                "Failed to load menu."
            );

        }

    }
);


// ======================================================
// ADD MENU ITEM
// ======================================================

router.post(
    "/menu/add",
    restaurantAuth,
    async (req, res) => {

        try {

            const {
                name,
                description,
                category,
                price
            } = req.body;


            if (
                !name ||
                !price
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name and price are required."

                });

            }


            const menuItem =
                await MenuItem.create({

                    restaurant:
                        req.restaurantId,

                    name:
                        name.trim(),

                    description:
                        description || "",

                    category:
                        category || "Other",

                    price:
                        Number(price),

                    isAvailable:
                        true

                });


            res.json({

                success: true,

                message:
                    "Menu item added successfully.",

                menuItem

            });


        } catch (error) {

            console.error(
                "Add Menu Item Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to add menu item."

            });

        }

    }
);


// ======================================================
// DELETE MENU ITEM
// ======================================================

router.post(
    "/menu/:id/delete",
    restaurantAuth,
    async (req, res) => {

        try {

            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid menu item ID."

                });

            }


            const deleted =
                await MenuItem.findOneAndDelete({

                    _id:
                        req.params.id,

                    restaurant:
                        req.restaurantId

                });


            if (!deleted) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Menu item not found."

                });

            }


            res.json({

                success: true,

                message:
                    "Menu item deleted."

            });


        } catch (error) {

            console.error(
                "Delete Menu Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to delete menu item."

            });

        }

    }
);


// ======================================================
// TOGGLE MENU AVAILABILITY
// ======================================================

router.post(
    "/menu/:id/toggle",
    restaurantAuth,
    async (req, res) => {

        try {

            const item =
                await MenuItem.findOne({

                    _id:
                        req.params.id,

                    restaurant:
                        req.restaurantId

                });


            if (!item) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Menu item not found."

                });

            }


            item.isAvailable =
                !item.isAvailable;


            await item.save();


            res.json({

                success: true,

                available:
                    item.isAvailable

            });


        } catch (error) {

            console.error(
                "Toggle Menu Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to update availability."

            });

        }

    }
);


// ======================================================
// ORDERS
// ======================================================

router.get(
    "/orders",
    restaurantAuth,
    async (req, res) => {

        try {

            const orders =
                await RestaurantOrder.find({

                    restaurant:
                        req.restaurantId

                })
                .populate(
                    "customer",
                    "name email mobile address"
                )
                .populate("order")
                .sort({
                    createdAt: -1
                })
                .lean();


            res.render(
                "restaurant/orders",
                {

                    restaurant:
                        req.restaurant,

                    orders

                }
            );


        } catch (error) {

            console.error(
                "Restaurant Orders Error:",
                error
            );

            res.status(500).send(
                "Failed to load restaurant orders."
            );

        }

    }
);


// ======================================================
// ORDER DETAILS
// ======================================================

router.get(
    "/orders/:id",
    restaurantAuth,
    async (req, res) => {

        try {

            const restaurantOrder =
                await RestaurantOrder.findOne({

                    _id:
                        req.params.id,

                    restaurant:
                        req.restaurantId

                })
                .populate(
                    "customer",
                    "name email mobile address"
                )
                .populate("order")
                .lean();


            if (!restaurantOrder) {

                return res.status(404).send(
                    "Order not found."
                );

            }


            res.render(
                "restaurant/orderDetails",
                {

                    restaurant:
                        req.restaurant,

                    restaurantOrder

                }
            );


        } catch (error) {

            console.error(
                "Order Details Error:",
                error
            );

            res.status(500).send(
                "Failed to load order details."
            );

        }

    }
);


// ======================================================
// UPDATE ORDER STATUS
// ======================================================

router.post(
    "/orders/:id/status",
    restaurantAuth,
    async (req, res) => {

        try {

            const {
                status
            } = req.body;


            const allowedStatuses = [

                "accepted",

                "preparing",

                "ready"

            ];


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid restaurant status."

                });

            }


            const order =
                await RestaurantOrder.findOne({

                    _id:
                        req.params.id,

                    restaurant:
                        req.restaurantId

                });


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Restaurant order not found."

                });

            }


            order.status =
                status;


            if (
                status ===
                "accepted"
            ) {

                order.acceptedAt =
                    new Date();

            }


            if (
                status ===
                "preparing"
            ) {

                order.preparingAt =
                    new Date();

            }


            if (
                status ===
                "ready"
            ) {

                order.readyAt =
                    new Date();

            }


            await order.save();


            res.json({

                success: true,

                message:
                    `Order marked as ${status}.`,

                order

            });


        } catch (error) {

            console.error(
                "Restaurant Status Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to update order."

            });

        }

    }
);


// ======================================================
// EARNINGS
// ======================================================

router.get(
    "/earnings",
    restaurantAuth,
    async (req, res) => {

        try {

            const orders =
                await RestaurantOrder.find({

                    restaurant:
                        req.restaurantId

                })
                .populate(
                    "customer",
                    "name"
                )
                .sort({
                    createdAt: -1
                })
                .lean();


            const completed =
                orders.filter(
                    order =>
                        [
                            "picked_up",
                            "delivered"
                        ].includes(
                            order.status
                        )
                );


            const totalSales =
                completed.reduce(
                    (
                        sum,
                        order
                    ) =>
                        sum +
                        Number(
                            order.restaurantEarning ||
                            0
                        ),
                    0
                );


            const totalProfit =
                completed.reduce(
                    (
                        sum,
                        order
                    ) =>
                        sum +
                        Number(
                            order.restaurantProfit ||
                            0
                        ),
                    0
                );


            res.render(
                "restaurant/earnings",
                {

                    restaurant:
                        req.restaurant,

                    orders,

                    completedOrders:
                        completed,

                    totalSales,

                    totalProfit

                }
            );


        } catch (error) {

            console.error(
                "Restaurant Earnings Error:",
                error
            );

            res.status(500).send(
                "Failed to load earnings."
            );

        }

    }
);


// ======================================================
// CUSTOMERS
// ======================================================

router.get(
    "/customers",
    restaurantAuth,
    async (req, res) => {

        try {

            const orders =
                await RestaurantOrder.find({

                    restaurant:
                        req.restaurantId

                })
                .distinct(
                    "customer"
                );


            const customers =
                await User.find({

                    _id: {
                        $in:
                            orders
                    }

                })
                .select(
                    "name email mobile address"
                )
                .lean();


            res.render(
                "restaurant/customers",
                {

                    restaurant:
                        req.restaurant,

                    customers

                }
            );


        } catch (error) {

            console.error(
                "Restaurant Customers Error:",
                error
            );

            res.status(500).send(
                "Failed to load customers."
            );

        }

    }
);


// ======================================================
// PROFILE
// ======================================================

router.get(
    "/profile",
    restaurantAuth,
    async (req, res) => {

        res.render(
            "restaurant/profile",
            {

                restaurant:
                    req.restaurant

            }
        );

    }
);


// ======================================================
// UPDATE PROFILE
// ======================================================

router.post(
    "/profile/update",
    restaurantAuth,
    async (req, res) => {

        try {

            const {
                restaurantName,
                email,
                mobile,
                address,
                description,
                cuisine,
                openingTime,
                closingTime
            } = req.body;


            req.restaurant.restaurantName =
                restaurantName ||
                req.restaurant.restaurantName;


            req.restaurant.email =
                email ||
                req.restaurant.email;


            req.restaurant.mobile =
                mobile ||
                req.restaurant.mobile;


            req.restaurant.address =
                address ||
                req.restaurant.address;


            req.restaurant.description =
                description || "";


            req.restaurant.cuisine =
                cuisine || "";


            req.restaurant.openingTime =
                openingTime || "09:00";


            req.restaurant.closingTime =
                closingTime || "23:00";


            await req.restaurant.save();


            res.json({

                success: true,

                message:
                    "Restaurant profile updated."

            });


        } catch (error) {

            console.error(
                "Profile Update Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to update profile."

            });

        }

    }
);


// ======================================================
// REVIEWS
// ======================================================

router.get(
    "/reviews",
    restaurantAuth,
    async (req, res) => {

        res.render(
            "restaurant/reviews",
            {

                restaurant:
                    req.restaurant,

                reviews: [],

                totalReviews: 0,

                averageRating: 0

            }
        );

    }
);


// ======================================================
// LOGOUT
// ======================================================

router.get(
    "/logout",
    (req, res) => {

        res.clearCookie(
            "restaurantToken"
        );

        res.redirect(
            "/restaurant/login"
        );

    }
);


module.exports = router;