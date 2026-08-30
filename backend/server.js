const express = require("express");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const connectDB = require("./config/db");

// ======================================================
// ROUTES
// ======================================================

const authRoutes =
    require("./routes/authRoutes");

const orderRoutes =
    require("./routes/orderRoutes");

const customerRoutes =
    require("./routes/customerRoutes");

const cartRoutes =
    require("./routes/cartRoutes");

const deliveryRoutes =
    require("./routes/deliveryRoutes");

const complaintRoutes =
    require("./routes/complaintRoutes");

const restaurantRoutes =
    require("./routes/restaurantRoutes");

const restaurantAuthRoutes =
    require("./routes/restaurantAuthRoutes");

const tiffinSellerRoutes =
    require("./routes/tiffinSellerRoutes");    

// ======================================================
// APP
// ======================================================

const app = express();

// ======================================================
// DATABASE
// ======================================================

connectDB();

// ======================================================
// MIDDLEWARE
// ======================================================

// JSON data
app.use(
    express.json()
);

// Form data
app.use(
    express.urlencoded({
        extended: true
    })
);


// ======================================================
// STATIC FRONTEND
// ======================================================

app.use(
    express.static(
        path.join(
            __dirname,
            "../frontend"
        )
    )
);

// ======================================================
// EJS CONFIGURATION
// ======================================================

app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(
        __dirname,
        "views"
    )
);

// ======================================================
// VIEW PATH CHECK
// ======================================================

console.log(
    "======================================"
);

console.log(
    "VIEWS PATH:",
    path.join(
        __dirname,
        "views"
    )
);

console.log(
    "CUSTOMER SIGNUP EXISTS:",
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
    "CUSTOMER HOME EXISTS:",
    fs.existsSync(
        path.join(
            __dirname,
            "views",
            "customer",
            "home.ejs"
        )
    )
);

console.log(
    "RESTAURANT LOGIN EXISTS:",
    fs.existsSync(
        path.join(
            __dirname,
            "views",
            "restaurant",
            "login.ejs"
        )
    )
);

console.log(
    "RESTAURANT SIGNUP EXISTS:",
    fs.existsSync(
        path.join(
            __dirname,
            "views",
            "restaurant",
            "signup.ejs"
        )
    )
);

console.log(
    "RESTAURANT DASHBOARD EXISTS:",
    fs.existsSync(
        path.join(
            __dirname,
            "views",
            "restaurant",
            "dashboard.ejs"
        )
    )
);

console.log(
    "======================================"
);

// ======================================================
// API - AUTH
// ======================================================

app.use(
    "/api/auth",
    authRoutes
);

// ======================================================
// RESTAURANT AUTH
// ======================================================

app.use(
    "/restaurant",
    restaurantAuthRoutes
);

// ======================================================
// TIFFIN SELLER
// ======================================================

app.use(
    "/tiffin-seller",
    tiffinSellerRoutes
);

// ======================================================
// RESTAURANT DASHBOARD
// ======================================================

app.use(
    "/restaurant",
    restaurantRoutes
);

// ======================================================
// API - ORDERS
// ======================================================

app.use(
    "/api/orders",
    orderRoutes
);

// ======================================================
// API - CART
// ======================================================

app.use(
    "/api/cart",
    cartRoutes
);

// ======================================================
// DELIVERY PARTNER
// ======================================================

app.use(
    "/delivery",
    deliveryRoutes
);

// ======================================================
// DELIVERY COMPLAINT
// ======================================================

app.use(
    "/delivery",
    complaintRoutes
);

// ======================================================
// CUSTOMER
// ======================================================

app.use(
    "/customer",
    customerRoutes
);

// ======================================================
// WEBSITE HOME
// ======================================================

app.get(
    "/",
    (req, res) => {

        res.redirect(
            "/customer/home"
        );

    }
);

// ======================================================
// HEALTH CHECK
// ======================================================

app.get(
    "/health",
    (req, res) => {

        res.json({
            success: true,
            message: "GHARSETU server is running"
        });

    }
);

// ======================================================
// 404 HANDLER
// IMPORTANT: THIS MUST BE LAST
// ======================================================

app.use(
    (req, res) => {

        res.status(404).send(
            `Cannot GET ${req.originalUrl}`
        );

    }
);

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "======================================"
        );

        console.error(
            "GLOBAL ERROR:"
        );

        console.error(
            err
        );

        console.error(
            "ERROR MESSAGE:",
            err.message
        );

        console.error(
            "ERROR STACK:",
            err.stack
        );

        console.error(
            "======================================"
        );


        if (res.headersSent) {
            return next(err);
        }


        res.status(500).json({

            success: false,

            message:
                "Internal Server Error",

            error:
                err.message,

            path:
                req.originalUrl

        });

    }
);

// ======================================================
// SERVER
// ======================================================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log("");

        console.log(
            "======================================"
        );

        console.log(
            "🚀 GHARSETU SERVER STARTED"
        );

        console.log(
            `🌐 http://localhost:${PORT}`
        );

        console.log(
            `👤 Customer: http://localhost:${PORT}/customer/home`
        );

        console.log(
            `🏪 Restaurant: http://localhost:${PORT}/restaurant/login`
        );

        console.log(
            `🚴 Delivery: http://localhost:${PORT}/delivery`
        );

        console.log(
    `🍱 Tiffin Seller: http://localhost:${PORT}/tiffin-seller/login`
);

console.log(
    `🚴 Delivery: http://localhost:${PORT}/delivery`
);

        console.log(
            "======================================"
        );

    }
);