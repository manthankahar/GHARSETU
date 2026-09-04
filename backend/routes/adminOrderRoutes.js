const express = require("express");

const router = express.Router();

const adminMiddleware =
    require("../middleware/adminMiddleware");

const {
    getAdminOrders,
    getAdminOrderDetails
} = require("../controllers/adminOrderController");


// ======================================================
// ADMIN - ALL ORDERS
// ======================================================

router.get(
    "/orders",
    adminMiddleware,
    getAdminOrders
);


// ======================================================
// ADMIN - ORDER DETAILS
// ======================================================

router.get(
    "/orders/:id",
    adminMiddleware,
    getAdminOrderDetails
);


// ======================================================
// EXPORT
// ======================================================

module.exports = router;