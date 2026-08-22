const express = require("express");

const router = express.Router();


// =================================
// CUSTOMER LOGIN PAGE
// =================================

router.get("/login", (req, res) => {
    res.render("customer/login");
});


// =================================
// CUSTOMER SIGNUP PAGE
// =================================

router.get("/signup", (req, res) => {
    res.render("customer/signup");
});


module.exports = router;