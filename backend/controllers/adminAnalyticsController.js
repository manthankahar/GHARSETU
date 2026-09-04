const Order = require("../models/Order");
const User = require("../models/user");
const Restaurant = require("../models/Restaurant");
const TiffinSeller = require("../models/TiffinSeller");
const Delivery = require("../models/Delivery");


// ======================================================
// ADMIN - ANALYTICS
// ======================================================

const getAnalytics = async (req, res) => {

    try {

        // ==================================================
        // BASIC COUNTS
        // ==================================================

        const totalCustomers =
            await User.countDocuments({
                role: "customer"
            });


        const totalRestaurants =
            await Restaurant.countDocuments();


        const totalTiffinSellers =
            await TiffinSeller.countDocuments();


        const totalDeliveryPartners =
            await User.countDocuments({
                role: "delivery"
            });


        const totalOrders =
            await Order.countDocuments();


        // ==================================================
        // REVENUE
        // ==================================================

        const revenueData =
            await Order.aggregate([

                {
                    $group: {

                        _id: null,

                        totalRevenue: {
                            $sum: {
                                $ifNull: [
                                    "$total",
                                    0
                                ]
                            }
                        }

                    }

                }

            ]);


        const totalRevenue =
            revenueData.length > 0
                ? Number(
                    revenueData[0].totalRevenue || 0
                )
                : 0;


        // ==================================================
        // AVERAGE ORDER VALUE
        // ==================================================

        const averageOrderValue =
            totalOrders > 0
                ? totalRevenue / totalOrders
                : 0;


        // ==================================================
        // ORDER STATUS
        // ==================================================

        const orderStatusData =
            await Order.aggregate([

                {
                    $group: {

                        _id: {
                            $ifNull: [
                                "$status",
                                "unknown"
                            ]
                        },

                        count: {
                            $sum: 1
                        }

                    }

                },

                {
                    $sort: {
                        count: -1
                    }

                }

            ]);


        // ==================================================
        // PAYMENT METHOD
        // ==================================================

        const paymentMethodData =
            await Order.aggregate([

                {
                    $group: {

                        _id: {
                            $ifNull: [
                                "$paymentMethod",
                                "unknown"
                            ]
                        },

                        count: {
                            $sum: 1
                        },

                        amount: {
                            $sum: {
                                $ifNull: [
                                    "$total",
                                    0
                                ]
                            }
                        }

                    }

                },

                {
                    $sort: {
                        count: -1
                    }

                }

            ]);


        // ==================================================
        // MONTHLY REVENUE
        // ==================================================

        const monthlyRevenue =
            await Order.aggregate([

                {
                    $match: {

                        createdAt: {
                            $exists: true
                        }

                    }

                },

                {
                    $group: {

                        _id: {

                            year: {
                                $year: "$createdAt"
                            },

                            month: {
                                $month: "$createdAt"
                            }

                        },

                        revenue: {
                            $sum: {
                                $ifNull: [
                                    "$total",
                                    0
                                ]
                            }
                        },

                        orders: {
                            $sum: 1
                        }

                    }

                },

                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1
                    }

                },

                {
                    $limit: 12
                }

            ]);


        // ==================================================
        // RECENT ORDERS
        // ==================================================

        const recentOrders =
            await Order.find()

                .populate(
                    "customer",
                    "name email mobile"
                )

                .sort({
                    createdAt: -1
                })

                .limit(8)

                .lean();


        // ==================================================
        // DELIVERY STATISTICS
        // ==================================================

        const deliveryStatusData =
            await Delivery.aggregate([

                {
                    $group: {

                        _id: {
                            $ifNull: [
                                "$status",
                                "unknown"
                            ]
                        },

                        count: {
                            $sum: 1
                        }

                    }

                },

                {
                    $sort: {
                        count: -1
                    }

                }

            ]);


        // ==================================================
        // CUSTOMER / USER TOTAL
        // ==================================================

        const totalUsers =
            await User.countDocuments();


        // ==================================================
        // ACTIVE USERS
        // ==================================================

        const activeUsers =
            await User.countDocuments({

                isActive: true

            });


        // ==================================================
        // RESTAURANT APPROVAL
        // ==================================================

        const approvedRestaurants =
            await Restaurant.countDocuments({

                approvalStatus: "approved"

            });


        const pendingRestaurants =
            await Restaurant.countDocuments({

                approvalStatus: "pending"

            });


        // ==================================================
        // TIFFIN SELLER STATUS
        // ==================================================

        const approvedTiffinSellers =
            await TiffinSeller.countDocuments({

                registrationStatus: "approved"

            });


        const pendingTiffinSellers =
            await TiffinSeller.countDocuments({

                registrationStatus: "pending"

            });


        // ==================================================
        // RENDER
        // ==================================================

        return res.render(
            "admin/analytics",
            {

                admin:
                    req.admin,

                totalCustomers,

                totalRestaurants,

                totalTiffinSellers,

                totalDeliveryPartners,

                totalOrders,

                totalRevenue,

                averageOrderValue,

                orderStatusData,

                paymentMethodData,

                monthlyRevenue,

                recentOrders,

                deliveryStatusData,

                totalUsers,

                activeUsers,

                approvedRestaurants,

                pendingRestaurants,

                approvedTiffinSellers,

                pendingTiffinSellers

            }
        );


    } catch (error) {

        console.error(
            "ADMIN ANALYTICS ERROR:",
            error
        );


        return res.status(500).send(
            "Failed to load analytics."
        );

    }

};


module.exports = {

    getAnalytics

};