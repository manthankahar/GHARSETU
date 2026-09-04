const express = require("express");

const router =
    express.Router();


const adminMiddleware =
    require("../middleware/adminMiddleware");


const {
    getAnalytics
} =
    require(
        "../controllers/adminAnalyticsController"
    );


// ======================================================
// ADMIN ANALYTICS
// ======================================================

router.get(
    "/analytics",
    adminMiddleware,
    getAnalytics
);


module.exports = router;