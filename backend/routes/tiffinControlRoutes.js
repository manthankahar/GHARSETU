// ======================================================
// TIFFIN CONTROL ROUTES
// ======================================================

const express = require("express");

const router = express.Router();


// ======================================================
// AUTH MIDDLEWARE
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

} = require("../controllers/tiffinControlController");


// ======================================================
// TIFFIN CONTROL PAGE
// ======================================================

router.get(

    "/tiffin-control",

    tiffinSellerAuth,

    getTiffinControl

);


// ======================================================
// ORDER DETAILS
// ======================================================

router.get(

    "/tiffin-order/:orderId",

    tiffinSellerAuth,

    getTiffinOrderDetails

);


// ======================================================
// UPDATE ORDER STATUS
// ======================================================

router.post(

    "/tiffin-order/:orderId/status",

    tiffinSellerAuth,

    updateTiffinOrderStatus

);


// ======================================================
// EXPORT
// ======================================================

module.exports = router;