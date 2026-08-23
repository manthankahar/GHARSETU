const Order = require("../models/Order");

// =====================================
// CREATE ORDER
// =====================================

const createOrder = async (req, res) => {
    try {

        const {
            items,
            deliveryDetails,
            paymentMethod,
            subtotal,
            deliveryCharge,
            total
        } = req.body;

        // Basic validation
        if (
            !items ||
            !items.length ||
            !deliveryDetails ||
            !deliveryDetails.name ||
            !deliveryDetails.mobile ||
            !deliveryDetails.address ||
            !deliveryDetails.city ||
            !deliveryDetails.pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required order details"
            });
        }

        // Create order
        const order = await Order.create({
            customer: req.user.id,

            items,

            deliveryDetails,

            paymentMethod: paymentMethod || "cod",

            subtotal,

            deliveryCharge: deliveryCharge || 20,

            total,

            status: "placed"
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        console.error("Create Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message
        });
    }
};


// =====================================
// GET MY ORDERS
// =====================================

const getMyOrders = async (req, res) => {

    try {

        const orders = await Order.find({
            customer: req.user.id
        })
            .populate("customer", "name email mobile")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        console.error("Get Orders Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};


// =====================================
// GET SINGLE ORDER
// =====================================

const getOrderById = async (req, res) => {

    try {

        const order = await Order.findOne({
            _id: req.params.id,
            customer: req.user.id
        })
            .populate("customer", "name email mobile");

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        console.error("Get Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById
};