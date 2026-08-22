// =====================================
// ROLE AUTHORIZATION MIDDLEWARE
// =====================================

const allowRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check authentication
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            // Check user role
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. You are not authorized."
                });
            }

            // Role allowed
            next();

        } catch (error) {
            console.error("Role Middleware Error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Authorization error"
            });
        }
    };
};

module.exports = allowRoles;