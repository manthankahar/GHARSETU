const mongoose = require("mongoose");

const User = require("../models/user");
const Delivery = require("../models/Delivery");


// ======================================================
// GET DELIVERY PARTNERS
// ======================================================

const getDeliveryPartners = async (req, res) => {
    try {

        const search = (req.query.search || "").trim();
        const status = req.query.status || "all";


        // ==================================================
        // USER QUERY
        // ==================================================

        const userQuery = {
            role: "delivery"
        };


        // ==================================================
        // SEARCH
        // ==================================================

        if (search) {

            userQuery.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    mobile: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];

        }


        // ==================================================
        // STATUS FILTER
        // ==================================================

        if (status === "active") {
            userQuery.isActive = true;
        }

        if (status === "inactive") {
            userQuery.isActive = false;
        }


        // ==================================================
        // GET PARTNERS
        // ==================================================

        const partners = await User.find(userQuery)
            .select(
                "name email mobile profileImage isActive createdAt"
            )
            .sort({
                createdAt: -1
            })
            .lean();


        // ==================================================
        // BASIC COUNTS
        // ==================================================

        const totalPartners = await User.countDocuments({
            role: "delivery"
        });

        const activePartners = await User.countDocuments({
            role: "delivery",
            isActive: true
        });

        const inactivePartners = await User.countDocuments({
            role: "delivery",
            isActive: false
        });


        // ==================================================
        // DELIVERY STATS
        // ==================================================

        const partnerIds = partners.map(
            partner => partner._id
        );


        let deliveryStats = [];

        if (partnerIds.length > 0) {

            deliveryStats = await Delivery.aggregate([

                {
                    $match: {
                        partner: {
                            $in: partnerIds
                        }
                    }
                },

                {
                    $group: {

                        _id: "$partner",

                        totalDeliveries: {
                            $sum: 1
                        },

                        completedDeliveries: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$status",
                                            "completed"
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        },

                        totalEarning: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$status",
                                            "completed"
                                        ]
                                    },
                                    {
                                        $ifNull: [
                                            "$earning",
                                            0
                                        ]
                                    },
                                    0
                                ]
                            }
                        },

                        currentEarning: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$status",
                                            "completed"
                                        ]
                                    },
                                    {
                                        $ifNull: [
                                            "$currentEarning",
                                            0
                                        ]
                                    },
                                    0
                                ]
                            }
                        }

                    }
                }

            ]);

        }


        // ==================================================
        // MAP DELIVERY STATS
        // ==================================================

        const statsMap = new Map();

        deliveryStats.forEach(stat => {

            statsMap.set(
                String(stat._id),
                stat
            );

        });


        // ==================================================
        // MERGE PARTNER + DELIVERY DATA
        // ==================================================

        const formattedPartners = partners.map(partner => {

            const stats = statsMap.get(
                String(partner._id)
            ) || {};


            return {

                ...partner,

                totalDeliveries:
                    stats.totalDeliveries || 0,

                completedDeliveries:
                    stats.completedDeliveries || 0,

                totalEarning:
                    Number(
                        stats.totalEarning || 0
                    ),

                currentEarning:
                    Number(
                        stats.currentEarning || 0
                    )

            };

        });


        // ==================================================
        // DELIVERY STATUS COUNTS
        // ==================================================

        const pendingDeliveries =
            await Delivery.countDocuments({
                status: "pending"
            });


        const activeDeliveries =
            await Delivery.countDocuments({
                status: {
                    $in: [
                        "accepted",
                        "reached_restaurant",
                        "picked_up",
                        "reached_location"
                    ]
                }
            });


        const completedDeliveries =
            await Delivery.countDocuments({
                status: "completed"
            });


        // ==================================================
        // RENDER ADMIN DELIVERY PAGE
        // ==================================================

        return res.render(
            "admin/delivery",
            {

                admin: req.admin,

                partners:
                    formattedPartners,

                totalPartners,

                activePartners,

                inactivePartners,

                pendingDeliveries,

                activeDeliveries,

                completedDeliveries,

                search,

                status

            }
        );


    } catch (error) {

        console.error(
            "ADMIN DELIVERY MANAGEMENT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to load delivery partners.",

            error:
                error.message

        });

    }
};


// ======================================================
// GET DELIVERY PARTNER DETAILS
// ======================================================

