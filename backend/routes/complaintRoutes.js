const express = require("express");

const router = express.Router();

const Complaint =
    require("../models/Complaint");

const upload =
    require("../middleware/uploadMiddleware");

// =====================================
// SUPPORT PAGE
// =====================================

router.get("/support", (req, res) => {

    res.render("delivery/support");

});

// =====================================
// REGISTER COMPLAINT
// =====================================

router.post(
    "/complaint",
    upload.fields([
        {
            name: "photo",
            maxCount: 1
        },
        {
            name: "video",
            maxCount: 1
        }
    ]),
    async (req, res) => {

        try {

            const {
                subject,
                description
            } = req.body;

            if (
                !subject ||
                !description
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Subject and description are required"
                });
            }

            const complaint =
                await Complaint.create({

                    subject,

                    description,

                    photo:
                        req.files?.photo?.[0]
                            ? "/uploads/" +
                              req.files.photo[0]
                                  .filename
                            : null,

                    video:
                        req.files?.video?.[0]
                            ? "/uploads/" +
                              req.files.video[0]
                                  .filename
                            : null
                });

            res.json({
                success: true,
                message:
                    "Complaint registered successfully",
                complaint
            });

        } catch (error) {

            console.error(
                "Complaint Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to register complaint"
            });
        }
    }
);

module.exports = router;