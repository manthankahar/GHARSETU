const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const Order = require("./models/Order");

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
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/orders", orderRoutes);

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
// CUSTOMER ORDERS PAGE
// ===============================

app.get("/customer/orders", async (req, res) => {
    try {
        const Order = require("./models/Order");

        const orders = await Order.find()
            .populate("customer", "name email mobile")
            .sort({ createdAt: -1 });

        res.render("customer/orders", {
            orders
        });

    } catch (error) {
        console.error("Orders Page Error:", error);
        res.status(500).send("Failed to load orders");
    }
});

// ===============================
// CUSTOMER ORDER DETAILS PAGE
// ===============================

app.get("/customer/orders/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("customer", "name email mobile");

        if (!order) {
            return res.status(404).send("Order not found");
        }

        res.render("customer/orderDetails", { order });

    } catch (error) {
        console.error("Order Details Error:", error);
        res.status(500).send("Server Error");
    }
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

