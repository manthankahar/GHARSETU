const express = require("express");

const router = express.Router();

const adminMiddleware =
    require("../middleware/adminMiddleware");

const {
    getRestaurants,
    approveRestaurant,
    rejectRestaurant,

    getTiffinSellers,
    approveTiffinSeller,
    rejectTiffinSeller
} = require("../controllers/adminPartnerController");


// ======================================================
// RESTAURANTS
// ======================================================

router.get(
    "/restaurants",
    adminMiddleware,
    getRestaurants
);


router.post(
    "/restaurants/:id/approve",
    adminMiddleware,
    approveRestaurant
);


router.post(
    "/restaurants/:id/reject",
    adminMiddleware,
    rejectRestaurant
);



// ======================================================
// TIFFIN SELLERS
// ======================================================

router.get(
    "/tiffin-sellers",
    adminMiddleware,
    getTiffinSellers
);


router.post(
    "/tiffin-sellers/:id/approve",
    adminMiddleware,
    approveTiffinSeller
);


router.post(
    "/tiffin-sellers/:id/reject",
    adminMiddleware,
    rejectTiffinSeller
);


module.exports = router;