const getDeliveryPartnerDetails = async (req, res) => {

    try {

        const { id } = req.params;


        // ==================================================
        // VALIDATE ID
        // ==================================================

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid delivery partner ID."

            });

        }


        // ==================================================
        // FIND PARTNER
        // ==================================================

        const partner = await User.findOne({

            _id: id,

            role: "delivery"

        })
            .select(
                "name email mobile profileImage isActive createdAt"
            )
            .lean();


        if (!partner) {

            return res.status(404).json({

                success: false,

                message:
                    "Delivery partner not found."

            });

        }


        // ==================================================
        // DELIVERY STATS
        // ==================================================

        const stats = await Delivery.aggregate([

            {
                $match: {

                    partner:
                        new mongoose.Types.ObjectId(id)

                }
            },

            {
                $group: {

                    _id: null,

                    totalDeliveries: {
                        $sum: 1
                    },

                    completedDeliveries: {

                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "completed"
                                    ]
                                },
                                1,
                                0
                            ]
                        }

                    },

                    pendingDeliveries: {

                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "pending"
                                    ]
                                },
                                1,
                                0
                            ]
                        }

                    },

                    activeDeliveries: {

                        $sum: {
                            $cond: [
                                {
                                    $in: [
                                        "$status",
                                        [
                                            "accepted",
                                            "reached_restaurant",
                                            "picked_up",
                                            "reached_location"
                                        ]
                                    ]
                                },
                                1,
                                0
                            ]
                        }

                    },

                    totalEarning: {

                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "completed"
                                    ]
                                },
                                {
                                    $ifNull: [
                                        "$earning",
                                        0
                                    ]
                                },
                                0
                            ]
                        }

                    },

                    currentEarning: {

                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "completed"
                                    ]
                                },
                                {
                                    $ifNull: [
                                        "$currentEarning",
                                        0
                                    ]
                                },
                                0
                            ]
                        }

                    }

                }

            }

        ]);


        const deliveryData =
            stats[0] || {

                totalDeliveries: 0,

                completedDeliveries: 0,

                pendingDeliveries: 0,

                activeDeliveries: 0,

                totalEarning: 0,

                currentEarning: 0

            };


        // ==================================================
        // RECENT DELIVERIES
        // ==================================================

        const recentDeliveries =
            await Delivery.find({
                partner: id
            })
                .populate("order")
                .sort({
                    createdAt: -1
                })
                .limit(10)
                .lean();


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.json({

            success: true,

            partner,

            stats: {

                totalDeliveries:
                    deliveryData.totalDeliveries || 0,

                completedDeliveries:
                    deliveryData.completedDeliveries || 0,

                pendingDeliveries:
                    deliveryData.pendingDeliveries || 0,

                activeDeliveries:
                    deliveryData.activeDeliveries || 0,

                totalEarning:
                    Number(
                        deliveryData.totalEarning || 0
                    ),

                currentEarning:
                    Number(
                        deliveryData.currentEarning || 0
                    )

            },

            recentDeliveries

        });


    } catch (error) {

        console.error(
            "DELIVERY PARTNER DETAILS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to load delivery partner details.",

            error:
                error.message

        });

    }

};


// ======================================================
// TOGGLE DELIVERY PARTNER STATUS
// ======================================================

const toggleDeliveryPartnerStatus = async (req, res) => {

    try {

        const { id } = req.params;


        // ==================================================
        // VALIDATE ID
        // ==================================================

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid delivery partner ID."

            });

        }


        // ==================================================
        // FIND PARTNER
        // ==================================================

        const partner =
            await User.findOne({

                _id: id,

                role: "delivery"

            });


        if (!partner) {

            return res.status(404).json({

                success: false,

                message:
                    "Delivery partner not found."

            });

        }


        // ==================================================
        // TOGGLE
        // ==================================================

        partner.isActive =
            !partner.isActive;


        await partner.save();


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.json({

            success: true,

            message:
                partner.isActive
                    ? "Delivery partner activated successfully."
                    : "Delivery partner deactivated successfully.",

            isActive:
                partner.isActive

        });


    } catch (error) {

        console.error(
            "TOGGLE DELIVERY PARTNER ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to update delivery partner status.",

            error:
                error.message

        });

    }

};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getDeliveryPartners,

    getDeliveryPartnerDetails,

    toggleDeliveryPartnerStatus

};