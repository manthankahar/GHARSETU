const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Delivery = require("../models/Delivery");
const upload = require("../middleware/uploadMiddleware");

// ======================================================
// HELPER - ORDER DATA
// ======================================================

function makeOrderData(delivery) {
    const order = delivery.order || {};

    return {
        id: delivery._id
            ? delivery._id.toString()
            : "",

        item:
            order.item ||
            order.name ||
            order.title ||
            "Delivery Order",

        amount: Number(
            delivery.orderAmount ||
            order.amount ||
            order.totalAmount ||
            0
        ),

        pickup:
            order.pickup ||
            order.restaurant ||
            order.restaurantName ||
            "Restaurant",

        pickupArea:
            order.pickupArea ||
            order.restaurantArea ||
            "",

        customer:
            order.customer ||
            order.customerName ||
            "Customer",

        dropArea:
            order.dropArea ||
            order.address ||
            order.deliveryAddress ||
            "",

        status: delivery.status || "pending"
    };
}


// ======================================================
// DASHBOARD
// ======================================================

router.get("/dashboard", async (req, res) => {
    try {

        const deliveries = await Delivery.find()
            .populate("order")
            .sort({ createdAt: -1 });

        const orders = deliveries.map(makeOrderData);

        res.render("delivery/dashboard", {
            deliveries,
            orders
        });

    } catch (error) {

        console.error("Dashboard Error:", error);

        res.status(500).send(
            "Failed to load delivery dashboard"
        );
    }
});


// ======================================================
// REQUESTS
// ======================================================

router.get("/requests", async (req, res) => {
    try {

        const deliveries = await Delivery.find({
            status: "pending"
        })
            .populate("order")
            .sort({ createdAt: -1 });

        const orders = deliveries.map(makeOrderData);

        res.render("delivery/requests", {
            deliveries,
            orders
        });

    } catch (error) {

        console.error("Requests Error:", error);

        res.status(500).send(
            "Failed to load delivery requests"
        );
    }
});


// ======================================================
// ACTIVE DELIVERY LIST
// ======================================================

router.get("/active", async (req, res) => {
    try {

        const deliveries = await Delivery.find({
            status: {
                $in: [
                    "accepted",
                    "reached_restaurant",
                    "picked_up",
                    "reached_location"
                ]
            }
        })
            .populate("order")
            .sort({ createdAt: -1 });

        const orders = deliveries.map(makeOrderData);

        // IMPORTANT
        // Active EJS ma delivery variable pan use thai shake
        const delivery =
            deliveries.length > 0
                ? deliveries[0]
                : {
                    _id: null,
                    order: {},
                    status: "accepted",
                    orderAmount: 0,
                    earning: 0,
                    currentEarning: 0
                };

        res.render("delivery/activeDelivery", {
            delivery,
            deliveries,
            orders
        });

    } catch (error) {

        console.error(
            "Active Delivery Error:",
            error
        );

        res.status(500).send(
            "Failed to load active deliveries"
        );
    }
});


// ======================================================
// ACTIVE DELIVERY DETAILS
// ======================================================

router.get("/active/:id", async (req, res) => {
    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).send(
                "Invalid delivery ID"
            );
        }

        const delivery = await Delivery.findById(
            req.params.id
        ).populate("order");

        if (!delivery) {
            return res.status(404).send(
                "Delivery not found"
            );
        }

        const orders = [
            makeOrderData(delivery)
        ];

        res.render("delivery/activeDelivery", {
            delivery,
            deliveries: [delivery],
            orders
        });

    } catch (error) {

        console.error(
            "Active Delivery Details Error:",
            error
        );

        res.status(500).send(
            "Failed to load active delivery"
        );
    }
});


// ======================================================
// PICKUP PAGE
// ======================================================

router.get("/pickup/:id", async (req, res) => {
    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).send(
                "Invalid delivery ID"
            );
        }

        const delivery = await Delivery.findById(
            req.params.id
        ).populate("order");

        if (!delivery) {
            return res.status(404).send(
                "Delivery not found"
            );
        }

        res.render("delivery/pickup", {
            delivery
        });

    } catch (error) {

        console.error(
            "Pickup Page Error:",
            error
        );

        res.status(500).send(
            "Failed to load pickup page"
        );
    }
});


// ======================================================
// ACCEPT DELIVERY
// ======================================================

router.post("/:id/accept", async (req, res) => {
    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery ID"
            });
        }

        const delivery = await Delivery.findById(
            req.params.id
        );

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Delivery not found"
            });
        }

        if (delivery.status !== "pending") {
            return res.status(400).json({
                success: false,
                message:
                    `Delivery is already ${delivery.status}`
            });
        }

        delivery.status = "accepted";
        delivery.acceptedAt = new Date();

        await delivery.save();

        res.json({
            success: true,
            message: "Delivery accepted",
            delivery
        });

    } catch (error) {

        console.error(
            "Accept Delivery Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to accept delivery"
        });
    }
});


