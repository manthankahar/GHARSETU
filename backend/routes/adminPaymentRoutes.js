const express = require("express");

const router = express.Router();

const {
    getAdminPayments,
    getAdminPaymentDetails
} = require("../controllers/adminPaymentController");

const adminMiddleware = require("../middleware/adminMiddleware");


// ========================================
// ADMIN PAYMENTS PAGE
// ========================================

router.get(
    "/payments",
    adminMiddleware,
    getAdminPayments
);


// ========================================
// SINGLE PAYMENT DETAILS
// ========================================

router.get(
    "/payments/:id",
    adminMiddleware,
    getAdminPaymentDetails
);


module.exports = router;