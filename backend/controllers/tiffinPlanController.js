// ======================================================
// TIFFIN PLAN CONTROLLER
// ======================================================

const TiffinPlan = require("../models/TiffinPlan");
const TiffinSeller = require("../models/TiffinSeller");


// ======================================================
// GET TIFFIN PLAN PAGE
// ======================================================

exports.getTiffinPlans = async (req, res) => {

    try {

        // --------------------------------------------------
        // SELLER ID
        // --------------------------------------------------

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
        // SEARCH
        // --------------------------------------------------

        const search =
            req.query.search
                ? req.query.search.trim()
                : "";


        // --------------------------------------------------
        // STATUS FILTER
        // --------------------------------------------------

        const status =
            req.query.status
                ? req.query.status.trim()
                : "all";


        // --------------------------------------------------
        // QUERY
        // --------------------------------------------------

        const query = {

            seller: sellerId

        };


        // --------------------------------------------------
        // STATUS
        // --------------------------------------------------

        if (
            status !== "all" &&
            status !== ""
        ) {

            if (
                status === "active" ||
                status === "deactive"
            ) {

                query.status =
                    status;

            }

        }


        // --------------------------------------------------
        // SEARCH
        // --------------------------------------------------

        if (search) {

            query.$or = [

                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    type: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ];

        }


        // --------------------------------------------------
        // GET PLANS
        // --------------------------------------------------

        const plans =
            await TiffinPlan.find(query)
                .sort({
                    createdAt: -1
                });


        // --------------------------------------------------
        // COUNTS
        // --------------------------------------------------

        const totalPlans =
            await TiffinPlan.countDocuments({

                seller: sellerId

            });


        const activePlans =
            await TiffinPlan.countDocuments({

                seller: sellerId,

                status: "active"

            });


        const deactivePlans =
            await TiffinPlan.countDocuments({

                seller: sellerId,

                status: "deactive"

            });


        // --------------------------------------------------
        // RENDER
        // --------------------------------------------------

        res.render(

            "tiffinSeller/tiffinPlans",

            {

                seller,

                plans,

                totalPlans,

                activePlans,

                deactivePlans,

                search,

                status

            }

        );


    } catch (error) {

        console.error(
            "Get Tiffin Plans Error:",
            error
        );


        res.status(500).send(
            "Failed to load Tiffin Plans"
        );

    }

};


// ======================================================
// GET ADD TIFFIN PLAN PAGE
// ======================================================

exports.getAddTiffinPlan = async (
    req,
    res
) => {

    try {

        const sellerId =
            req.user?.id ||
            req.user?._id;


        if (!sellerId) {

            return res.status(401).send(
                "Tiffin Seller login required"
            );

        }


        const seller =
            await TiffinSeller.findById(
                sellerId
            );


        if (!seller) {

            return res.status(404).send(
                "Tiffin Seller not found"
            );

        }


        res.render(

            "tiffinSeller/addTiffinPlan",

            {

                seller

            }

        );


    } catch (error) {

        console.error(
            "Get Add Tiffin Plan Error:",
            error
        );


        res.status(500).send(
            "Failed to load Add Tiffin Plan"
        );

    }

};


// ======================================================
// CREATE TIFFIN PLAN
// ======================================================

