const jwt = require("jsonwebtoken");

// =====================================
// AUTHENTICATION MIDDLEWARE
// =====================================

const authMiddleware = (req, res, next) => {
    try {

        // =====================================
        // 1. Get token from Authorization header
        // =====================================

        const authHeader = req.headers.authorization;

        let token = null;

        if (
            authHeader &&
            authHeader.startsWith("Bearer ")
        ) {
            token = authHeader.split(" ")[1];
        }

        // =====================================
        // 2. If Bearer token not found,
        //    check HTTP-only cookie
        // =====================================

        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // =====================================
        // 3. Check token exists
        // =====================================

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login."
            });
        }

        // =====================================
        // 4. Verify JWT
        // =====================================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // =====================================
        // 5. Store user information
        // =====================================

        req.user = decoded;

        // =====================================
        // 6. Continue
        // =====================================

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