const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const User = require("../models/user");
const Restaurant = require("../models/Restaurant");
const OTP = require("../models/OTP");


// ======================================================
// CONFIG
// ======================================================

const OTP_EXPIRY_MINUTES = 10;
const OTP_RESEND_SECONDS = 60;

const OTP_COOKIE_NAME = "restaurantSignupVerified";


// ======================================================
// CONTACT DETECTION
// ======================================================

function detectContact(contact) {

    if (!contact) {
        return null;
    }

    const value = contact.trim();

    // EMAIL
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(value)) {

        return {
            type: "email",
            identifier: value.toLowerCase()
        };

    }


    // MOBILE
    const mobileRegex =
        /^\d{10}$/;

    if (mobileRegex.test(value)) {

        return {
            type: "mobile",
            identifier: value
        };

    }


    return null;

}



// ======================================================
// MAIL TRANSPORTER
// ======================================================

function getMailTransporter() {

    if (
        !process.env.EMAIL_USER ||
        !process.env.EMAIL_PASS
    ) {

        throw new Error(
            "EMAIL_USER / EMAIL_PASS not configured."
        );

    }


    return nodemailer.createTransport({

        service: "gmail",

        auth: {

            user:
                process.env.EMAIL_USER,

            pass:
                process.env.EMAIL_PASS

        }

    });

}



// ======================================================
// SEND OTP EMAIL
// ======================================================

async function sendOtpEmail(
    email,
    otp
) {

    const transporter =
        getMailTransporter();


    await transporter.sendMail({

        from:
            process.env.EMAIL_USER,

        to:
            email,

        subject:
            "GharSetu Restaurant Signup OTP",

        html: `

            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                background: #f8f1e7;
                border-radius: 12px;
            ">

                <h2 style="
                    color: #6b4423;
                ">
                    🍽️ GharSetu Restaurant
                </h2>


                <p>
                    Hello,
                </p>


                <p>
                    Your OTP for creating a
                    GharSetu Restaurant Account is:
                </p>


                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    text-align: center;
                    padding: 20px;
                    background: white;
                    border-radius: 10px;
                    color: #6b4423;
                ">

                    ${otp}

                </div>


                <p>
                    This OTP is valid for
                    <strong>
                        ${OTP_EXPIRY_MINUTES} minutes
                    </strong>.
                </p>


                <p>
                    Do not share this OTP with anyone.
                </p>


                <hr>


                <p style="
                    color: #777;
                    font-size: 13px;
                ">
                    This is an automated email from GharSetu.
                </p>

            </div>

        `

    });

}



// ======================================================
// SEND ADMIN NEW RESTAURANT EMAIL
// ======================================================

async function sendAdminNewRestaurantEmail(
    restaurant
) {

    const adminEmail =
        process.env.ADMIN_EMAIL ||
        process.env.EMAIL_USER;


    if (!adminEmail) {

        console.log(
            "ADMIN_EMAIL / EMAIL_USER not configured."
        );

        return;

    }


    try {

        const transporter =
            getMailTransporter();


        const appUrl =
            process.env.APP_URL ||
            "http://localhost:5000";


        await transporter.sendMail({

            from:
                process.env.EMAIL_USER,

            to:
                adminEmail,

            subject:
                "🔔 New GharSetu Restaurant Approval Request",

            html: `

                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 650px;
                    margin: auto;
                    padding: 30px;
                ">

                    <h2>
                        🔔 New Restaurant Registration
                    </h2>


                    <p>
                        A new restaurant has registered
                        on GharSetu and is waiting for approval.
                    </p>


                    <hr>


                    <h3>
                        Restaurant Details
                    </h3>


                    <p>
                        <strong>Restaurant:</strong>
                        ${restaurant.restaurantName}
                    </p>


                    <p>
                        <strong>Owner:</strong>
                        ${restaurant.ownerName || "N/A"}
                    </p>


                    <p>
                        <strong>Email:</strong>
                        ${restaurant.email || "N/A"}
                    </p>


                    <p>
                        <strong>Mobile:</strong>
                        ${restaurant.mobile || "N/A"}
                    </p>


                    <p>
                        <strong>Address:</strong>
                        ${restaurant.address || "N/A"}
                    </p>


                    <p>
                        <strong>Status:</strong>
                        Pending Approval
                    </p>


                    <br>


                    <a
                        href="${appUrl}/admin"
                        style="
                            display: inline-block;
                            padding: 12px 22px;
                            background: #6b4423;
                            color: white;
                            text-decoration: none;
                            border-radius: 8px;
                        "
                    >
                        Open Admin Panel
                    </a>


                    <br><br>


                    <p style="
                        color: #777;
                        font-size: 13px;
                    ">
                        Please login to the GharSetu Admin Panel
                        to approve or reject this application.
                    </p>

                </div>

            `

        });


        console.log(
            "Admin new restaurant email sent."
        );


    } catch (error) {

        console.error(
            "Admin Notification Email Error:",
            error
        );

    }

}



