const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ===============================
// DATABASE
// ===============================

connectDB();

// ===============================
// MIDDLEWARE
// ===============================

// JSON body read karva mate
app.use(express.json());

// Form data read karva mate
app.use(express.urlencoded({ extended: true }));

// Static frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// ===============================
// EJS
// ===============================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===============================
// VIEW PATH CHECK
// ===============================

console.log(
    "VIEWS PATH:",
    path.join(__dirname, "views")
);

console.log(
    "SIGNUP EXISTS:",
    fs.existsSync(
        path.join(
            __dirname,
            "views",
            "customer",
            "signup.ejs"
        )
    )
);

// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);

// Customer Signup Page
app.get("/customer/signup", (req, res) => {
    res.render("customer/signup");
});


// ===============================
// CUSTOMER PAGES
// ===============================

app.get("/customer/tiffins", (req, res) => {
    res.render("customer/tiffins");
});

// customer login page
const customerRoutes = require("./routes/customerRoutes");

app.use("/customer", customerRoutes);

// ===============================
// TIFFIN DETAILS
// ===============================

app.get("/customer/tiffins/:id", (req, res) => {

    const tiffinId = req.params.id;

    res.render("customer/tiffinDetails", {
        tiffinId: tiffinId
    });

});

// ===============================
// CUSTOMER CART PAGE
// ===============================

app.get("/customer/cart", (req, res) => {
    res.render("customer/cart");
});

// ===============================
// CUSTOMER CHECKOUT PAGE
// ===============================

app.get("/customer/checkout", (req, res) => {
    res.render("customer/checkout");
});

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.send("🍱 TIFFIN APP SERVER RUNNING...");
});

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `🚀 TIFFIN APP running on http://localhost:${PORT}`
    );
});

