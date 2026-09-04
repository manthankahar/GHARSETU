const mongoose = require("mongoose");

const Complaint =
    require("../models/Complaint");

const User =
    require("../models/user");


// ======================================================
// ADMIN - GET ALL COMPLAINTS
// ======================================================

const getComplaints = async (req, res) => {

    try {

        const search =
            (req.query.search || "").trim();

        const status =
            (req.query.status || "all").trim();

        const role =
            (req.query.role || "all").trim();


        // ==================================================
        // QUERY
        // ==================================================

        const query = {};


        // ==================================================
        // STATUS FILTER
        // ==================================================

        if (
            status &&
            status !== "all"
        ) {

            query.status = status;

        }


        // ==================================================
        // ROLE FILTER
        // ==================================================

        if (
            role &&
            role !== "all"
        ) {

            query.complainantRole = role;

        }


        // ==================================================
        // SEARCH
        // ==================================================

        if (search) {

            const regex =
                new RegExp(search, "i");


            let searchConditions = [

                {
                    subject: regex
                },

                {
                    description: regex
                },

                {
                    complainantName: regex
                },

                {
                    complainantMobile: regex
                }

            ];


            // ==================================================
            // USER SEARCH
            // ==================================================

            const users =
                await User.find({

                    $or: [

                        {
                            name: regex
                        },

                        {
                            email: regex
                        },

                        {
                            mobile: regex
                        }

                    ]

                })
                .select("_id")
                .lean();


            if (
                users.length > 0
            ) {

                searchConditions.push({

                    complainant: {

                        $in:
                            users.map(
                                user => user._id
                            )

                    }

                });

            }


            // ==================================================
            // OBJECT ID SEARCH
            // ==================================================

            if (
                mongoose.Types.ObjectId.isValid(
                    search
                )
            ) {

                searchConditions.push({

                    _id: search

                });

            }


            query.$or =
                searchConditions;

        }


        // ==================================================
        // GET COMPLAINTS
        // ==================================================

        const complaints =
            await Complaint.find(query)

                .populate(
                    "complainant",
                    "name email mobile role"
                )

                .populate(
                    "handledBy",
                    "name email"
                )

                .sort({
                    createdAt: -1
                })

                .lean();


        // ==================================================
        // STATISTICS
        // ==================================================

        const totalComplaints =
            await Complaint.countDocuments();


        const pendingComplaints =
            await Complaint.countDocuments({

                status: "pending"

            });


        const inProgressComplaints =
            await Complaint.countDocuments({

                status: "in_progress"

            });


        const resolvedComplaints =
            await Complaint.countDocuments({

                status: "resolved"

            });


        const closedComplaints =
            await Complaint.countDocuments({

                status: "closed"

            });


        // ==================================================
        // ROLE STATISTICS
        // ==================================================

        const roleSummary =
            await Complaint.aggregate([

                {
                    $group: {

                        _id:
                            "$complainantRole",

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
        // RENDER
        // ==================================================

        return res.render(
            "admin/complaints",
            {

                admin:
                    req.admin,

                complaints,

                totalComplaints,

                pendingComplaints,

                inProgressComplaints,

                resolvedComplaints,

                closedComplaints,

                roleSummary,

                search,

                status,

                role

            }
        );


    } catch (error) {

        console.error(
            "ADMIN COMPLAINTS ERROR:",
            error
        );


        return res.status(500).send(
            "Failed to load complaints."
        );

    }

};


// ======================================================
// ADMIN - COMPLAINT DETAILS
// ======================================================

const getComplaintDetails =
    async (req, res) => {

        try {

            const { id } =
                req.params;


            if (
                !mongoose.Types.ObjectId.isValid(
                    id
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid complaint ID."

                });

            }


            const complaint =
                await Complaint.findById(id)

                    .populate(
                        "complainant",
                        "name email mobile role"
                    )

                    .populate(
                        "handledBy",
                        "name email"
                    )

                    .lean();


            if (!complaint) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Complaint not found."

                });

            }


            return res.json({

                success: true,

                complaint

            });


        } catch (error) {

            console.error(
                "COMPLAINT DETAILS ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to load complaint details."

            });

        }

    };


// ======================================================
// ADMIN - UPDATE STATUS
// ======================================================

const updateComplaintStatus =
    async (req, res) => {

        try {

            const { id } =
                req.params;

            const { status } =
                req.body;


            const allowedStatuses = [

                "pending",

                "in_progress",

                "resolved",

                "closed"

            ];


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid complaint status."

                });

            }


            const complaint =
                await Complaint.findById(id);


            if (!complaint) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Complaint not found."

                });

            }


            complaint.status =
                status;


            if (
                status === "resolved"
            ) {

                complaint.resolvedAt =
                    new Date();

            }


            if (
                status !== "resolved"
            ) {

                complaint.resolvedAt =
                    null;

            }


            complaint.handledBy =
                req.admin._id;


            await complaint.save();


            return res.json({

                success: true,

                message:
                    "Complaint status updated.",

                complaint

            });


        } catch (error) {

            console.error(
                "UPDATE COMPLAINT STATUS ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to update complaint status."

            });

        }

    };


// ======================================================
// ADMIN - REPLY
// ======================================================

const replyToComplaint =
    async (req, res) => {

        try {

            const { id } =
                req.params;

            const {
                adminResponse
            } = req.body;


            if (
                !adminResponse ||
                !adminResponse.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Admin response is required."

                });

            }


            const complaint =
                await Complaint.findById(id);


            if (!complaint) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Complaint not found."

                });

            }


            complaint.adminResponse =
                adminResponse.trim();

            complaint.respondedAt =
                new Date();

            complaint.handledBy =
                req.admin._id;


            if (
                complaint.status ===
                "pending"
            ) {

                complaint.status =
                    "in_progress";

            }


            await complaint.save();


            return res.json({

                success: true,

                message:
                    "Reply added successfully.",

                complaint

            });


        } catch (error) {

            console.error(
                "REPLY COMPLAINT ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to reply to complaint."

            });

        }

    };


// ======================================================
// ADMIN - DELETE
// ======================================================

const deleteComplaint =
    async (req, res) => {

        try {

            const { id } =
                req.params;


            const complaint =
                await Complaint.findById(id);


            if (!complaint) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Complaint not found."

                });

            }


            await Complaint.findByIdAndDelete(
                id
            );


            return res.json({

                success: true,

                message:
                    "Complaint deleted successfully."

            });


        } catch (error) {

            console.error(
                "DELETE COMPLAINT ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to delete complaint."

            });

        }

    };


module.exports = {

    getComplaints,

    getComplaintDetails,

    updateComplaintStatus,

    replyToComplaint,

    deleteComplaint

};