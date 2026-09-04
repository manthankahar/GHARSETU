const express = require("express");

const router = express.Router();

const adminMiddleware =
    require("../middleware/adminMiddleware");

const {
    getCustomers,
    getCustomerDetails,
    toggleCustomerStatus
} = require("../controllers/adminCustomerController");


router.get(
    "/customers",
    adminMiddleware,
    getCustomers
);


router.get(
    "/customers/:id",
    adminMiddleware,
    getCustomerDetails
);


router.post(
    "/customers/:id/toggle-status",
    adminMiddleware,
    toggleCustomerStatus
);


module.exports = router;