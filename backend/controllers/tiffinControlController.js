// ======================================================
// TIFFIN CONTROL CONTROLLER
// ======================================================

const TiffinOrder = require("../models/TiffinOrder");
const TiffinSeller = require("../models/TiffinSeller");


// ======================================================
// GET TIFFIN CONTROL PAGE
// ======================================================

exports.getTiffinControl = async (req, res) => {

    try {

        // --------------------------------------------------
        // SELLER ID
        // --------------------------------------------------

        const sellerId =
            req.user?.id ||
            req.user?._id;


        if (!sellerId) {

            return res.status(401).send(
                "Tiffin Seller login required"
            );

        }


        // --------------------------------------------------
        // SELLER
        // --------------------------------------------------

        const seller =
            await TiffinSeller.findById(
                sellerId
            );


        if (!seller) {

            return res.status(404).send(
                "Tiffin Seller not found"
            );

        }


        // --------------------------------------------------
        // SEARCH
        // --------------------------------------------------

        const search =
            req.query.search
                ? req.query.search.trim()
                : "";


        // --------------------------------------------------
        // STATUS FILTER
        // --------------------------------------------------

        const status =
            req.query.status
                ? req.query.status.trim()
                : "all";


        // --------------------------------------------------
        // QUERY
        // --------------------------------------------------

        const query = {

            seller: sellerId

        };


        // --------------------------------------------------
        // STATUS FILTER
        // --------------------------------------------------

        if (
            status !== "all" &&
            status !== ""
        ) {

            const allowedStatuses = [

                "new",
                "packed",
                "dispatched",
                "delivered",
                "cancelled"

            ];


            if (
                allowedStatuses.includes(status)
            ) {

                query.status = status;

            }

        }


        // --------------------------------------------------
        // SEARCH
        // --------------------------------------------------

        if (search) {

            query.$or = [

                {
                    tiffinName: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    customerMobile: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    deliveryAddress: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ];

        }


        // --------------------------------------------------
        // GET ORDERS
        // --------------------------------------------------

        const orders =
            await TiffinOrder.find(query)

                .populate(
                    "customer",
                    "name mobile email"
                )

                .populate(
                    "plan",
                    "name type price"
                )

                .sort({

                    createdAt: -1

                });


        // --------------------------------------------------
        // COUNTS
        // --------------------------------------------------

        const totalOrders =
            await TiffinOrder.countDocuments({

                seller: sellerId

            });


        const newOrders =
            await TiffinOrder.countDocuments({

                seller: sellerId,

                status: "new"

            });


        const packedOrders =
            await TiffinOrder.countDocuments({

                seller: sellerId,

                status: "packed"

            });


        const dispatchedOrders =
            await TiffinOrder.countDocuments({

                seller: sellerId,

                status: "dispatched"

            });


        const deliveredOrders =
            await TiffinOrder.countDocuments({

                seller: sellerId,

                status: "delivered"

            });


        const cancelledOrders =
            await TiffinOrder.countDocuments({

                seller: sellerId,

                status: "cancelled"

            });


        // --------------------------------------------------
        // TOTAL EARNING
        // ONLY DELIVERED ORDERS
        // --------------------------------------------------

        const earningData =
            await TiffinOrder.aggregate([

                {

                    $match: {

                        seller:
                            seller._id,

                        status:
                            "delivered"

                    }

                },

                {

                    $group: {

                        _id: null,

                        total: {

                            $sum: "$amount"

                        }

                    }

                }

            ]);


        const totalEarning =
            earningData.length > 0
                ? earningData[0].total
                : 0;


        // --------------------------------------------------
        // RENDER
        // --------------------------------------------------

        return res.render(

            "tiffinSeller/tiffinControl",

            {

                seller,

                orders,

                totalOrders,

                newOrders,

                packedOrders,

                dispatchedOrders,

                deliveredOrders,

                cancelledOrders,

                totalEarning,

                search,

                status

            }

        );


    } catch (error) {

        console.error(
            "Tiffin Control Error:",
            error
        );


        return res.status(500).send(
            "Failed to load Tiffin Control"
        );

    }

};


// ======================================================
// UPDATE TIFFIN ORDER STATUS
// ======================================================

exports.updateTiffinOrderStatus = async (
    req,
    res
) => {

    try {

        // --------------------------------------------------
        // SELLER ID
        // --------------------------------------------------

        const sellerId =
            req.user?.id ||
            req.user?._id;


        if (!sellerId) {

            return res.status(401).json({

                success: false,

                message:
                    "Tiffin Seller login required"

            });

        }


        // --------------------------------------------------
        // ORDER ID + STATUS
        // --------------------------------------------------

        const {
            orderId
        } = req.params;


        const {
            status
        } = req.body;


        // --------------------------------------------------
        // VALID STATUS
        // --------------------------------------------------

        const allowedStatuses = [

            "new",
            "packed",
            "dispatched",
            "delivered",
            "cancelled"

        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid order status"

            });

        }


        // --------------------------------------------------
        // FIND ORDER
        // --------------------------------------------------

        const order =
            await TiffinOrder.findOne({

                _id: orderId,

                seller: sellerId

            });


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Tiffin order not found"

            });

        }


        // --------------------------------------------------
        // UPDATE STATUS
        // --------------------------------------------------

        order.status =
            status;


        // --------------------------------------------------
        // STATUS DATES
        // --------------------------------------------------

        if (
            status === "packed"
        ) {

            order.packedAt =
                new Date();

        }


        if (
            status === "dispatched"
        ) {

            order.dispatchedAt =
                new Date();

        }


        if (
            status === "delivered"
        ) {

            order.deliveredAt =
                new Date();


            // CASH ORDER PAYMENT
            if (
                order.paymentMethod ===
                "cash"
            ) {

                order.paymentStatus =
                    "paid";

            }

        }


        // --------------------------------------------------
        // SAVE
        // --------------------------------------------------

        await order.save();


        // --------------------------------------------------
        // SUCCESS
        // --------------------------------------------------

        return res.json({

            success: true,

            message:
                `Order status updated to ${status}`,

            order

        });


    } catch (error) {

        console.error(
            "Update Tiffin Order Status Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to update order status",

            error:
                error.message

        });

    }

};


