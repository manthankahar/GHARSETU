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
        // STATUS
        // --------------------------------------------------

        if (
            status !== "all" &&
            status !== ""
        ) {

            query.status = status;

        }


        // --------------------------------------------------
        // SEARCH
        // --------------------------------------------------

        if (search) {

            query.$or = [

                {
                    orderNumber: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    tiffinType: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ];

        }


        // --------------------------------------------------
        // ORDERS
        // --------------------------------------------------

        const orders =
            await TiffinOrder.find(query)

                .populate(
                    "customer",
                    "name mobile"
                )

                .sort({
                    createdAt: -1
                });


        // --------------------------------------------------
        // COUNTS
        // --------------------------------------------------

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


        // --------------------------------------------------
        // RENDER
        // --------------------------------------------------

        res.render(

            "tiffinSeller/tiffinControl",

            {

                seller,

                orders,

                newOrders,

                packedOrders,

                dispatchedOrders,

                deliveredOrders,

                search,

                status

            }

        );


    } catch (error) {

        console.error(
            "Tiffin Control Error:",
            error
        );

        res.status(500).send(
            "Failed to load Tiffin Control"
        );

    }

};


// ======================================================
// UPDATE ORDER STATUS
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
        // ORDER ID
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

            "delivered"

        ];


        if (
            !allowedStatuses.includes(
                status
            )
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


        await order.save();


        // --------------------------------------------------
        // SUCCESS
        // --------------------------------------------------

        res.json({

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

        res.status(500).json({

            success: false,

            message:
                "Failed to update order status",

            error:
                error.message

        });

    }

};


// ======================================================
// GET SINGLE TIFFIN ORDER
// ======================================================

exports.getTiffinOrderDetails = async (
    req,
    res
) => {

    try {

        const sellerId =
            req.user?.id ||
            req.user?._id;


        if (!sellerId) {

            return res.status(401).send(
                "Tiffin Seller login required"
            );

        }


        const {
            orderId
        } = req.params;


        const order =
            await TiffinOrder.findOne({

                _id: orderId,

                seller: sellerId

            })

            .populate(
                "customer",
                "name mobile email"
            );


        if (!order) {

            return res.status(404).send(
                "Tiffin order not found"
            );

        }


        res.render(

            "tiffinSeller/tiffinOrderDetails",

            {

                order

            }

        );


    } catch (error) {

        console.error(
            "Tiffin Order Details Error:",
            error
        );

        res.status(500).send(
            "Failed to load order details"
        );

    }

};


// ======================================================
// EXPORT COMPLETE
// ======================================================