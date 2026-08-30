const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");
const Restaurant = require("../models/Restaurant");

// ==========================================
// SEND APPROVAL EMAIL
// ==========================================

async function sendApprovalEmail(email, restaurantName) {
    try {

        if (
            !process.env.EMAIL_USER ||
            !process.env.EMAIL_PASS
        ) {
            console.log(
                "EMAIL_USER / EMAIL_PASS not configured."
            );
            return;
        }

        const nodemailer = require("nodemailer");

        const transporter =
            nodemailer.createTransport({
                service: "gmail",

                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

        const appUrl =
            process.env.APP_URL ||
            "http://localhost:5000";

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: email,

            subject:
                "GharSetu Restaurant Approved",

            html: `
                <div style="
                    font-family: Arial;
                    padding: 30px;
                    max-width: 600px;
                    margin: auto;
                ">

                    <h2>
                        🎉 Welcome to GharSetu
                    </h2>

                    <p>
                        Hello
                        <strong>${restaurantName}</strong>,
                    </p>

                    <p>
                        Your restaurant registration
                        has been approved successfully.
                    </p>

                    <p>
                        You can now login to your
                        GharSetu Restaurant Dashboard.
                    </p>

                    <a
                        href="${appUrl}/restaurant/login"
                        style="
                            display: inline-block;
                            padding: 12px 20px;
                            background: #111;
                            color: white;
                            text-decoration: none;
                            border-radius: 8px;
                        "
                    >
                        Login to Restaurant
                    </a>

                    <p>
                        Thank you for joining GharSetu.
                    </p>

                </div>
            `
        });

        console.log(
            "Restaurant approval email sent."
        );

    } catch (error) {

        console.error(
            "Approval Email Error:",
            error
        );

    }
}


// ==========================================
// RESTAURANT SIGNUP PAGE
// ==========================================

router.get(
    "/signup",
    (req, res) => {

        res.render(
            "restaurant/signup"
        );

    }
);


// ==========================================
// RESTAURANT SIGNUP
// ==========================================

router.post(
    "/signup",
    async (req, res) => {

        try {

            const {
                name,
                mobile,
                email,
                address,
                password
            } = req.body;


            // ==================================
            // VALIDATION
            // ==================================

            if (
                !name ||
                !mobile ||
                !email ||
                !address ||
                !password
            ) {

                return res.status(400).send(
                    "All fields are required."
                );

            }


            if (
                name.trim().length < 2
            ) {

                return res.status(400).send(
                    "Please enter a valid restaurant name."
                );

            }


            if (
                !/^\d{10}$/.test(
                    mobile.trim()
                )
            ) {

                return res.status(400).send(
                    "Please enter a valid 10-digit mobile number."
                );

            }


            if (
                password.length < 6
            ) {

                return res.status(400).send(
                    "Password must be at least 6 characters."
                );

            }


            // ==================================
            // CHECK EXISTING USER
            // ==================================

            const cleanEmail =
                email
                    .trim()
                    .toLowerCase();

            const cleanMobile =
                mobile.trim();


            const existingUser =
                await User.findOne({

                    $or: [

                        {
                            email:
                                cleanEmail
                        },

                        {
                            mobile:
                                cleanMobile
                        }

                    ]

                });


            if (existingUser) {

                return res.status(400).send(
                    "Email or mobile already registered."
                );

            }


            // ==================================
            // HASH PASSWORD
            // ==================================

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // ==================================
            // CREATE USER
            // ==================================

            const user =
                await User.create({

                    name:
                        name.trim(),

                    email:
                        cleanEmail,

                    mobile:
                        cleanMobile,

                    password:
                        hashedPassword,

                    role:
                        "restaurant",

                    isActive:
                        true

                });


            // ==================================
            // CREATE RESTAURANT
            // ==================================

            await Restaurant.create({

                owner:
                    user._id,

                restaurantName:
                    name.trim(),

                email:
                    cleanEmail,

                mobile:
                    cleanMobile,

                address:
                    address.trim(),

                approvalStatus:
                    "pending"

            });


            // ==================================
            // SUCCESS
            // ==================================

            return res.send(`

                <!DOCTYPE html>

                <html>

                <head>

                    <title>
                        GharSetu - Registration
                    </title>

                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    >

                </head>

                <body
                    style="
                        font-family: Arial;
                        text-align: center;
                        padding: 60px 20px;
                    "
                >

                    <h1>
                        Registration Successful 🎉
                    </h1>

                    <h2>
                        Your restaurant is under verification.
                    </h2>

                    <p>
                        Our team will review your
                        restaurant within 24 hours.
                    </p>

                    <p>
                        Once approved, you will receive
                        a confirmation email.
                    </p>

                    <br>

                    <a href="/restaurant/login">
                        Go to Restaurant Login
                    </a>

                </body>

                </html>

            `);

        } catch (error) {

            console.error(
                "Restaurant Signup Error:",
                error
            );

            return res.status(500).send(
                "Restaurant signup failed."
            );

        }

    }
);


// ==========================================
// RESTAURANT LOGIN PAGE
// ==========================================

