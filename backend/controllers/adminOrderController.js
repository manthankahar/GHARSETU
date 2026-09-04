const mongoose = require("mongoose");

const Order = require("../models/Order");
const User = require("../models/user");


// ======================================================
// ADMIN - GET ALL ORDERS
// ======================================================

const getAdminOrders = async (req, res) => {

    try {

        const search =
            (req.query.search || "").trim();

        const status =
            (req.query.status || "all").trim();


        // ==================================================
        // CUSTOMER SEARCH
        // ==================================================

        let customerIds = [];


        if (search) {

            const regex =
                new RegExp(search, "i");


            const customers =
                await User.find({

                    $or: [

                        {
                            name: regex
                        },

                        {
                            email: regex
                        },

                        {
                            mobile: regex
                        }

                    ]

                })
                .select("_id")
                .lean();


            customerIds =
                customers.map(
                    customer => customer._id
                );

        }


        // ==================================================
        // ORDER QUERY
        // ==================================================

        const orderQuery = {};


        // ==================================================
        // STATUS FILTER
        // ==================================================

        if (
            status &&
            status !== "all"
        ) {

            orderQuery.status =
                status;

        }


        // ==================================================
        // SEARCH CUSTOMER
        // ==================================================

        if (search) {

            const searchConditions = [];


            // Customer match
            if (
                customerIds.length > 0
            ) {

                searchConditions.push({

                    customer: {
                        $in: customerIds
                    }

                });

            }


            // Order ObjectId match
            if (
                mongoose.Types.ObjectId.isValid(
                    search
                )
            ) {

                searchConditions.push({

                    _id: search

                });

            }


            // If nothing matched
            if (
                searchConditions.length === 0
            ) {

                orderQuery._id = {
                    $in: []
                };

            } else {

                orderQuery.$or =
                    searchConditions;

            }

        }


        // ==================================================
        // GET ORDERS
        // ==================================================

        const orders =
            await Order.find(orderQuery)

                .populate(
                    "customer",
                    "name email mobile"
                )

                .sort({
                    createdAt: -1
                })

                .lean();


        // ==================================================
        // TOTAL ORDERS
        // ==================================================

        const totalOrders =
            await Order.countDocuments();


        // ==================================================
        // PLACED ORDERS
        // Confirmed from existing customer
        // order creation flow.
        // ==================================================

        const placedOrders =
            await Order.countDocuments({

                status: "placed"

            });


        // ==================================================
        // TOTAL REVENUE
        // Existing order creation uses `total`.
        // ==================================================

        const revenueData =
            await Order.aggregate([

                {
                    $group: {

                        _id: null,

                        totalRevenue: {
                            $sum: {
                                $ifNull: [
                                    "$total",
                                    0
                                ]
                            }
                        }

                    }

                }

            ]);


        const totalRevenue =
            revenueData.length > 0
                ? Number(
                    revenueData[0].totalRevenue || 0
                )
                : 0;


        // ==================================================
        // DYNAMIC STATUS SUMMARY
        // No status enum guessed.
        // Reads whatever statuses actually exist.
        // ==================================================

        const statusSummary =
            await Order.aggregate([

                {

                    $group: {

                        _id: "$status",

                        count: {
                            $sum: 1
                        }

                    }

                },

                {

                    $sort: {
                        count: -1
                    }

                }

            ]);


        // ==================================================
        // RENDER
        // ==================================================

        return res.render(
            "admin/orders",
            {

                admin:
                    req.admin,

                orders,

                totalOrders,

                placedOrders,

                totalRevenue,

                statusSummary,

                search,

                status

            }
        );


    } catch (error) {

        console.error(
            "ADMIN ORDERS ERROR:",
            error
        );


        return res.status(500).send(
            "Failed to load admin orders."
        );

    }

};


// ======================================================
// ADMIN - ORDER DETAILS
// ======================================================

const getAdminOrderDetails =
    async (req, res) => {

        try {

            const { id } =
                req.params;


            // ==================================================
            // OBJECT ID VALIDATION
            // ==================================================

            if (
                !mongoose.Types.ObjectId.isValid(
                    id
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order ID."

                });

            }


            // ==================================================
            // FIND ORDER
            // ==================================================

            const order =
                await Order.findById(id)

                    .populate(
                        "customer",
                        "name email mobile"
                    )

                    .lean();


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            // ==================================================
            // RESPONSE
            // ==================================================

            return res.json({

                success: true,

                order

            });


        } catch (error) {

            console.error(
                "ADMIN ORDER DETAILS ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to load order details.",

                error:
                    error.message

            });

        }

    };


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getAdminOrders,

    getAdminOrderDetails

};