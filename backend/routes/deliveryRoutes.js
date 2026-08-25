const express = require("express");

const router = express.Router();

const Delivery = require("../models/Delivery");
const upload = require("../middleware/uploadMiddleware");

// =====================================
// GET DELIVERY DASHBOARD
// =====================================

router.get("/dashboard", async (req, res) => {

    try {

        const deliveries =
            await Delivery.find()
                .populate("order")
                .sort({ createdAt: -1 });

        res.render("delivery/dashboard", {
            deliveries
        });

    } catch (error) {

        console.error(
            "Delivery Dashboard Error:",
            error
        );

        res.status(500).send(
            "Failed to load delivery dashboard"
        );
    }
});

// =====================================
// GET ACTIVE DELIVERY
// =====================================

router.get("/active/:id", async (req, res) => {

    try {

        const delivery =
            await Delivery.findById(req.params.id)
                .populate("order");

        if (!delivery) {

            return res.status(404).send(
                "Delivery not found"
            );
        }

        res.render(
            "delivery/activeDelivery",
            {
                delivery
            }
        );

    } catch (error) {

        console.error(
            "Active Delivery Error:",
            error
        );

        res.status(500).send(
            "Server Error"
        );
    }
});

// =====================================
// ACCEPT DELIVERY
// =====================================

router.post("/:id/accept", async (req, res) => {

    try {

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

// =====================================
// REJECT DELIVERY
// =====================================

router.post("/:id/reject", async (req, res) => {

    try {

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

// =====================================
// REACHED RESTAURANT
// =====================================

router.post(
    "/:id/reached-restaurant",
    async (req, res) => {

        try {

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

            delivery.status =
                "reached_restaurant";

            delivery.reachedRestaurantAt =
                new Date();

            await delivery.save();

            res.json({
                success: true,
                message:
                    "Restaurant reached",
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

// =====================================
// PICKUP USING OTP
// =====================================

router.post(
    "/:id/pickup-otp",
    async (req, res) => {

        try {

            const {
                otp
            } = req.body;

            if (!otp) {

                return res.status(400).json({
                    success: false,
                    message:
                        "OTP is required"
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

            // Demo OTP
            const validOtp = "1234";

            if (otp !== validOtp) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid OTP"
                });
            }

            delivery.status =
                "picked_up";

            delivery.pickupVerification = {
                method: "otp",
                otp,
                verified: true
            };

            delivery.pickedUpAt =
                new Date();

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

// =====================================
// PICKUP USING PHOTO
// =====================================

router.post(
    "/:id/pickup-photo",
    upload.single("photo"),
    async (req, res) => {

        try {

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
                    message:
                        "Delivery not found"
                });
            }

            delivery.status =
                "picked_up";

            delivery.pickupVerification = {
                method: "photo",
                photo:
                    "/uploads/" +
                    req.file.filename,
                verified: true
            };

            delivery.pickedUpAt =
                new Date();

            await delivery.save();

            res.json({
                success: true,
                message:
                    "Pickup photo verified",
                photo:
                    "/uploads/" +
                    req.file.filename
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

// =====================================
// REACHED CUSTOMER LOCATION
// =====================================

router.post(
    "/:id/reached-location",
    async (req, res) => {

        try {

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

// =====================================
// COMPLETE DELIVERY
// =====================================

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
                Number(orderAmount) || 0;

            delivery.orderAmount = amount;
            delivery.paymentMethod =
                paymentMethod;

            if (
                paymentMethod === "cash"
            ) {

                delivery.cashDeducted =
                    amount;

                delivery.onlineAdded = 0;

                delivery.currentEarning =
                    Math.max(
                        0,
                        delivery.currentEarning -
                        amount
                    );

            } else {

                delivery.onlineAdded =
                    delivery.earning;

                delivery.cashDeducted = 0;

                delivery.currentEarning =
                    delivery.currentEarning +
                    delivery.earning;
            }

            delivery.status =
                "completed";

            delivery.completedAt =
                new Date();

            await delivery.save();

            res.json({
                success: true,
                message:
                    "Delivery completed",
                earning:
                    delivery.currentEarning,
                cashDeducted:
                    delivery.cashDeducted,
                onlineAdded:
                    delivery.onlineAdded,
                paymentMethod:
                    delivery.paymentMethod
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

module.exports = router;

// =====================================
// PICKUP PAGE
// =====================================

router.get("/pickup/:id", async (req, res) => {

    try {

        const delivery = await Delivery.findById(req.params.id)
            .populate("order");

        if (!delivery) {
            return res.status(404).send("Delivery not found");
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