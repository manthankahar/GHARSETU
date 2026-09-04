const User = require("../models/user");
const Restaurant = require("../models/Restaurant");
const TiffinSeller = require("../models/TiffinSeller");
const Order = require("../models/Order");


// ======================================================
// ADMIN DASHBOARD
// ======================================================

const getAdminDashboard = async (req, res) => {

    try {

        // ==================================================
        // BASIC COUNTS
        // ==================================================

        const totalCustomers =
            await User.countDocuments({
                role: "user"
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
        // RESTAURANT PENDING
        // ==================================================

        let pendingRestaurants = 0;

        try {

            pendingRestaurants =
                await Restaurant.countDocuments({
                    $or: [
                        {
                            registrationStatus:
                                "pending"
                        },
                        {
                            status:
                                "pending"
                        }
                    ]
                });

        } catch (error) {

            pendingRestaurants = 0;

        }


        // ==================================================
        // TIFFIN SELLER PENDING
        // ==================================================

        let pendingTiffinSellers = 0;

        try {

            pendingTiffinSellers =
                await TiffinSeller.countDocuments({
                    registrationStatus:
                        "pending"
                });

        } catch (error) {

            pendingTiffinSellers = 0;

        }


        // ==================================================
        // REVENUE
        // ==================================================

        let totalRevenue = 0;

        try {

            const revenueData =
                await Order.aggregate([

                    {
                        $match: {
                            status: {
                                $in: [
                                    "Delivered",
                                    "delivered",
                                    "completed",
                                    "Completed"
                                ]
                            }
                        }
                    },

                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: "$totalAmount"
                            }
                        }
                    }

                ]);


            if (
                revenueData.length > 0
            ) {

                totalRevenue =
                    revenueData[0].total || 0;

            }

        } catch (error) {

            totalRevenue = 0;

        }


        // ==================================================
        // RECENT ORDERS
        // ==================================================

        let recentOrders = [];

        try {

            recentOrders =
                await Order.find()

                    .sort({
                        createdAt: -1
                    })

                    .limit(6)

                    .populate(
                        "customer",
                        "name mobile"
                    )

                    .lean();

        } catch (error) {

            console.log(
                "Recent Orders Error:",
                error.message
            );

        }


        // ==================================================
        // RENDER
        // ==================================================

        res.render(
            "admin/dashboard",
            {

                totalCustomers,

                totalRestaurants,

                totalTiffinSellers,

                totalDeliveryPartners,

                totalOrders,

                totalRevenue,

                pendingRestaurants,

                pendingTiffinSellers,

                recentOrders

            }
        );


    } catch (error) {

        console.error(
            "ADMIN DASHBOARD ERROR:",
            error
        );


        res.status(500).send(
            "Admin Dashboard Error"
        );

    }

};


module.exports = {
    getAdminDashboard
};