// ======================================================
// SEND APPROVAL EMAIL
// ======================================================

async function sendApprovalEmail(
    email,
    restaurantName
) {

    if (!email) {

        console.log(
            "No restaurant email available for approval email."
        );

        return;

    }


    try {

        const transporter =
            getMailTransporter();


        const appUrl =
            process.env.APP_URL ||
            "http://localhost:5000";


        await transporter.sendMail({

            from:
                process.env.EMAIL_USER,

            to:
                email,

            subject:
                "🎉 GharSetu Restaurant Approved",

            html: `

                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                ">

                    <h2>
                        🎉 Welcome to GharSetu
                    </h2>


                    <p>
                        Hello
                        <strong>
                            ${restaurantName}
                        </strong>,
                    </p>


                    <p>
                        Your restaurant registration
                        has been approved successfully.
                    </p>


                    <p>
                        You can now login to your
                        GharSetu Restaurant Dashboard.
                    </p>


                    <br>


                    <a
                        href="${appUrl}/restaurant/login"
                        style="
                            display: inline-block;
                            padding: 12px 20px;
                            background: #6b4423;
                            color: white;
                            text-decoration: none;
                            border-radius: 8px;
                        "
                    >
                        Login to Restaurant
                    </a>


                    <br><br>


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



// ======================================================
// SEND REJECTION EMAIL
// ======================================================

async function sendRejectionEmail(
    email,
    restaurantName,
    reason
) {

    if (!email) {
        return;
    }


    try {

        const transporter =
            getMailTransporter();


        const appUrl =
            process.env.APP_URL ||
            "http://localhost:5000";


        await transporter.sendMail({

            from:
                process.env.EMAIL_USER,

            to:
                email,

            subject:
                "GharSetu Restaurant Registration Update",

            html: `

                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                ">

                    <h2>
                        GharSetu Restaurant Registration
                    </h2>


                    <p>
                        Hello
                        <strong>
                            ${restaurantName}
                        </strong>,
                    </p>


                    <p>
                        We are sorry to inform you that
                        your restaurant registration was
                        not approved.
                    </p>


                    <p>
                        <strong>
                            Reason:
                        </strong>
                    </p>


                    <div style="
                        background: #f5f5f5;
                        padding: 15px;
                        border-radius: 8px;
                    ">

                        ${reason}

                    </div>


                    <br>


                    <a
                        href="${appUrl}/restaurant/login"
                        style="
                            display: inline-block;
                            padding: 12px 20px;
                            background: #6b4423;
                            color: white;
                            text-decoration: none;
                            border-radius: 8px;
                        "
                    >
                        Restaurant Login
                    </a>

                </div>

            `

        });


        console.log(
            "Restaurant rejection email sent."
        );


    } catch (error) {

        console.error(
            "Rejection Email Error:",
            error
        );

    }

}



// ======================================================
// GENERATE OTP
// ======================================================

function generateOTP() {

    return String(

        Math.floor(
            100000 +
            Math.random() * 900000
        )

    );

}



// ======================================================
// RESTAURANT SIGNUP PAGE
// ======================================================

router.get(
    "/signup",
    (req, res) => {

        res.render(
            "restaurant/signup"
        );

    }
);



// ======================================================
// SEND OTP
// ======================================================

router.post(
    "/send-otp",
    async (req, res) => {

        try {

            const {
                contact
            } = req.body;


            // ==========================================
            // VALIDATE CONTACT
            // ==========================================

            const contactData =
                detectContact(contact);


            if (!contactData) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter a valid email or 10-digit mobile number."

                });

            }


            const {
                identifier,
                type
            } = contactData;


            // ==========================================
            // CHECK EXISTING USER
            // ==========================================

            const existingQuery =
                type === "email"
                    ? {
                        email:
                            identifier,

                        role:
                            "restaurant"
                    }
                    : {
                        mobile:
                            identifier,

                        role:
                            "restaurant"
                    };


            const existingUser =
                await User.findOne(
                    existingQuery
                );


            if (existingUser) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This email/mobile is already registered."

                });

            }


            // ==========================================
            // RESEND LIMIT
            // ==========================================

            const oneMinuteAgo =
                new Date(
                    Date.now() -
                    OTP_RESEND_SECONDS * 1000
                );


            const recentOTP =
                await OTP.findOne({

                    identifier:
                        identifier,

                    purpose:
                        "restaurant_signup",

                    createdAt: {
                        $gte:
                            oneMinuteAgo
                    }

                });


            if (recentOTP) {

                return res.status(429).json({

                    success: false,

                    message:
                        "Please wait 60 seconds before requesting another OTP."

                });

            }


            // ==========================================
            // DELETE OLD OTP
            // ==========================================

            await OTP.deleteMany({

                identifier:
                    identifier,

                purpose:
                    "restaurant_signup"

            });


            // ==========================================
            // GENERATE OTP
            // ==========================================

            const otp =
                generateOTP();


            const expiresAt =
                new Date(
                    Date.now() +
                    OTP_EXPIRY_MINUTES *
                    60 *
                    1000
                );


            // ==========================================
            // SAVE OTP IN MONGODB
            // ==========================================

            await OTP.create({

                identifier:
                    identifier,

                otp:
                    otp,

                type:
                    type,

                purpose:
                    "restaurant_signup",

                expiresAt:
                    expiresAt

            });


            // ==========================================
            // EMAIL OTP
            // ==========================================

            if (type === "email") {

                try {

                    await sendOtpEmail(
                        identifier,
                        otp
                    );

                } catch (emailError) {

                    await OTP.deleteMany({

                        identifier:
                            identifier,

                        purpose:
                            "restaurant_signup"

                    });


                    console.error(
                        "OTP Email Error:",
                        emailError
                    );


                    return res.status(500).json({

                        success: false,

                        message:
                            "OTP email could not be sent. Please check email configuration."

                    });

                }

            }


            // ==========================================
            // MOBILE OTP
            // ==========================================

            if (type === "mobile") {

                /*
                    IMPORTANT:

                    Real SMS provider is not connected yet.

                    We intentionally DO NOT show
                    fake OTP success.

                    Later we will connect:
                    Twilio / MSG91 / another SMS provider.
                */

                await OTP.deleteMany({

                    identifier:
                        identifier,

                    purpose:
                        "restaurant_signup"

                });


                return res.status(501).json({

                    success: false,

                    message:
                        "Mobile OTP service is not configured yet. Please use email for now."

                });

            }


            // ==========================================
            // RESPONSE
            // ==========================================

            return res.json({

                success: true,

                message:
                    "OTP sent successfully.",

                type:
                    type

            });


        } catch (error) {

            console.error(
                "Send OTP Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to send OTP."

            });

        }

    }
);



// ======================================================
// VERIFY OTP
// ======================================================

router.post(
    "/verify-otp",
    async (req, res) => {

        try {

            const {
                contact,
                otp
            } = req.body;


            // ==========================================
            // CONTACT
            // ==========================================

            const contactData =
                detectContact(contact);


            if (!contactData) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid email or mobile number."

                });

            }


            if (
                !otp ||
                !/^\d{6}$/.test(
                    otp.trim()
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter a valid 6-digit OTP."

                });

            }


            const {
                identifier,
                type
            } = contactData;


            // ==========================================
            // FIND OTP
            // ==========================================

            const otpRecord =
                await OTP.findOne({

                    identifier:
                        identifier,

                    type:
                        type,

                    purpose:
                        "restaurant_signup",

                    otp:
                        otp.trim(),

                    expiresAt: {
                        $gt:
                            new Date()
                    }

                });


            if (!otpRecord) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid or expired OTP."

                });

            }


            // ==========================================
            // DELETE OTP
            // ==========================================

            await OTP.deleteMany({

                identifier:
                    identifier,

                purpose:
                    "restaurant_signup"

            });


            // ==========================================
            // CREATE VERIFICATION TOKEN
            // ==========================================

            const verificationToken =
                jwt.sign(

                    {
                        identifier:
                            identifier,

                        type:
                            type,

                        purpose:
                            "restaurant_signup"

                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn:
                            "15m"
                    }

                );


            // ==========================================
            // SAVE VERIFIED COOKIE
            // ==========================================

            res.cookie(

                OTP_COOKIE_NAME,

                verificationToken,

                {

                    httpOnly:
                        true,

                    sameSite:
                        "lax",

                    maxAge:
                        15 *
                        60 *
                        1000

                }

            );


            return res.json({

                success: true,

                message:
                    "OTP verified successfully."

            });


        } catch (error) {

            console.error(
                "Verify OTP Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "OTP verification failed."

            });

        }

    }
);



// ======================================================
// RESTAURANT SIGNUP
// ======================================================

router.post(
    "/signup",
    async (req, res) => {

        try {

            const {
                restaurantName,
                name,
                contact,
                password,
                confirmPassword,
                address
            } = req.body;


            // ==========================================
            // BASIC VALIDATION
            // ==========================================

            if (
                !restaurantName ||
                !name ||
                !contact ||
                !password ||
                !confirmPassword ||
                !address
            ) {

                return res.status(400).send(
                    "All fields are required."
                );

            }


            if (
                restaurantName.trim().length < 2
            ) {

                return res.status(400).send(
                    "Please enter a valid restaurant name."
                );

            }


            if (
                name.trim().length < 2
            ) {

                return res.status(400).send(
                    "Please enter a valid owner name."
                );

            }


            if (
                password.length < 6
            ) {

                return res.status(400).send(
                    "Password must be at least 6 characters."
                );

            }


            if (
                password !==
                confirmPassword
            ) {

                return res.status(400).send(
                    "Passwords do not match."
                );

            }


            // ==========================================
            // CONTACT
            // ==========================================

            const contactData =
                detectContact(contact);


            if (!contactData) {

                return res.status(400).send(
                    "Please enter a valid email or 10-digit mobile number."
                );

            }


            const {
                identifier,
                type
            } = contactData;


            // ==========================================
            // VERIFY OTP TOKEN
            // ==========================================

            const verificationToken =
                req.cookies
                    ? req.cookies[
                        OTP_COOKIE_NAME
                    ]
                    : null;


            if (!verificationToken) {

                return res.status(403).send(
                    "Please verify OTP before creating your account."
                );

            }


            let decodedToken;


            try {

                decodedToken =
                    jwt.verify(

                        verificationToken,

                        process.env.JWT_SECRET

                    );

            } catch (tokenError) {

                return res.status(403).send(
                    "OTP verification expired. Please verify OTP again."
                );

            }


            // ==========================================
            // TOKEN MATCH
            // ==========================================

            if (

                decodedToken.identifier !==
                    identifier ||

                decodedToken.type !==
                    type ||

                decodedToken.purpose !==
                    "restaurant_signup"

            ) {

                return res.status(403).send(
                    "OTP verification does not match this contact."
                );

            }


            // ==========================================
            // CHECK EXISTING USER
            // ==========================================

            const existingQuery =
                type === "email"
                    ? {
                        email:
                            identifier
                    }
                    : {
                        mobile:
                            identifier
                    };


            const existingUser =
                await User.findOne(
                    existingQuery
                );


            if (existingUser) {

                return res.status(400).send(
                    "Email or mobile is already registered."
                );

            }


            // ==========================================
            // HASH PASSWORD
            // ==========================================

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // ==========================================
            // USER DATA
            // ==========================================

            const userData = {

                name:
                    name.trim(),

                password:
                    hashedPassword,

                role:
                    "restaurant",

                isActive:
                    true

            };


            if (type === "email") {

                userData.email =
                    identifier;

                userData.mobile =
                    "";

            } else {

                userData.mobile =
                    identifier;

                userData.email =
                    "";

            }


            // ==========================================
            // CREATE USER
            // ==========================================

            const user =
                await User.create(
                    userData
                );


            // ==========================================
            // RESTAURANT DATA
            // ==========================================

            const restaurantData = {

                owner:
                    user._id,

                restaurantName:
                    restaurantName.trim(),

                email:
                    type === "email"
                        ? identifier
                        : "",

                mobile:
                    type === "mobile"
                        ? identifier
                        : "",

                address:
                    address.trim(),

                approvalStatus:
                    "pending"

            };


            // ==========================================
            // CREATE RESTAURANT
            // ==========================================

            let restaurant;


            try {

                restaurant =
                    await Restaurant.create(
                        restaurantData
                    );

            } catch (restaurantError) {

                // Rollback User if restaurant creation fails

                await User.findByIdAndDelete(
                    user._id
                );

                throw restaurantError;

            }


            // ==========================================
            // ADMIN EMAIL
            // ==========================================

            await sendAdminNewRestaurantEmail({

                restaurantName:
                    restaurant.restaurantName,

                ownerName:
                    user.name,

                email:
                    restaurant.email,

                mobile:
                    restaurant.mobile,

                address:
                    restaurant.address

            });


            // ==========================================
            // CLEAR VERIFIED COOKIE
            // ==========================================

            res.clearCookie(
                OTP_COOKIE_NAME
            );


            // ==========================================
            // SUCCESS PAGE
            // ==========================================

            return res.send(`

                <!DOCTYPE html>

                <html>

                <head>

                    <meta
                        charset="UTF-8"
                    >

                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    >

                    <title>
                        GharSetu - Application Submitted
                    </title>

                </head>


                <body
                    style="
                        margin: 0;
                        font-family: Arial, sans-serif;
                        background: #f8f1e7;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        padding: 20px;
                    "
                >

                    <div
                        style="
                            max-width: 550px;
                            width: 100%;
                            background: white;
                            padding: 40px 30px;
                            border-radius: 16px;
                            text-align: center;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                        "
                    >

                        <div
                            style="
                                font-size: 55px;
                                margin-bottom: 15px;
                            "
                        >
                            ⏳
                        </div>


                        <h1>
                            Application Submitted
                        </h1>


                        <h2>
                            Your restaurant is under verification.
                        </h2>


                        <p>
                            Thank you for registering
                            <strong>
                                ${restaurant.restaurantName}
                            </strong>
                            with GharSetu.
                        </p>


                        <p>
                            Our admin team will review
                            your restaurant application.
                        </p>


                        <p>
                            Once your application is approved,
                            you will receive a confirmation
                            notification.
                        </p>


                        <br>


                        <a
                            href="/restaurant/login"
                            style="
                                display: inline-block;
                                padding: 12px 22px;
                                background: #6b4423;
                                color: white;
                                text-decoration: none;
                                border-radius: 8px;
                            "
                        >
                            Go to Restaurant Login
                        </a>

                    </div>

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



// ======================================================
// RESTAURANT LOGIN PAGE
// ======================================================

router.get(
    "/login",
    (req, res) => {

        res.render(
            "restaurant/login"
        );

    }
);



// ======================================================
// RESTAURANT LOGIN
// EMAIL OR MOBILE + PASSWORD
// ======================================================

router.post(
    "/login",
    async (req, res) => {

        try {

            const {
                mobile,
                email,
                contact,
                password
            } = req.body;


            const loginContact =
                contact ||
                email ||
                mobile;


            // ==========================================
            // VALIDATION
            // ==========================================

            if (
                !loginContact ||
                !password
            ) {

                return res.status(400).send(
                    "Email/mobile and password are required."
                );

            }


            const contactData =
                detectContact(
                    loginContact
                );


            if (!contactData) {

                return res.status(400).send(
                    "Please enter a valid email or 10-digit mobile number."
                );

            }


            const {
                identifier,
                type
            } = contactData;


            // ==========================================
            // FIND USER
            // ==========================================

            const userQuery =
                type === "email"
                    ? {
                        email:
                            identifier,

                        role:
                            "restaurant"
                    }
                    : {
                        mobile:
                            identifier,

                        role:
                            "restaurant"
                    };


            const user =
                await User.findOne(
                    userQuery
                );


            if (!user) {

                return res.status(401).send(
                    "Invalid email/mobile or password."
                );

            }


            // ==========================================
            // PASSWORD
            // ==========================================

            const validPassword =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!validPassword) {

                return res.status(401).send(
                    "Invalid email/mobile or password."
                );

            }


            // ==========================================
            // FIND RESTAURANT
            // ==========================================

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


            // ==========================================
            // PENDING
            // ==========================================

            if (
                restaurant.approvalStatus ===
                "pending"
            ) {

                return res.send(`

                    <script>

                        alert(
                            "Your restaurant is still under verification. Please wait for admin approval."
                        );

                        window.location.href =
                            "/restaurant/login";

                    </script>

                `);

            }


            // ==========================================
            // REJECTED
            // ==========================================

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


            // ==========================================
            // APPROVED
            // ==========================================

            if (
                restaurant.approvalStatus !==
                "approved"
            ) {

                return res.status(403).send(
                    "Restaurant approval is required."
                );

            }


            // ==========================================
            // JWT
            // ==========================================

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


            // ==========================================
            // COOKIE
            // ==========================================

            res.cookie(

                "restaurantToken",

                token,

                {

                    httpOnly:
                        true,

                    sameSite:
                        "lax",

                    maxAge:
                        7 *
                        24 *
                        60 *
                        60 *
                        1000

                }

            );


            // ==========================================
            // DASHBOARD
            // ==========================================

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



// ======================================================
// LOGOUT
// ======================================================

router.get(
    "/logout",
    (req, res) => {

        res.clearCookie(
            "restaurantToken"
        );

        res.clearCookie(
            OTP_COOKIE_NAME
        );

        res.redirect(
            "/restaurant/login"
        );

    }
);



// ======================================================
// ADMIN APPROVE
// ======================================================

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

                    success:
                        false,

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

                    success:
                        false,

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


            // ==========================================
            // APPROVAL EMAIL
            // ==========================================

            await sendApprovalEmail(

                restaurant.email,

                restaurant.restaurantName

            );


            return res.json({

                success:
                    true,

                message:
                    "Restaurant approved successfully."

            });


        } catch (error) {

            console.error(
                "Approve Restaurant Error:",
                error
            );


            return res.status(500).json({

                success:
                    false,

                message:
                    "Failed to approve restaurant."

            });

        }

    }
);



// ======================================================
// ADMIN REJECT
// ======================================================

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

                    success:
                        false,

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

                    success:
                        false,

                    message:
                        "Restaurant not found."

                });

            }


            const reason =
                req.body.reason ||
                "Not approved";


            restaurant.approvalStatus =
                "rejected";

            restaurant.rejectedAt =
                new Date();

            restaurant.rejectedReason =
                reason;


            await restaurant.save();


            // ==========================================
            // REJECTION EMAIL
            // ==========================================

            await sendRejectionEmail(

                restaurant.email,

                restaurant.restaurantName,

                reason

            );


            return res.json({

                success:
                    true,

                message:
                    "Restaurant rejected."

            });


        } catch (error) {

            console.error(
                "Reject Restaurant Error:",
                error
            );


            return res.status(500).json({

                success:
                    false,

                message:
                    "Failed to reject restaurant."

            });

        }

    }
);



// ======================================================
// EXPORT
// ======================================================

module.exports = router;