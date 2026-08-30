const jwt = require("jsonwebtoken");

// ======================================================
// TIFFIN SELLER AUTH MIDDLEWARE
// ======================================================

function tiffinSellerAuth(req, res, next) {

    try {

        // ==========================================
        // GET TOKEN
        // ==========================================

        const authHeader =
            req.headers.authorization;

        let token = null;


        // ------------------------------------------
        // Bearer Token
        // ------------------------------------------

        if (
            authHeader &&
            authHeader.startsWith("Bearer ")
        ) {

            token =
                authHeader.split(" ")[1];

        }


        // ------------------------------------------
        // Token from Cookie / Session
        // ------------------------------------------

        if (!token && req.cookies) {

            token =
                req.cookies.tiffinSellerToken;

        }


        // ==========================================
        // TOKEN CHECK
        // ==========================================

        if (!token) {

            // API request
            if (
                req.headers.accept &&
                req.headers.accept.includes(
                    "application/json"
                )
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Authentication required"

                });

            }


            // Normal browser request
            return res.redirect(
                "/tiffin-seller/login"
            );

        }


        // ==========================================
        // VERIFY TOKEN
        // ==========================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // ==========================================
        // CHECK ROLE
        // ==========================================

        if (
            decoded.role &&
            decoded.role !== "tiffin_seller" &&
            decoded.role !== "tiffinSeller"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Access denied. Tiffin seller only."

            });

        }


        // ==========================================
        // SAVE USER DATA
        // ==========================================

        req.user = decoded;


        // ==========================================
        // NEXT
        // ==========================================

        next();


    } catch (error) {

        console.error(
            "Tiffin Seller Auth Error:",
            error.message
        );


        // ------------------------------------------
        // API REQUEST
        // ------------------------------------------

        if (
            req.headers.accept &&
            req.headers.accept.includes(
                "application/json"
            )
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid or expired token"

            });

        }


        // ------------------------------------------
        // NORMAL REQUEST
        // ------------------------------------------

        return res.redirect(
            "/tiffin-seller/login"
        );

    }

}


// ======================================================
// EXPORT
// ======================================================

module.exports = tiffinSellerAuth;