router.get(
    "/login",
    (req, res) => {

        res.render(
            "restaurant/login"
        );

    }
);


// ==========================================
// RESTAURANT LOGIN
// MOBILE + PASSWORD
// ==========================================

router.post(
    "/login",
    async (req, res) => {

        try {

            const {
                mobile,
                password
            } = req.body;


            // ==================================
            // VALIDATION
            // ==================================

            if (
                !mobile ||
                !password
            ) {

                return res.status(400).send(
                    "Mobile number and password are required."
                );

            }


            if (
                !/^\d{10}$/.test(
                    mobile.trim()
                )
            ) {

                return res.status(400).send(
                    "Please enter a valid 10-digit mobile number."
                );

            }


            // ==================================
            // FIND RESTAURANT USER
            // ==================================

            const user =
                await User.findOne({

                    mobile:
                        mobile.trim(),

                    role:
                        "restaurant"

                });


            if (!user) {

                return res.status(401).send(
                    "Invalid mobile number or password."
                );

            }


            // ==================================
            // PASSWORD CHECK
            // ==================================

            const validPassword =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!validPassword) {

                return res.status(401).send(
                    "Invalid mobile number or password."
                );

            }


            // ==================================
            // FIND RESTAURANT
            // ==================================

            const restaurant =
                await Restaurant.findOne({

                    owner:
                        user._id

                });


            if (!restaurant) {

                return res.status(404).send(
                    "Restaurant profile not found."
                );

            }


            // ==================================
            // PENDING
            // ==================================

            if (
                restaurant.approvalStatus ===
                "pending"
            ) {

                return res.send(`

                    <script>

                        alert(
                            "Your restaurant is still under verification. Please wait up to 24 hours."
                        );

                        window.location.href =
                            "/restaurant/login";

                    </script>

                `);

            }


            // ==================================
            // REJECTED
            // ==================================

            if (
                restaurant.approvalStatus ===
                "rejected"
            ) {

                const reason =
                    restaurant.rejectedReason ||
                    "Your restaurant registration was rejected.";


                return res.send(`

                    <script>

                        alert(
                            ${JSON.stringify(reason)}
                        );

                        window.location.href =
                            "/restaurant/login";

                    </script>

                `);

            }


            // ==================================
            // APPROVED CHECK
            // ==================================

            if (
                restaurant.approvalStatus !==
                "approved"
            ) {

                return res.status(403).send(
                    "Restaurant approval is required."
                );

            }


            // ==================================
            // JWT
            // ==================================

            const token =
                jwt.sign(

                    {
                        userId:
                            user._id.toString(),

                        restaurantId:
                            restaurant._id.toString(),

                        role:
                            "restaurant"

                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn:
                            "7d"
                    }

                );


            // ==================================
            // COOKIE
            // ==================================

            res.cookie(
                "restaurantToken",
                token,
                {

                    httpOnly: true,

                    sameSite: "lax",

                    maxAge:
                        7 *
                        24 *
                        60 *
                        60 *
                        1000

                }
            );


            // ==================================
            // DASHBOARD
            // ==================================

            return res.redirect(
                "/restaurant/dashboard"
            );


        } catch (error) {

            console.error(
                "Restaurant Login Error:",
                error
            );

            return res.status(500).send(
                "Restaurant login failed."
            );

        }

    }
);


// ==========================================
// LOGOUT
// ==========================================

router.get(
    "/logout",
    (req, res) => {

        res.clearCookie(
            "restaurantToken"
        );

        res.redirect(
            "/restaurant/login"
        );

    }
);


// ==========================================
// ADMIN APPROVE
// ==========================================

router.post(
    "/admin/:id/approve",
    async (req, res) => {

        try {

            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid restaurant ID."

                });

            }


            const restaurant =
                await Restaurant.findById(
                    req.params.id
                );


            if (!restaurant) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Restaurant not found."

                });

            }


            restaurant.approvalStatus =
                "approved";

            restaurant.approvedAt =
                new Date();

            restaurant.rejectedAt =
                null;

            restaurant.rejectedReason =
                "";


            await restaurant.save();


            await sendApprovalEmail(
                restaurant.email,
                restaurant.restaurantName
            );


            return res.json({

                success: true,

                message:
                    "Restaurant approved successfully."

            });


        } catch (error) {

            console.error(
                "Approve Restaurant Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to approve restaurant."

            });

        }

    }
);


// ==========================================
// ADMIN REJECT
// ==========================================

router.post(
    "/admin/:id/reject",
    async (req, res) => {

        try {

            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid restaurant ID."

                });

            }


            const restaurant =
                await Restaurant.findById(
                    req.params.id
                );


            if (!restaurant) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Restaurant not found."

                });

            }


            restaurant.approvalStatus =
                "rejected";

            restaurant.rejectedAt =
                new Date();

            restaurant.rejectedReason =
                req.body.reason ||
                "Not approved";


            await restaurant.save();


            return res.json({

                success: true,

                message:
                    "Restaurant rejected."

            });


        } catch (error) {

            console.error(
                "Reject Restaurant Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to reject restaurant."

            });

        }

    }
);


// ==========================================
// EXPORT
// ==========================================

module.exports = router;