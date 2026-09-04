const express =
    require("express");

const router =
    express.Router();


// ======================================================
// CONTROLLER
// ======================================================

const {

    getAdminSignup,

    signupAdmin,

    getAdminLogin,

    loginAdmin,

    logoutAdmin

} =
    require(
        "../controllers/adminAuthController"
    );


// ======================================================
// ADMIN SIGNUP PAGE
// ======================================================

router.get(
    "/signup",
    getAdminSignup
);


// ======================================================
// ADMIN SIGNUP
// ======================================================

router.post(
    "/signup",
    signupAdmin
);


// ======================================================
// ADMIN LOGIN PAGE
// ======================================================

router.get(
    "/login",
    getAdminLogin
);


// ======================================================
// ADMIN LOGIN
// ======================================================

router.post(
    "/login",
    loginAdmin
);


// ======================================================
// ADMIN LOGOUT - GET
// ======================================================

router.get(
    "/logout",
    logoutAdmin
);


// ======================================================
// ADMIN LOGOUT - POST
// ======================================================

router.post(
    "/logout",
    logoutAdmin
);


// ======================================================
// EXPORT
// ======================================================

module.exports =
    router;