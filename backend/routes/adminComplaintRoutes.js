const express = require("express");

const router =
    express.Router();


const adminMiddleware =
    require("../middleware/adminMiddleware");


const {

    getComplaints,

    getComplaintDetails,

    updateComplaintStatus,

    replyToComplaint,

    deleteComplaint

} =
    require(
        "../controllers/adminComplaintController"
    );


// ======================================================
// ALL COMPLAINTS
// ======================================================

router.get(
    "/complaints",
    adminMiddleware,
    getComplaints
);


// ======================================================
// COMPLAINT DETAILS
// ======================================================

router.get(
    "/complaints/:id",
    adminMiddleware,
    getComplaintDetails
);


// ======================================================
// UPDATE STATUS
// ======================================================

router.post(
    "/complaints/:id/status",
    adminMiddleware,
    updateComplaintStatus
);


// ======================================================
// ADMIN REPLY
// ======================================================

router.post(
    "/complaints/:id/reply",
    adminMiddleware,
    replyToComplaint
);


// ======================================================
// DELETE
// ======================================================

router.post(
    "/complaints/:id/delete",
    adminMiddleware,
    deleteComplaint
);


module.exports = router;