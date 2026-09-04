const express = require("express");

const router = express.Router();


// ======================================================
// ADMIN MIDDLEWARE
// ======================================================

const adminMiddleware =
    require("../middleware/adminMiddleware");


// ======================================================
// CONTROLLER
// ======================================================

const {
    getDeliveryPartners,
    getDeliveryPartnerDetails,
    toggleDeliveryPartnerStatus
} =
    require(
        "../controllers/adminDeliveryController"
    );


// ======================================================
// DELIVERY PARTNER MANAGEMENT
// ======================================================

router.get(
    "/delivery",
    adminMiddleware,
    getDeliveryPartners
);


// ======================================================
// DELIVERY PARTNER DETAILS
// ======================================================

router.get(
    "/delivery/:id",
    adminMiddleware,
    getDeliveryPartnerDetails
);


// ======================================================
// ACTIVATE / DEACTIVATE
// ======================================================

router.post(
    "/delivery/:id/toggle-status",
    adminMiddleware,
    toggleDeliveryPartnerStatus
);


// ======================================================
// EXPORT
// ======================================================

module.exports = router;