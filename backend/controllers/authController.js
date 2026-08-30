const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


// =====================================
// LOGIN
// =====================================

const login = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        // Required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check account status
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive"
            });
        }

        // Compare password
        const isPasswordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// CUSTOMER SIGNUP
// =====================================

const signup = async (req, res) => {
    try {

        const {
            name,
            email,
            mobile,
            password
        } = req.body;

        // Required fields
        if (
            !name ||
            !email ||
            !mobile ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check email
        const existingEmail =
            await User.findOne({
                email: email.toLowerCase().trim()
            });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Check mobile
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

        // Password hash
        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        // Create customer
        const user =
            await User.create({
                name: name.trim(),

                email:
                    email.toLowerCase().trim(),

                mobile:
                    mobile.trim(),

                password:
                    hashedPassword,

                role: "customer"
            });

        return res.status(201).json({
            success: true,
            message: "Signup successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Signup Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// DELIVERY PARTNER SIGNUP
// =====================================

const deliverySignup = async (req, res) => {
    try {

        const {
            name,
            email,
            mobile,
            password
        } = req.body;

        // Required fields
        if (
            !name ||
            !email ||
            !mobile ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Name validation
        if (name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid name"
            });
        }

        // Mobile validation
        if (!/^\d{10}$/.test(mobile.trim())) {
            return res.status(400).json({
                success: false,
                message:
                    "Enter valid 10-digit mobile number"
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }

        // Check email
        const existingEmail =
            await User.findOne({
                email: email.toLowerCase().trim()
            });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message:
                    "Email already registered"
            });
        }

        // Check mobile
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

        // Hash password
        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        // Create delivery partner
        const user =
            await User.create({
                name: name.trim(),

                email:
                    email.toLowerCase().trim(),

                mobile:
                    mobile.trim(),

                password:
                    hashedPassword,

                role: "delivery",

                isActive: true
            });

        return res.status(201).json({
            success: true,
            message:
                "Delivery partner account created successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Delivery Signup Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// EXPORT
// =====================================

module.exports = {
    signup,
    login,
    deliverySignup
};