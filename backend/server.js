const express = require("express");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const customerRoutes = require("./routes/customerRoutes");
const cartRoutes = require("./routes/cartRoutes");
const deliveryRoutes =require("./routes/deliveryRoutes");
const complaintRoutes =require("./routes/complaintRoutes");

const app = express();

// =================================
// DATABASE
// =================================

connectDB();

// =================================
// MIDDLEWARE
// =================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// =================================
// STATIC FRONTEND
// =================================

app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);

// =================================
// EJS CONFIGURATION
// =================================

app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(__dirname, "views")
);

// =================================
// VIEW PATH CHECK
// =================================

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

console.log(
    "HOME EXISTS:",
    fs.existsSync(
        path.join(
            __dirname,
            "views",
            "customer",
            "home.ejs"
        )
    )
);

// =================================
// API ROUTES
// =================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/delivery",
    deliveryRoutes
);

app.use(
    "/delivery",
    deliveryRoutes
);

app.use(
    "/delivery",
    complaintRoutes
);

// =================================
// CUSTOMER ROUTES
// =================================

app.use(
    "/customer",
    customerRoutes
);

// =================================
// HOME
// =================================

app.get("/", (req, res) => {

    res.redirect(
        "/customer/home"
    );

});

// =================================
// 404 HANDLER
// =================================

app.use((req, res) => {

    res.status(404).send(
        `Cannot GET ${req.originalUrl}`
    );

});

// =================================
// SERVER
// =================================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log(
            `🚀 GHARSETU running on http://localhost:${PORT}`
        );

    }
);