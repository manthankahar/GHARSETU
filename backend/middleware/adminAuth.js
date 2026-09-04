const jwt = require("jsonwebtoken");

// ======================================================
// ADMIN AUTH MIDDLEWARE
// ======================================================

const adminAuth = (req, res, next) => {

    try {

        // ------------------------------------------------
        // GET TOKEN FROM COOKIE
        // ------------------------------------------------

        let token = req.cookies?.adminToken;


        // ------------------------------------------------
        // FALLBACK: AUTHORIZATION HEADER
        // ------------------------------------------------

        if (!token) {

            const authHeader =
                req.headers.authorization;

            if (
                authHeader &&
                authHeader.startsWith("Bearer ")
            ) {

                token =
                    authHeader.split(" ")[1];

            }

        }


        // ------------------------------------------------
        // TOKEN NOT FOUND
        // ------------------------------------------------

        if (!token) {

            return res.redirect(
                "/admin/login"
            );

        }


        // ------------------------------------------------
        // VERIFY TOKEN
        // ------------------------------------------------

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // ------------------------------------------------
        // CHECK ADMIN ROLE
        // ------------------------------------------------

        if (
            !decoded ||
            decoded.role !== "admin"
        ) {

            res.clearCookie(
                "adminToken"
            );

            return res.redirect(
                "/admin/login"
            );

        }


        // ------------------------------------------------
        // SAVE ADMIN DATA
        // ------------------------------------------------

        req.user = decoded;


        // ------------------------------------------------
        // NEXT
        // ------------------------------------------------

        next();

    } catch (error) {

        console.error(
            "ADMIN AUTH ERROR:",
            error.message
        );


        // Invalid / expired token
        res.clearCookie(
            "adminToken"
        );


        return res.redirect(
            "/admin/login"
        );

    }

};


// ======================================================
// EXPORT
// ======================================================

module.exports = adminAuth;