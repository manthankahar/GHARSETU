const mongoose = require("mongoose");

const Restaurant = require("../models/Restaurant");
const TiffinSeller = require("../models/TiffinSeller");


// ======================================================
// RESTAURANT MANAGEMENT
// ======================================================

exports.getRestaurants = async (req, res) => {
    try {

        const search =
            req.query.search
                ? req.query.search.trim()
                : "";

        const status =
            req.query.status
                ? req.query.status.trim()
                : "all";


        // ==============================================
        // QUERY
        // ==============================================

        const query = {};


        // ==============================================
        // STATUS FILTER
        // ==============================================

        if (
            status === "pending" ||
            status === "approved" ||
            status === "rejected"
        ) {
            query.approvalStatus = status;
        }


        // ==============================================
        // SEARCH
        // ==============================================

        if (search) {

            query.$or = [

                {
                    restaurantName: {
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


        // ==============================================
        // GET RESTAURANTS
        // ==============================================

        const restaurants =
            await Restaurant.find(query)
                .populate(
                    "owner",
                    "name email mobile"
                )
                .sort({
                    createdAt: -1
                })
                .lean();


        // ==============================================
        // COUNTS
        // ==============================================

        const totalRestaurants =
            await Restaurant.countDocuments();

        const pendingRestaurants =
            await Restaurant.countDocuments({
                approvalStatus: "pending"
            });

        const approvedRestaurants =
            await Restaurant.countDocuments({
                approvalStatus: "approved"
            });

        const rejectedRestaurants =
            await Restaurant.countDocuments({
                approvalStatus: "rejected"
            });


        // ==============================================
        // RENDER
        // ==============================================

        return res.render(
            "admin/restaurants",
            {
                admin: req.admin,

                restaurants,

                totalRestaurants,
                pendingRestaurants,
                approvedRestaurants,
                rejectedRestaurants,

                search,
                status,

                success:
                    req.query.success || null,

                error:
                    req.query.error || null
            }
        );

    } catch (error) {

        console.error(
            "ADMIN RESTAURANTS ERROR:",
            error
        );

        return res.status(500).send(
            "Failed to load restaurant management."
        );
    }
};


// ======================================================
// APPROVE RESTAURANT
// ======================================================

exports.approveRestaurant = async (req, res) => {

    try {

        const { id } = req.params;


        // ==============================================
        // ID VALIDATION
        // ==============================================

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid restaurant ID."
            });

        }


        // ==============================================
        // FIND RESTAURANT
        // ==============================================

        const restaurant =
            await Restaurant.findById(id);


        if (!restaurant) {

            return res.status(404).json({
                success: false,
                message:
                    "Restaurant not found."
            });

        }


        // ==============================================
        // APPROVE
        // ==============================================

        restaurant.approvalStatus =
            "approved";

        restaurant.approvedAt =
            new Date();

        restaurant.rejectedAt =
            null;

        restaurant.rejectedReason =
            "";

        restaurant.isActive =
            true;


        await restaurant.save();


        // ==============================================
        // RESPONSE
        // ==============================================

        return res.json({

            success: true,

            message:
                "Restaurant approved successfully."

        });

    } catch (error) {

        console.error(
            "APPROVE RESTAURANT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to approve restaurant."

        });

    }
};


// ======================================================
// REJECT RESTAURANT
// ======================================================

exports.rejectRestaurant = async (req, res) => {

    try {

        const { id } = req.params;

        const reason =
            req.body.reason ||
            "Registration request rejected by admin.";


        // ==============================================
        // ID VALIDATION
        // ==============================================

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid restaurant ID."

            });

        }


        // ==============================================
        // FIND
        // ==============================================

        const restaurant =
            await Restaurant.findById(id);


        if (!restaurant) {

            return res.status(404).json({

                success: false,

                message:
                    "Restaurant not found."

            });

        }


        // ==============================================
        // REJECT
        // ==============================================

        restaurant.approvalStatus =
            "rejected";

        restaurant.rejectedAt =
            new Date();

        restaurant.rejectedReason =
            reason;

        restaurant.isActive =
            false;


        await restaurant.save();


        // ==============================================
        // RESPONSE
        // ==============================================

        return res.json({

            success: true,

            message:
                "Restaurant rejected successfully."

        });

    } catch (error) {

        console.error(
            "REJECT RESTAURANT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to reject restaurant."

        });

    }
};



