// ======================================================
// TIFFIN SELLER CONTROLLER
// ======================================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const TiffinSeller = require("../models/TiffinSeller");
const TiffinPlan = require("../models/TiffinPlan");
const TiffinOrder = require("../models/TiffinOrder");


exports.registerTiffinSeller = async (req, res) => {

    try {

        const {
            mobile,
            tiffinCompanyName,
            address,
            password,
            ownerName,
            email
        } = req.body;

        // ==============================
        // VALIDATION
        // ==============================

        if (
            !mobile ||
            !tiffinCompanyName ||
            !address ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Mobile, password, tiffin company name and address are required"
            });
        }

        // ==============================
        // CHECK EXISTING SELLER
        // ==============================

        const existingSeller =
            await TiffinSeller.findOne({
                mobile: mobile.trim()
            });

        if (existingSeller) {

            return res.status(400).json({
                success: false,
                message:
                    "Tiffin seller already registered with this mobile number"
            });

        }

        // ==============================
        // HASH PASSWORD
        // ==============================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        // ==============================
        // CREATE SELLER
        // ==============================

        const seller =
            await TiffinSeller.create({

                mobile:
                    mobile.trim(),

                password:
                    hashedPassword,

                tiffinCompanyName:
                    tiffinCompanyName.trim(),

                address:
                    address.trim(),

                ownerName:
                    ownerName || "",

                email:
                    email || "",

                registrationStatus:
                    "pending",

                isActive:
                    false

            });

        // ==============================
        // SUCCESS
        // ==============================

        res.status(201).json({

            success: true,

            message:
                "Request sent. We will connect you within 24 hours for registration.",

            sellerId:
                seller._id

        });

    } catch (error) {

        console.error(
            "Tiffin Seller Register Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to send registration request",

            error:
                error.message

        });

    }

};


exports.loginTiffinSeller = async (req, res) => {

    try {

        const {
            mobile,
            password
        } = req.body;

        // ==============================
        // VALIDATION
        // ==============================

        if (!mobile || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Mobile number and password are required"

            });

        }

        // ==============================
        // FIND SELLER
        // ==============================

        const seller =
            await TiffinSeller.findOne({
                mobile: mobile.trim()
            });

        if (!seller) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid mobile number or password"

            });

        }

        // ==============================
        // REGISTRATION CHECK
        // ==============================

        if (
            seller.registrationStatus !==
            "approved"
        ) {

            if (
                seller.registrationStatus ===
                "pending"
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Your registration request is pending. We will connect you within 24 hours."

                });

            }

            if (
                seller.registrationStatus ===
                "rejected"
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Your registration request has been rejected."

                });

            }

        }

        // ==============================
        // ACTIVE CHECK
        // ==============================

        if (!seller.isActive) {

            return res.status(403).json({

                success: false,

                message:
                    "Your Tiffin Seller account is currently inactive."

            });

        }

        // ==============================
        // PASSWORD CHECK
        // ==============================

        const isMatch =
            await bcrypt.compare(
                password,
                seller.password
            );

        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid mobile number or password"

            });

        }

        // ==============================
        // JWT
        // ==============================

        const token =
            jwt.sign(

                {
                    id:
                        seller._id,

                    role:
                        "tiffinSeller"

                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "7d"
                }

            );

        // ==============================
        // SUCCESS
        // ==============================

        res.json({

            success: true,

            message:
                "Tiffin Seller login successful",

            token,

            seller: {

                id:
                    seller._id,

                mobile:
                    seller.mobile,

                tiffinCompanyName:
                    seller.tiffinCompanyName,

                address:
                    seller.address,

                ownerName:
                    seller.ownerName,

                email:
                    seller.email,

                role:
                    "tiffinSeller"

            }

        });

    } catch (error) {

        console.error(
            "Tiffin Seller Login Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to login",

            error:
                error.message

        });

    }

};


// ======================================================
// TIFFIN SELLER DASHBOARD
// ======================================================

exports.getDashboard = async (req, res) => {

    try {

        const sellerId =
            req.user?.id ||
            req.user?._id;


        if (!sellerId) {

            return res.status(401).send(
                "Tiffin Seller login required"
            );

        }


        // --------------------------------------------------
        // SELLER
        // --------------------------------------------------

        const seller =
            await TiffinSeller.findById(
                sellerId
            );


        if (!seller) {

            return res.status(404).send(
                "Tiffin Seller not found"
            );

        }


        // --------------------------------------------------
        // ACTIVE PLANS
        // --------------------------------------------------

        const activePlans =
            await TiffinPlan.countDocuments({

                seller: sellerId,

                isActive: true

            });


        // --------------------------------------------------
        // DEACTIVE PLANS
        // --------------------------------------------------

        const deactivePlans =
            await TiffinPlan.countDocuments({

                seller: sellerId,

                isActive: false

            });


        // --------------------------------------------------
        // TOTAL ORDERS
        // --------------------------------------------------

        const totalOrders =
            await TiffinOrder.countDocuments({

                seller: sellerId

            });


        // --------------------------------------------------
        // NEW ORDERS
        // --------------------------------------------------

        const newOrders =
            await TiffinOrder.countDocuments({

                seller: sellerId,

                status: "new"

            });


        // --------------------------------------------------
        // PACKED ORDERS
        // --------------------------------------------------

        const packedOrders =
            await TiffinOrder.countDocuments({

                seller: sellerId,

                status: "packed"

            });


        // --------------------------------------------------
        // DISPATCHED ORDERS
        // --------------------------------------------------

        const dispatchedOrders =
            await TiffinOrder.countDocuments({

                seller: sellerId,

                status: "dispatched"

            });


        // --------------------------------------------------
        // DELIVERED ORDERS
        // --------------------------------------------------

        const deliveredOrders =
            await TiffinOrder.countDocuments({

                seller: sellerId,

                status: "delivered"

            });


        // --------------------------------------------------
        // TOTAL EARNING
        // --------------------------------------------------

        const earningData =
            await TiffinOrder.aggregate([

                {
                    $match: {

                        seller:
                            seller._id,

                        status:
                            "delivered"

                    }

                },

                {
                    $group: {

                        _id: null,

                        total: {

                            $sum: "$amount"

                        }

                    }

                }

            ]);


        const totalEarning =
            earningData.length > 0
                ? earningData[0].total
                : 0;


        // --------------------------------------------------
        // RECENT ORDERS
        // --------------------------------------------------

        const recentOrders =
            await TiffinOrder.find({

                seller: sellerId

            })
            .populate(
                "customer",
                "name mobile"
            )
            .sort({

                createdAt: -1

            })
            .limit(10);


        // --------------------------------------------------
        // RENDER DASHBOARD
        // --------------------------------------------------

        res.render(

            "tiffinSeller/dashboard",

            {

                seller,

                totalEarning,

                activePlans,

                deactivePlans,

                totalOrders,

                newOrders,

                packedOrders,

                dispatchedOrders,

                deliveredOrders,

                recentOrders

            }

        );


    } catch (error) {

        console.error(
            "Tiffin Seller Dashboard Error:",
            error
        );


        res.status(500).send(
            "Failed to load Tiffin Seller Dashboard"
        );

    }

};


// ======================================================
// EXPORT COMPLETE
// ======================================================