const jwt = require("jsonwebtoken");

// =====================================
// AUTHENTICATION MIDDLEWARE
// =====================================

const authMiddleware = (req, res, next) => {
    try {

        // Get Authorization header
        const authHeader = req.headers.authorization;

        // Check token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login."
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store user information
        req.user = decoded;

        // Continue
        next();

    } catch (error) {

        console.error(
            "Auth Middleware Error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;