exports.createTiffinPlan = async (
    req,
    res
) => {

    try {

        // --------------------------------------------------
        // SELLER ID
        // --------------------------------------------------

        const sellerId =
            req.user?.id ||
            req.user?._id;


        if (!sellerId) {

            return res.status(401).json({

                success: false,

                message:
                    "Tiffin Seller login required"

            });

        }


        // --------------------------------------------------
        // REQUEST DATA
        // --------------------------------------------------

        const {

            name,

            type,

            price,

            description,

            meals,

            image

        } = req.body;


        // --------------------------------------------------
        // VALIDATION
        // --------------------------------------------------

        if (
            !name ||
            !type ||
            price === undefined ||
            price === ""
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Plan name, type and price are required"

            });

        }


        // --------------------------------------------------
        // VALID PLAN TYPE
        // --------------------------------------------------

        const allowedTypes = [

            "weekly",

            "one_day",

            "monthly",

            "yearly",

            "half_yearly"

        ];


        if (
            !allowedTypes.includes(type)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid tiffin plan type"

            });

        }


        // --------------------------------------------------
        // PRICE VALIDATION
        // --------------------------------------------------

        const planPrice =
            Number(price);


        if (
            Number.isNaN(planPrice) ||
            planPrice < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Price must be a valid number"

            });

        }


        // --------------------------------------------------
        // MEALS
        // --------------------------------------------------

        let planMeals =
            meals === undefined ||
            meals === ""
                ? 1
                : Number(meals);


        if (
            Number.isNaN(planMeals) ||
            planMeals < 1
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Meals must be at least 1"

            });

        }


        // --------------------------------------------------
        // CREATE PLAN
        // --------------------------------------------------

        const plan =
            await TiffinPlan.create({

                seller: sellerId,

                name:
                    name.trim(),

                type,

                price:
                    planPrice,

                description:
                    description
                        ? description.trim()
                        : "",

                meals:
                    planMeals,

                status:
                    "active",

                image:
                    image
                        ? image.trim()
                        : "",

                totalOrders:
                    0,

                totalDelivered:
                    0

            });


        // --------------------------------------------------
        // SUCCESS
        // --------------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Tiffin plan created successfully",

            plan

        });


    } catch (error) {

        console.error(
            "Create Tiffin Plan Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to create Tiffin Plan",

            error:
                error.message

        });

    }

};


// ======================================================
// GET SINGLE TIFFIN PLAN
// ======================================================

exports.getTiffinPlanDetails = async (
    req,
    res
) => {

    try {

        const sellerId =
            req.user?.id ||
            req.user?._id;


        if (!sellerId) {

            return res.status(401).send(
                "Tiffin Seller login required"
            );

        }


        const {
            planId
        } = req.params;


        const plan =
            await TiffinPlan.findOne({

                _id: planId,

                seller: sellerId

            });


        if (!plan) {

            return res.status(404).send(
                "Tiffin Plan not found"
            );

        }


        const seller =
            await TiffinSeller.findById(
                sellerId
            );


        res.render(

            "tiffinSeller/editTiffinPlan",

            {

                seller,

                plan

            }

        );


    } catch (error) {

        console.error(
            "Get Tiffin Plan Details Error:",
            error
        );


        res.status(500).send(
            "Failed to load Tiffin Plan"
        );

    }

};


// ======================================================
// UPDATE TIFFIN PLAN
// ======================================================

