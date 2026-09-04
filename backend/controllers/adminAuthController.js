const Admin =
    require("../models/Admin");

const jwt =
    require("jsonwebtoken");


// ======================================================
// ADMIN SIGNUP PAGE
// ======================================================

const getAdminSignup = (req, res) => {

    res.render(
        "admin/signup",
        {
            error: null
        }
    );

};


// ======================================================
// ADMIN SIGNUP
// ======================================================

const signupAdmin = async (req, res) => {

    try {

        const {
            name,
            mobile,
            email,
            password,
            confirmPassword
        } = req.body;


        // ==================================================
        // VALIDATION
        // ==================================================

        if (
            !name ||
            !mobile ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            return res.status(400).render(
                "admin/signup",
                {
                    error:
                        "Please fill all fields."
                }
            );

        }


        // ==================================================
        // PASSWORD CHECK
        // ==================================================

        if (
            password !== confirmPassword
        ) {

            return res.status(400).render(
                "admin/signup",
                {
                    error:
                        "Passwords do not match."
                }
            );

        }


        if (
            password.length < 6
        ) {

            return res.status(400).render(
                "admin/signup",
                {
                    error:
                        "Password must be at least 6 characters."
                }
            );

        }


        // ==================================================
        // MOBILE VALIDATION
        // ==================================================

        const cleanMobile =
            mobile.trim();


        if (
            !/^[0-9]{10}$/.test(
                cleanMobile
            )
        ) {

            return res.status(400).render(
                "admin/signup",
                {
                    error:
                        "Please enter a valid 10 digit mobile number."
                }
            );

        }


        // ==================================================
        // EMAIL VALIDATION
        // ==================================================

        const cleanEmail =
            email.trim().toLowerCase();


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailRegex.test(
                cleanEmail
            )
        ) {

            return res.status(400).render(
                "admin/signup",
                {
                    error:
                        "Please enter a valid email address."
                }
            );

        }


        // ==================================================
        // CHECK MOBILE
        // ==================================================

        const existingMobile =
            await Admin.findOne({
                mobile: cleanMobile
            });


        if (existingMobile) {

            return res.status(409).render(
                "admin/signup",
                {
                    error:
                        "Admin with this mobile number already exists."
                }
            );

        }


        // ==================================================
        // CHECK EMAIL
        // ==================================================

        const existingEmail =
            await Admin.findOne({
                email: cleanEmail
            });


        if (existingEmail) {

            return res.status(409).render(
                "admin/signup",
                {
                    error:
                        "Admin with this email already exists."
                }
            );

        }


        // ==================================================
        // CREATE ADMIN
        // ==================================================
        // IMPORTANT:
        // Password manually hash nahi karvo.
        // Admin.js nu pre("save") automatically hash karse.
        // ==================================================

        const admin =
            await Admin.create({

                name:
                    name.trim(),

                mobile:
                    cleanMobile,

                email:
                    cleanEmail,

                password:
                    password,

                role:
                    "admin",

                isActive:
                    true

            });


        console.log(
            "======================================"
        );

        console.log(
            "✅ ADMIN CREATED"
        );

        console.log(
            "NAME:",
            admin.name
        );

        console.log(
            "MOBILE:",
            admin.mobile
        );

        console.log(
            "EMAIL:",
            admin.email
        );

        console.log(
            "======================================"
        );


        // ==================================================
        // REDIRECT LOGIN
        // ==================================================

        return res.redirect(
            "/admin/login"
        );


    } catch (error) {

        console.error(
            "ADMIN SIGNUP ERROR:",
            error
        );


        // Duplicate key error
        if (
            error.code === 11000
        ) {

            return res.status(409).render(
                "admin/signup",
                {
                    error:
                        "Mobile number or email already exists."
                }
            );

        }


        return res.status(500).render(
            "admin/signup",
            {
                error:
                    "Something went wrong. Please try again."
            }
        );

    }

};


// ======================================================
// ADMIN LOGIN PAGE
// ======================================================

const getAdminLogin = (req, res) => {

    res.render(
        "admin/login",
        {
            error: null
        }
    );

};


// ======================================================
// ADMIN LOGIN
// ======================================================

const loginAdmin = async (req, res) => {

    try {

        const {
            mobile,
            password
        } = req.body;


        // ==================================================
        // VALIDATION
        // ==================================================

        if (
            !mobile ||
            !password
        ) {

            return res.status(400).render(
                "admin/login",
                {
                    error:
                        "Mobile number and password are required."
                }
            );

        }


        // ==================================================
        // FIND ADMIN
        // ==================================================

        const admin =
            await Admin.findOne({
                mobile:
                    mobile.trim()
            });


        if (!admin) {

            return res.status(401).render(
                "admin/login",
                {
                    error:
                        "Invalid mobile number or password."
                }
            );

        }


        // ==================================================
        // ACTIVE CHECK
        // ==================================================

        if (
            !admin.isActive
        ) {

            return res.status(403).render(
                "admin/login",
                {
                    error:
                        "Your admin account is inactive."
                }
            );

        }


        // ==================================================
        // PASSWORD CHECK
        // ==================================================

        const isMatch =
            await admin.comparePassword(
                password
            );


        if (!isMatch) {

            return res.status(401).render(
                "admin/login",
                {
                    error:
                        "Invalid mobile number or password."
                }
            );

        }


        // ==================================================
        // UPDATE LAST LOGIN
        // ==================================================

        admin.lastLogin =
            new Date();

        await admin.save();


        // ==================================================
        // JWT TOKEN
        // ==================================================

        const token =
            jwt.sign(
                {
                    id:
                        admin._id,

                    role:
                        "admin"
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "7d"
                }
            );


        // ==================================================
        // COOKIE
        // ==================================================

        res.cookie(
            "adminToken",
            token,
            {
                httpOnly: true,

                secure: false,

                sameSite: "lax",

                maxAge:
                    7 *
                    24 *
                    60 *
                    60 *
                    1000
            }
        );


        // ==================================================
        // REDIRECT DASHBOARD
        // ==================================================

        return res.redirect(
            "/admin/dashboard"
        );


    } catch (error) {

        console.error(
            "ADMIN LOGIN ERROR:",
            error
        );


        return res.status(500).render(
            "admin/login",
            {
                error:
                    "Something went wrong. Please try again."
            }
        );

    }

};


// ======================================================
// ADMIN LOGOUT
// ======================================================

const logoutAdmin = (req, res) => {

    res.clearCookie(
        "adminToken"
    );


    return res.redirect(
        "/admin/login"
    );

};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getAdminSignup,

    signupAdmin,

    getAdminLogin,

    loginAdmin,

    logoutAdmin

};