// ======================================================
// REJECT DELIVERY
// ======================================================

router.post("/:id/reject", async (req, res) => {
    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery ID"
            });
        }

        const delivery = await Delivery.findById(
            req.params.id
        );

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Delivery not found"
            });
        }

        if (delivery.status !== "pending") {
            return res.status(400).json({
                success: false,
                message:
                    "Only pending deliveries can be rejected"
            });
        }

        delivery.status = "rejected";

        await delivery.save();

        res.json({
            success: true,
            message: "Delivery rejected"
        });

    } catch (error) {

        console.error(
            "Reject Delivery Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to reject delivery"
        });
    }
});


// ======================================================
// REACHED RESTAURANT
// ======================================================

router.post(
    "/:id/reached-restaurant",
    async (req, res) => {

        try {

            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid delivery ID"
                });
            }

            const delivery =
                await Delivery.findById(
                    req.params.id
                );

            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: "Delivery not found"
                });
            }

            if (delivery.status !== "accepted") {
                return res.status(400).json({
                    success: false,
                    message:
                        "Accept delivery first"
                });
            }

            delivery.status =
                "reached_restaurant";

            delivery.reachedRestaurantAt =
                new Date();

            await delivery.save();

            res.json({
                success: true,
                message: "Restaurant reached",
                delivery
            });

        } catch (error) {

            console.error(
                "Reached Restaurant Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }
);


// ======================================================
// PICKUP - OTP
// ======================================================

router.post(
    "/:id/pickup-otp",
    async (req, res) => {

        try {

            const { otp } = req.body;

            if (!otp) {
                return res.status(400).json({
                    success: false,
                    message: "OTP is required"
                });
            }

            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid delivery ID"
                });
            }

            const delivery =
                await Delivery.findById(
                    req.params.id
                );

            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: "Delivery not found"
                });
            }

            if (
                delivery.status !==
                "reached_restaurant"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Reach restaurant first"
                });
            }

            // DEMO OTP
            const validOtp = "1234";

            if (String(otp) !== validOtp) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid OTP. Demo OTP is 1234"
                });
            }

            delivery.status = "picked_up";

            delivery.pickupVerification = {
                method: "otp",
                otp: validOtp,
                photo: null,
                verified: true
            };

            delivery.pickedUpAt = new Date();

            await delivery.save();

            res.json({
                success: true,
                message:
                    "Pickup verified successfully",
                delivery
            });

        } catch (error) {

            console.error(
                "Pickup OTP Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }
);


// ======================================================
// PICKUP - PHOTO
// ======================================================

router.post(
    "/:id/pickup-photo",
    upload.single("photo"),
    async (req, res) => {

        try {

            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid delivery ID"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Pickup photo is required"
                });
            }

            const delivery =
                await Delivery.findById(
                    req.params.id
                );

            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: "Delivery not found"
                });
            }

            if (
                delivery.status !==
                "reached_restaurant"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Reach restaurant first"
                });
            }

            const photoPath =
                "/uploads/" +
                req.file.filename;

            delivery.status = "picked_up";

            delivery.pickupVerification = {
                method: "photo",
                otp: null,
                photo: photoPath,
                verified: true
            };

            delivery.pickedUpAt = new Date();

            await delivery.save();

            res.json({
                success: true,
                message:
                    "Pickup photo verified",
                photo: photoPath,
                delivery
            });

        } catch (error) {

            console.error(
                "Pickup Photo Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }
);


// ======================================================
// REACHED CUSTOMER LOCATION
// ======================================================

router.post(
    "/:id/reached-location",
    async (req, res) => {

        try {

            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid delivery ID"
                });
            }

            const delivery =
                await Delivery.findById(
                    req.params.id
                );

            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: "Delivery not found"
                });
            }

            if (
                delivery.status !==
                "picked_up"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Pickup must be completed first"
                });
            }

            delivery.status =
                "reached_location";

            delivery.reachedLocationAt =
                new Date();

            await delivery.save();

            res.json({
                success: true,
                message:
                    "Customer location reached",
                delivery
            });

        } catch (error) {

            console.error(
                "Reached Location Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }
);


// ======================================================
// COMPLETE DELIVERY
// ======================================================

router.post(
    "/:id/complete",
    async (req, res) => {

        try {

            const {
                paymentMethod,
                orderAmount
            } = req.body;

            if (
                !paymentMethod ||
                !["cash", "online"]
                    .includes(paymentMethod)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Select cash or online"
                });
            }

            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid delivery ID"
                });
            }

            const delivery =
                await Delivery.findById(
                    req.params.id
                );

            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Delivery not found"
                });
            }

            if (
                delivery.status !==
                "reached_location"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Reach customer location first"
                });
            }

            const amount =
                Number(orderAmount);

            if (
                !Number.isFinite(amount) ||
                amount < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid order amount"
                });
            }

            delivery.orderAmount = amount;
            delivery.paymentMethod =
                paymentMethod;

            if (paymentMethod === "cash") {

                delivery.cashDeducted =
                    amount;

                delivery.onlineAdded = 0;

                delivery.currentEarning =
                    Math.max(
                        0,
                        Number(
                            delivery.currentEarning ||
                            delivery.earning ||
                            0
                        ) - amount
                    );
            }

            if (paymentMethod === "online") {

                delivery.onlineAdded =
                    Number(
                        delivery.earning || 0
                    );

                delivery.cashDeducted = 0;

                delivery.currentEarning =
                    Number(
                        delivery.currentEarning || 0
                    ) +
                    Number(
                        delivery.earning || 0
                    );
            }

            delivery.status = "completed";
            delivery.completedAt = new Date();

            await delivery.save();

            res.json({
                success: true,
                message:
                    "Congratulations! Delivery completed successfully.",
                paymentMethod:
                    delivery.paymentMethod,
                earning:
                    delivery.currentEarning,
                deliveryEarning:
                    delivery.earning,
                orderAmount:
                    delivery.orderAmount,
                cashDeducted:
                    delivery.cashDeducted,
                onlineAdded:
                    delivery.onlineAdded
            });

        } catch (error) {

            console.error(
                "Complete Delivery Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to complete delivery"
            });
        }
    }
);


