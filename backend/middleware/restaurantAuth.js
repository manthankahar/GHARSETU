const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");

function getToken(req) {

    const cookieHeader =
        req.headers.cookie || "";

    const cookies =
        cookieHeader
            .split(";")
            .reduce(
                (result, item) => {

                    const parts =
                        item.trim().split("=");

                    if (parts.length >= 2) {

                        result[parts[0]] =
                            parts
                                .slice(1)
                                .join("=");

                    }

                    return result;

                },
                {}
            );

    return cookies.restaurantToken || null;
}


// ==========================================
// RESTAURANT AUTH
// ==========================================

async function restaurantAuth(
    req,
    res,
    next
) {

    try {

        const token =
            getToken(req);

        if (!token) {

            return res.redirect(
                "/restaurant/login"
            );

        }

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        if (
            !decoded ||
            decoded.role !==
                "restaurant"
        ) {

            return res.redirect(
                "/restaurant/login"
            );

        }

        const restaurant =
            await Restaurant.findById(
                decoded.restaurantId
            );

        if (!restaurant) {

            return res.redirect(
                "/restaurant/login"
            );

        }

        if (
            restaurant.approvalStatus !==
            "approved"
        ) {

            res.clearCookie(
                "restaurantToken"
            );

            return res.redirect(
                "/restaurant/login"
            );

        }

        req.restaurant =
            restaurant;

        req.restaurantId =
            restaurant._id;

        req.restaurantUserId =
            restaurant.owner;

        next();

    } catch (error) {

        console.error(
            "Restaurant Auth Error:",
            error
        );

        res.clearCookie(
            "restaurantToken"
        );

        return res.redirect(
            "/restaurant/login"
        );

    }
}


module.exports =
    restaurantAuth;