const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");

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

const tiffinControlRoutes =
    require("./routes/tiffinControlRoutes");

const tiffinPlaneRoutes =
    require("./routes/tiffinPlanRoutes");

const adminPartnerRoutes =
    require("./routes/adminPartnerRoutes");


// ======================================================
// ADMIN ROUTES
// ======================================================

const adminAuthRoutes =
    require("./routes/adminAuthRoutes");

const adminDashboardRoutes =
    require("./routes/adminDashboardRoutes");

const adminCustomerRoutes =
    require("./routes/adminCustomerRoutes");

const adminDeliveryRoutes =
    require("./routes/adminDeliveryRoutes");

const adminComplaintRoutes =
    require("./routes/adminComplaintRoutes");   
    
const adminAnalyticsRoutes =
    require("./routes/adminAnalyticsRoutes");    

// ======================================================
// ADMIN ORDER ROUTES
// ======================================================

const adminOrderRoutes =
    require("./routes/adminOrderRoutes");
    
const adminSettingsRoutes =
    require("./routes/adminSettingsRoutes");


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
// IMPORTANT: MIDDLEWARE FIRST
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
// ADMIN STATIC FILES
// ======================================================

app.use(
    "/admin-assets",
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


// ======================================================
// COOKIE PARSER
// IMPORTANT: BEFORE ROUTES
// ======================================================

app.use(
    cookieParser()
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


// ======================================================
// CUSTOMER VIEW CHECK
// ======================================================

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


// ======================================================
// RESTAURANT VIEW CHECK
// ======================================================

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


// ======================================================
// ADMIN VIEW CHECK
// ======================================================

console.log(
    "ADMIN LOGIN EXISTS:",
    fs.existsSync(
        path.join(
            __dirname,
            "views",
            "admin",
            "login.ejs"
        )
    )
);


console.log(
    "ADMIN SIGNUP EXISTS:",
    fs.existsSync(
        path.join(
            __dirname,
            "views",
            "admin",
            "signup.ejs"
        )
    )
);


console.log(
    "ADMIN DASHBOARD EXISTS:",
    fs.existsSync(
        path.join(
            __dirname,
            "views",
            "admin",
            "dashboard.ejs"
        )
    )
);


console.log(
    "ADMIN CUSTOMER EXISTS:",
    fs.existsSync(
        path.join(
            __dirname,
            "views",
            "admin",
            "customer.ejs"
        )
    )
);


console.log(
    "ADMIN DELIVERY EXISTS:",
    fs.existsSync(
        path.join(
            __dirname,
            "views",
            "admin",
            "delivery.ejs"
        )
    )
);


// ======================================================
// ADMIN ORDERS VIEW CHECK
// ======================================================

console.log(
    "ADMIN ORDERS EXISTS:",
    fs.existsSync(
        path.join(
            __dirname,
            "views",
            "admin",
            "orders.ejs"
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
// ADMIN AUTH
// ======================================================

app.use(
    "/admin",
    adminAuthRoutes
);


// ======================================================
// ADMIN PARTNER MANAGEMENT
// ======================================================

app.use(
    "/admin",
    adminPartnerRoutes
);


// ======================================================
// ADMIN DASHBOARD
// ======================================================

app.use(
    "/admin",
    adminDashboardRoutes
);


// ======================================================
// ADMIN CUSTOMER MANAGEMENT
// ======================================================

app.use(
    "/admin",
    adminCustomerRoutes
);


// ======================================================
// ADMIN ORDER MANAGEMENT
// ======================================================

app.use(
    "/admin",
    adminOrderRoutes
);

app.use(
    "/admin",
    adminComplaintRoutes
);

app.use(
    "/admin",
    adminAnalyticsRoutes
);

app.use("/admin", adminSettingsRoutes);

// ======================================================
// ADMIN DELIVERY MANAGEMENT
// ======================================================

app.use(
    "/admin",
    adminDeliveryRoutes
);

// ======================================================
// TIFFIN PLAN
// ======================================================

app.use(
    "/tiffin-seller",
    tiffinPlaneRoutes
);


// ======================================================
// TIFFIN SELLER CONTROL
// ======================================================

app.use(
    "/tiffin-seller",
    tiffinControlRoutes
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

            message:
                "GHARSETU server is running"

        });

    }
);


// ======================================================
// GLOBAL ERROR HANDLER
// IMPORTANT: BEFORE 404
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
// 404 HANDLER
// IMPORTANT: MUST BE LAST
// ======================================================

app.use(
    (req, res) => {

        res.status(404).send(
            `Cannot GET ${req.originalUrl}`
        );

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
            `📦 Tiffin Control: http://localhost:${PORT}/tiffin-seller/tiffin-control`
        );

        console.log(
            `🔐 Admin Login: http://localhost:${PORT}/admin/login`
        );

        console.log(
            `📝 Admin Signup: http://localhost:${PORT}/admin/signup`
        );

        console.log(
            `📊 Admin Dashboard: http://localhost:${PORT}/admin/dashboard`
        );

        console.log(
            `👥 Admin Customers: http://localhost:${PORT}/admin/customers`
        );

        console.log(
            `🚴 Admin Delivery: http://localhost:${PORT}/admin/delivery`
        );

        console.log(
            `📦 Admin Orders: http://localhost:${PORT}/admin/orders`
        );

        console.log(
            "======================================"
        );

    }
);