const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
// const DeliveryPartner = require("../models/DeliveryPartner");


// ==========================================
// CREATE JWT TOKEN
// ==========================================

function generateToken(user) {

    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

}


// ==========================================
// SET AUTH COOKIE
// ==========================================

function setAuthCookie(res, token) {

    res.cookie(
        "token",
        token,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    );

}


// ==========================================
// CUSTOMER SIGNUP
// ==========================================

const signup = async (req, res) => {

    try {

        const {
            name,
            email,
            mobile,
            password
        } = req.body;


        // ======================================
        // VALIDATION
        // ======================================

        if (
            !name ||
            !email ||
            !mobile ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required"

            });

        }


        // ======================================
        // EMAIL
        // ======================================

        const normalizedEmail =
            email
                .trim()
                .toLowerCase();


        // ======================================
        // CHECK EMAIL
        // ======================================

        const existingEmail =
            await User.findOne({
                email: normalizedEmail
            });


        if (existingEmail) {

            return res.status(400).json({

                success: false,

                message:
                    "Email already registered"

            });

        }


        // ======================================
        // CHECK MOBILE
        // ======================================

        const existingMobile =
            await User.findOne({
                mobile: mobile.trim()
            });


        if (existingMobile) {

            return res.status(400).json({

                success: false,

                message:
                    "Mobile number already registered"

            });

        }


        // ======================================
        // PASSWORD HASH
        // ======================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ======================================
        // CREATE CUSTOMER
        // ======================================

        const user =
            await User.create({

                name:
                    name.trim(),

                email:
                    normalizedEmail,

                mobile:
                    mobile.trim(),

                password:
                    hashedPassword,

                role:
                    "customer",

                isActive:
                    true

            });


        return res.status(201).json({

            success: true,

            message:
                "Account created successfully",

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                mobile:
                    user.mobile,

                role:
                    user.role

            }

        });


    } catch (error) {

        console.error(
            "SIGNUP ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error during signup"

        });

    }

};


// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ======================================
        // VALIDATION
        // ======================================

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"

            });

        }


        // ======================================
        // FIND USER
        // ======================================

        const normalizedEmail =
            email
                .trim()
                .toLowerCase();


        const user =
            await User.findOne({
                email: normalizedEmail
            });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // ======================================
        // ACTIVE CHECK
        // ======================================

        if (
            user.isActive === false
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Your account is inactive"

            });

        }


        // ======================================
        // PASSWORD CHECK
        // ======================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // ======================================
        // CREATE TOKEN
        // ======================================

        const token =
            generateToken(user);


        // ======================================
        // SET HTTP-ONLY COOKIE
        // ======================================

        setAuthCookie(
            res,
            token
        );


        // ======================================
        // RESPONSE
        // ======================================

        return res.status(200).json({

            success: true,

            message:
                "Login successful",

            token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                mobile:
                    user.mobile,

                role:
                    user.role,

                profileImage:
                    user.profileImage || ""

            }

        });


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error during login"

        });

    }

};


// ==========================================
// DELIVERY SIGNUP
// ==========================================

const deliverySignup = async (
    req,
    res
) => {

    try {

        const {
            name,
            email,
            mobile,
            password
        } = req.body;


        // ======================================
        // VALIDATION
        // ======================================

        if (
            !name ||
            !email ||
            !mobile ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required"

            });

        }


        const normalizedEmail =
            email
                .trim()
                .toLowerCase();


        // ======================================
        // CHECK USER
        // ======================================

        const existingUser =
            await User.findOne({

                $or: [

                    {
                        email:
                            normalizedEmail
                    },

                    {
                        mobile:
                            mobile.trim()
                    }

                ]

            });


        if (existingUser) {

            return res.status(400).json({

                success: false,

                message:
                    "Email or mobile already registered"

            });

        }


        // ======================================
        // HASH PASSWORD
        // ======================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ======================================
        // CREATE DELIVERY USER
        // ======================================

        const user =
            await User.create({

                name:
                    name.trim(),

                email:
                    normalizedEmail,

                mobile:
                    mobile.trim(),

                password:
                    hashedPassword,

                role:
                    "delivery",

                isActive:
                    true

            });


        return res.status(201).json({

            success: true,

            message:
                "Delivery account created successfully",

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                mobile:
                    user.mobile,

                role:
                    user.role

            }

        });


    } catch (error) {

        console.error(
            "DELIVERY SIGNUP ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error during delivery signup"

        });

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    signup,

    login,

    deliverySignup

};