// ======================================================
// GET SINGLE TIFFIN ORDER DETAILS
// ======================================================

exports.getTiffinOrderDetails = async (
    req,
    res
) => {

    try {

        // --------------------------------------------------
        // SELLER ID
        // --------------------------------------------------

        const sellerId =
            req.user?.id ||
            req.user?._id;


        if (!sellerId) {

            return res.status(401).send(
                "Tiffin Seller login required"
            );

        }


        // --------------------------------------------------
        // ORDER ID
        // --------------------------------------------------

        const {
            orderId
        } = req.params;


        // --------------------------------------------------
        // FIND ORDER
        // --------------------------------------------------

        const order =
            await TiffinOrder.findOne({

                _id: orderId,

                seller: sellerId

            })

            .populate(
                "customer",
                "name mobile email"
            )

            .populate(
                "plan",
                "name type price description meals"
            );


        if (!order) {

            return res.status(404).send(
                "Tiffin order not found"
            );

        }


        // --------------------------------------------------
        // SELLER
        // --------------------------------------------------

        const seller =
            await TiffinSeller.findById(
                sellerId
            );


        // --------------------------------------------------
        // RENDER
        // --------------------------------------------------

        return res.render(

            "tiffinSeller/tiffinOrderDetails",

            {

                seller,

                order

            }

        );


    } catch (error) {

        console.error(
            "Tiffin Order Details Error:",
            error
        );


        return res.status(500).send(
            "Failed to load order details"
        );

    }

};


// ======================================================
// EXPORT COMPLETE
// ======================================================