// ======================================================
// TIFFIN SELLER MANAGEMENT
// ======================================================

exports.getTiffinSellers = async (req, res) => {

    try {

        const search =
            req.query.search
                ? req.query.search.trim()
                : "";

        const status =
            req.query.status
                ? req.query.status.trim()
                : "all";


        // ==============================================
        // QUERY
        // ==============================================

        const query = {};


        // ==============================================
        // STATUS
        // ==============================================

        if (
            status === "pending" ||
            status === "approved" ||
            status === "rejected"
        ) {

            query.registrationStatus =
                status;

        }


        // ==============================================
        // SEARCH
        // ==============================================

        if (search) {

            query.$or = [

                {
                    tiffinCompanyName: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    ownerName: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    mobile: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ];

        }


        // ==============================================
        // GET SELLERS
        // ==============================================

        const sellers =
            await TiffinSeller.find(query)
                .sort({
                    createdAt: -1
                })
                .lean();


        // ==============================================
        // COUNTS
        // ==============================================

        const totalSellers =
            await TiffinSeller.countDocuments();

        const pendingSellers =
            await TiffinSeller.countDocuments({
                registrationStatus:
                    "pending"
            });

        const approvedSellers =
            await TiffinSeller.countDocuments({
                registrationStatus:
                    "approved"
            });

        const rejectedSellers =
            await TiffinSeller.countDocuments({
                registrationStatus:
                    "rejected"
            });


        // ==============================================
        // RENDER
        // ==============================================

        return res.render(
            "admin/tiffinSellers",
            {
                admin: req.admin,

                sellers,

                totalSellers,
                pendingSellers,
                approvedSellers,
                rejectedSellers,

                search,
                status,

                success:
                    req.query.success || null,

                error:
                    req.query.error || null
            }
        );

    } catch (error) {

        console.error(
            "ADMIN TIFFIN SELLERS ERROR:",
            error
        );

        return res.status(500).send(
            "Failed to load tiffin seller management."
        );
    }
};



// ======================================================
// APPROVE TIFFIN SELLER
// ======================================================

exports.approveTiffinSeller = async (req, res) => {

    try {

        const { id } = req.params;


        // ==============================================
        // ID VALIDATION
        // ==============================================

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid tiffin seller ID."

            });

        }


        // ==============================================
        // FIND SELLER
        // ==============================================

        const seller =
            await TiffinSeller.findById(id);


        if (!seller) {

            return res.status(404).json({

                success: false,

                message:
                    "Tiffin seller not found."

            });

        }


        // ==============================================
        // APPROVE
        // ==============================================

        seller.registrationStatus =
            "approved";

        seller.isActive =
            true;


        await seller.save();


        // ==============================================
        // RESPONSE
        // ==============================================

        return res.json({

            success: true,

            message:
                "Tiffin seller approved successfully."

        });

    } catch (error) {

        console.error(
            "APPROVE TIFFIN SELLER ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to approve tiffin seller."

        });

    }
};



// ======================================================
// REJECT TIFFIN SELLER
// ======================================================

exports.rejectTiffinSeller = async (req, res) => {

    try {

        const { id } = req.params;


        // ==============================================
        // ID VALIDATION
        // ==============================================

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid tiffin seller ID."

            });

        }


        // ==============================================
        // FIND SELLER
        // ==============================================

        const seller =
            await TiffinSeller.findById(id);


        if (!seller) {

            return res.status(404).json({

                success: false,

                message:
                    "Tiffin seller not found."

            });

        }


        // ==============================================
        // REJECT
        // ==============================================

        seller.registrationStatus =
            "rejected";

        seller.isActive =
            false;


        await seller.save();


        // ==============================================
        // RESPONSE
        // ==============================================

        return res.json({

            success: true,

            message:
                "Tiffin seller rejected successfully."

        });

    } catch (error) {

        console.error(
            "REJECT TIFFIN SELLER ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to reject tiffin seller."

        });

    }
};