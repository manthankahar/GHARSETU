// ======================================================
// TIFFIN SELLER AUTH MIDDLEWARE
// ======================================================

const jwt = require("jsonwebtoken");


// ======================================================
// AUTHENTICATE TIFFIN SELLER
// ======================================================

const tiffinSellerAuth = (req, res, next) => {

    try {

        // ==================================================
        // GET TOKEN FROM COOKIE
        // ==================================================

        let token =
            req.cookies?.tiffinSellerToken;


        // ==================================================
        // IF COOKIE TOKEN NOT FOUND
        // THEN CHECK AUTHORIZATION HEADER
        // ==================================================

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


        // ==================================================
        // TOKEN NOT FOUND
        // ==================================================

        if (!token) {

            return res.status(401).send(
                "Tiffin Seller login required"
            );

        }


        // ==================================================
        // VERIFY TOKEN
        // ==================================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // ==================================================
        // CHECK ROLE
        // ==================================================

        if (
            decoded.role !==
            "tiffinSeller"
        ) {

            return res.status(403).send(
                "Access denied"
            );

        }


        // ==================================================
        // SAVE USER DATA
        // ==================================================

        req.user = decoded;


        // ==================================================
        // NEXT
        // ==================================================

        next();


    } catch (error) {

        console.error(
            "Tiffin Seller Auth Error:",
            error
        );


        return res.status(401).send(
            "Invalid or expired Tiffin Seller token"
        );

    }

};


// ======================================================
// EXPORT
// ======================================================

module.exports =
    tiffinSellerAuth;