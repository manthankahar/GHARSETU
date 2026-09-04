const express = require("express");
const router = express.Router();

const {
    getAdminDashboard
} = require("../controllers/adminDashboardController");

const adminMiddleware =
    require("../middleware/adminMiddleware");

router.get(
    "/dashboard",
    adminMiddleware,
    getAdminDashboard
);

module.exports = router;