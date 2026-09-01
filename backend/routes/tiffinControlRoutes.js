// ======================================================
// TIFFIN CONTROL ROUTES
// ======================================================

const express = require("express");

const router = express.Router();


// ======================================================
// TIFFIN SELLER AUTH
// ======================================================

const tiffinSellerAuth =
    require("../middleware/tiffinSellerAuth");


// ======================================================
// CONTROLLER
// ======================================================

const {

    getTiffinControl,

    updateTiffinOrderStatus,

    getTiffinOrderDetails

} = require(
    "../controllers/tiffinControlController"
);


// ======================================================
// TIFFIN CONTROL PAGE
// ======================================================

router.get(

    "/tiffin-control",

    tiffinSellerAuth,

    getTiffinControl

);


// ======================================================
// TIFFIN ORDER DETAILS
// ======================================================

router.get(

    "/tiffin-order/:orderId",

    tiffinSellerAuth,

    getTiffinOrderDetails

);


// ======================================================
// UPDATE TIFFIN ORDER STATUS
// ======================================================

router.post(

    "/tiffin-order/:orderId/status",

    tiffinSellerAuth,

    updateTiffinOrderStatus

);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;