// ======================================================
// HISTORY
// ======================================================

router.get("/history", async (req, res) => {

    try {

        const deliveries =
            await Delivery.find({
                status: "completed"
            })
                .populate("order")
                .sort({
                    completedAt: -1
                });

        const orders =
            deliveries.map(makeOrderData);

        res.render(
            "delivery/history",
            {
                deliveries,
                orders
            }
        );

    } catch (error) {

        console.error(
            "History Error:",
            error
        );

        res.status(500).send(
            "Failed to load delivery history"
        );
    }
});


// ======================================================
// EARNINGS
// ======================================================

router.get("/earnings", async (req, res) => {

    try {

        const deliveries =
            await Delivery.find({
                status: "completed"
            })
                .populate("order")
                .sort({
                    completedAt: -1
                });

        const orders =
            deliveries.map(makeOrderData);

        const totalEarnings =
            deliveries.reduce(
                (sum, delivery) => {

                    return (
                        sum +
                        Number(
                            delivery.currentEarning ||
                            delivery.earning ||
                            0
                        )
                    );
                },
                0
            );

        res.render(
            "delivery/earnings",
            {
                deliveries,
                orders,
                totalEarnings
            }
        );

    } catch (error) {

        console.error(
            "Earnings Error:",
            error
        );

        res.status(500).send(
            "Failed to load delivery earnings"
        );
    }
});


// ======================================================
// DELIVERY RATINGS
// ======================================================

router.get("/ratings", async (req, res) => {

    try {

        // ------------------------------------------
        // RATINGS DATA
        // ------------------------------------------

        const ratings = [];

        // ------------------------------------------
        // TOTAL RATINGS
        // ------------------------------------------

        const totalRatings = ratings.length;

        // ------------------------------------------
        // AVERAGE RATING
        // ------------------------------------------

        let rating = 0;

        if (totalRatings > 0) {

            rating =
                ratings.reduce(
                    (sum, item) =>
                        sum + Number(item.rating || 0),
                    0
                ) / totalRatings;

        }

        // ------------------------------------------
        // RENDER RATINGS PAGE
        // ------------------------------------------

        res.render(
            "delivery/ratings",
            {
                ratings: ratings,

                totalRatings: totalRatings,

                rating: rating,

                averageRating: rating
            }
        );

    } catch (error) {

        console.error(
            "Delivery Ratings Error:",
            error
        );

        res.status(500).send(
            "Failed to load delivery ratings"
        );
    }

});


// ======================================================
// PROFILE
// ======================================================

router.get("/profile", async (req, res) => {

    try {

        // Temporary delivery partner data
        // Login system sathe pachhi dynamic kari shakishu
        const user = {
            name: "Delivery Partner",
            email: "",
            mobile: "",
            role: "Delivery Partner"
        };

        res.render(
            "delivery/profile",
            {
                user
            }
        );

    } catch (error) {

        console.error(
            "Profile Error:",
            error
        );

        res.status(500).send(
            "Failed to load delivery profile"
        );
    }
});


// ======================================================
// EXPORT
// ======================================================

module.exports = router;