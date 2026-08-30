const jwt = require("jsonwebtoken");

// =====================================
// DELIVERY AUTH MIDDLEWARE
// =====================================

const deliveryAuth = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Delivery authentication required."
            });
        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        // Delivery partner only
        if (
            !decoded ||
            decoded.role !== "delivery"
        ) {
            return res.status(403).json({
                success: false,
                message: "Delivery partner access required."
            });
        }

        // JWT user information
        req.user = decoded;

        next();

    } catch (error) {

        console.error(
            "Delivery Auth Error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired delivery token."
        });
    }
};

module.exports = deliveryAuth;