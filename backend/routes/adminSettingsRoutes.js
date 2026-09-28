const express = require("express");

const router = express.Router();

const {
    getAdminSettings,
    getAdminProfile,
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
// ADMIN PROFILE PAGE
// ==========================================
router.get(
    "/profile",
    adminMiddleware,
    getAdminProfile
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