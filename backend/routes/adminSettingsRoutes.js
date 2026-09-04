const express = require("express");

const router = express.Router();

const {
    getAdminSettings,
    updateAdminProfile,
    changeAdminPassword
} = require("../controllers/adminSettingsController");

const adminMiddleware = require("../middleware/adminMiddleware");


// ==========================================
// ADMIN SETTINGS PAGE
// ==========================================
router.get(
    "/settings",
    adminMiddleware,
    getAdminSettings
);


// ==========================================
// UPDATE ADMIN PROFILE
// ==========================================
router.post(
    "/settings/profile",
    adminMiddleware,
    updateAdminProfile
);


// ==========================================
// CHANGE ADMIN PASSWORD
// ==========================================
router.post(
    "/settings/password",
    adminMiddleware,
    changeAdminPassword
);


module.exports = router;