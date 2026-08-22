const express = require("express");

const router = express.Router();

const {
    signup,
    login
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// =====================================
// AUTH ROUTES
// =====================================

router.post("/signup", signup);

router.post("/login", login);

// =====================================
// PROTECTED PROFILE
// =====================================

router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "You are authenticated!",
        user: req.user
    });
});

// =====================================
// ROLE TEST ROUTES
// =====================================

// Customer only
router.get(
    "/customer-test",
    authMiddleware,
    allowRoles("customer"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Customer access granted!",
            user: req.user
        });
    }
);

// Admin only
router.get(
    "/admin-test",
    authMiddleware,
    allowRoles("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Admin access granted!",
            user: req.user
        });
    }
);

module.exports = router;