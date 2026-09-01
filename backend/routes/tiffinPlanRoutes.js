// ======================================================
// TIFFIN PLAN ROUTES
// ======================================================

const express = require("express");

const router = express.Router();


// ======================================================
// TIFFIN SELLER AUTH MIDDLEWARE
// ======================================================

const tiffinSellerAuth =
    require("../middleware/tiffinSellerAuth");


// ======================================================
// CONTROLLER
// ======================================================

const {

    createTiffinPlan,

    getTiffinPlans,

    getAddTiffinPlan,

    getTiffinPlanDetails,

    updateTiffinPlan,

    deleteTiffinPlan,

    toggleTiffinPlanStatus

} = require(
    "../controllers/tiffinPlanController"
);


// ======================================================
// GET ALL TIFFIN PLANS
// ======================================================
// GET
// /tiffin-seller/plans

router.get(

    "/plans",

    tiffinSellerAuth,

    getTiffinPlans

);


// ======================================================
// GET ADD TIFFIN PLAN PAGE
// ======================================================
// GET
// /tiffin-seller/plans/add

router.get(

    "/plans/add",

    tiffinSellerAuth,

    getAddTiffinPlan

);


// ======================================================
// GET SINGLE TIFFIN PLAN
// ======================================================
// GET
// /tiffin-seller/plans/:planId

router.get(

    "/plans/:planId",

    tiffinSellerAuth,

    getTiffinPlanDetails

);


// ======================================================
// CREATE TIFFIN PLAN
// ======================================================
// POST
// /tiffin-seller/plans

router.post(

    "/plans",

    tiffinSellerAuth,

    createTiffinPlan

);


// ======================================================
// UPDATE TIFFIN PLAN
// ======================================================
// PUT
// /tiffin-seller/plans/:planId

router.put(

    "/plans/:planId",

    tiffinSellerAuth,

    updateTiffinPlan

);


// ======================================================
// DELETE TIFFIN PLAN
// ======================================================
// DELETE
// /tiffin-seller/plans/:planId

router.delete(

    "/plans/:planId",

    tiffinSellerAuth,

    deleteTiffinPlan

);


// ======================================================
// TOGGLE PLAN STATUS
// ======================================================
// PATCH
// /tiffin-seller/plans/:planId/status

router.patch(

    "/plans/:planId/status",

    tiffinSellerAuth,

    toggleTiffinPlanStatus

);


// ======================================================
// EXPORT
// ======================================================

module.exports = router;