exports.updateTiffinPlan = async (
    req,
    res
) => {

    try {

        // --------------------------------------------------
        // SELLER ID
        // --------------------------------------------------

        const sellerId =
            req.user?.id ||
            req.user?._id;


        if (!sellerId) {

            return res.status(401).json({

                success: false,

                message:
                    "Tiffin Seller login required"

            });

        }


        // --------------------------------------------------
        // PLAN ID
        // --------------------------------------------------

        const {
            planId
        } = req.params;


        // --------------------------------------------------
        // REQUEST DATA
        // --------------------------------------------------

        const {

            name,

            type,

            price,

            description,

            meals,

            image

        } = req.body;


        // --------------------------------------------------
        // VALIDATION
        // --------------------------------------------------

        if (
            !name ||
            !type ||
            price === undefined ||
            price === ""
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Plan name, type and price are required"

            });

        }


        // --------------------------------------------------
        // PLAN TYPE
        // --------------------------------------------------

        const allowedTypes = [

            "weekly",

            "one_day",

            "monthly",

            "yearly",

            "half_yearly"

        ];


        if (
            !allowedTypes.includes(type)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid tiffin plan type"

            });

        }


        // --------------------------------------------------
        // PRICE
        // --------------------------------------------------

        const planPrice =
            Number(price);


        if (
            Number.isNaN(planPrice) ||
            planPrice < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Price must be a valid number"

            });

        }


        // --------------------------------------------------
        // MEALS
        // --------------------------------------------------

        let planMeals =
            meals === undefined ||
            meals === ""
                ? 1
                : Number(meals);


        if (
            Number.isNaN(planMeals) ||
            planMeals < 1
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Meals must be at least 1"

            });

        }


        // --------------------------------------------------
        // FIND PLAN
        // --------------------------------------------------

        const plan =
            await TiffinPlan.findOne({

                _id: planId,

                seller: sellerId

            });


        if (!plan) {

            return res.status(404).json({

                success: false,

                message:
                    "Tiffin Plan not found"

            });

        }


        // --------------------------------------------------
        // UPDATE
        // --------------------------------------------------

        plan.name =
            name.trim();

        plan.type =
            type;

        plan.price =
            planPrice;

        plan.description =
            description
                ? description.trim()
                : "";

        plan.meals =
            planMeals;


        if (
            image !== undefined
        ) {

            plan.image =
                image
                    ? image.trim()
                    : "";

        }


        await plan.save();


        // --------------------------------------------------
        // SUCCESS
        // --------------------------------------------------

        return res.json({

            success: true,

            message:
                "Tiffin Plan updated successfully",

            plan

        });


    } catch (error) {

        console.error(
            "Update Tiffin Plan Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to update Tiffin Plan",

            error:
                error.message

        });

    }

};


// ======================================================
// TOGGLE TIFFIN PLAN STATUS
// ======================================================

exports.toggleTiffinPlanStatus = async (
    req,
    res
) => {

    try {

        const sellerId =
            req.user?.id ||
            req.user?._id;


        if (!sellerId) {

            return res.status(401).json({

                success: false,

                message:
                    "Tiffin Seller login required"

            });

        }


        const {
            planId
        } = req.params;


        const plan =
            await TiffinPlan.findOne({

                _id: planId,

                seller: sellerId

            });


        if (!plan) {

            return res.status(404).json({

                success: false,

                message:
                    "Tiffin Plan not found"

            });

        }


        // --------------------------------------------------
        // TOGGLE
        // --------------------------------------------------

        if (
            plan.status === "active"
        ) {

            plan.status =
                "deactive";

        } else {

            plan.status =
                "active";

        }


        await plan.save();


        return res.json({

            success: true,

            message:
                `Tiffin Plan ${plan.status} successfully`,

            status:
                plan.status,

            plan

        });


    } catch (error) {

        console.error(
            "Toggle Tiffin Plan Status Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to update Tiffin Plan status",

            error:
                error.message

        });

    }

};


// ======================================================
// DELETE TIFFIN PLAN
// ======================================================

exports.deleteTiffinPlan = async (
    req,
    res
) => {

    try {

        const sellerId =
            req.user?.id ||
            req.user?._id;


        if (!sellerId) {

            return res.status(401).json({

                success: false,

                message:
                    "Tiffin Seller login required"

            });

        }


        const {
            planId
        } = req.params;


        const plan =
            await TiffinPlan.findOne({

                _id: planId,

                seller: sellerId

            });


        if (!plan) {

            return res.status(404).json({

                success: false,

                message:
                    "Tiffin Plan not found"

            });

        }


        // --------------------------------------------------
        // DELETE
        // --------------------------------------------------

        await TiffinPlan.deleteOne({

            _id: planId,

            seller: sellerId

        });


        return res.json({

            success: true,

            message:
                "Tiffin Plan deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete Tiffin Plan Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to delete Tiffin Plan",

            error:
                error.message

        });

    }

};


// ======================================================
// EXPORT COMPLETE
// ======================================================