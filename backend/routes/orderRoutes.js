const express = require("express");

const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrderById
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");


// =====================================
// CREATE ORDER
// =====================================

router.post(
    "/",
    authMiddleware,
    createOrder
);


// =====================================
// GET MY ORDERS
// =====================================

router.get(
    "/my-orders",
    authMiddleware,
    getMyOrders
);


// =====================================
// GET SINGLE ORDER
// =====================================

router.get(
    "/:id",
    authMiddleware,
    getOrderById
);


module.exports = router;