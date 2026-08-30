const express = require("express");

const router = express.Router();

const {
    registerTiffinSeller,
    loginTiffinSeller
} = require(
    "../controllers/tiffinSellerController"
);


// ======================================================
// LOGIN PAGE
// ======================================================

router.get(
    "/login",
    (req, res) => {

        res.render(
            "tiffinSeller/login"
        );

    }
);


// ======================================================
// REGISTER PAGE
// ======================================================

router.get(
    "/register",
    (req, res) => {

        res.render(
            "tiffinSeller/register"
        );

    }
);


// ======================================================
// REGISTER REQUEST
// ======================================================

router.post(
    "/register",
    registerTiffinSeller
);


// ======================================================
// LOGIN
// ======================================================

router.post(
    "/login",
    loginTiffinSeller
);


module.exports = router;