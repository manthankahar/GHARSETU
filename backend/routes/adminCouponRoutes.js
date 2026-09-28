const express = require("express");

const router = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");


// ===============================
// ADMIN COUPONS PAGE
// ===============================

router.get(
    "/coupons",
    adminMiddleware,
    async (req, res) => {
        try {

            // Demo data for UI
            // Backend database connection pachi
            // aa data database mathi aavse.

            const coupons = [
                {
                    _id: "demo1",
                    code: "GHAR50",
                    name: "Welcome Offer",
                    discountType: "percentage",
                    discountValue: 50,
                    minimumOrder: 299,
                    maximumDiscount: 500,
                    usedCount: 420,
                    usageLimit: 1000,
                    startDate: "2026-09-01",
                    expiryDate: "2026-09-30",
                    status: "active"
                },
                {
                    _id: "demo2",
                    code: "TIFFIN100",
                    name: "Tiffin First Order",
                    discountType: "fixed",
                    discountValue: 100,
                    minimumOrder: 399,
                    maximumDiscount: 100,
                    usedCount: 185,
                    usageLimit: 500,
                    startDate: "2026-09-01",
                    expiryDate: "2026-09-15",
                    status: "active"
                },
                {
                    _id: "demo3",
                    code: "FOOD20",
                    name: "Food Partner Offer",
                    discountType: "percentage",
                    discountValue: 20,
                    minimumOrder: 499,
                    maximumDiscount: 300,
                    usedCount: 312,
                    usageLimit: 800,
                    startDate: "2026-09-05",
                    expiryDate: "2026-10-05",
                    status: "scheduled"
                },
                {
                    _id: "demo4",
                    code: "SAVE75",
                    name: "Weekend Special",
                    discountType: "fixed",
                    discountValue: 75,
                    minimumOrder: 349,
                    maximumDiscount: 75,
                    usedCount: 275,
                    usageLimit: 300,
                    startDate: "2026-08-01",
                    expiryDate: "2026-08-31",
                    status: "expired"
                },
                {
                    _id: "demo5",
                    code: "NEWUSER150",
                    name: "New Customer Offer",
                    discountType: "fixed",
                    discountValue: 150,
                    minimumOrder: 699,
                    maximumDiscount: 150,
                    usedCount: 48,
                    usageLimit: 200,
                    startDate: "2026-09-10",
                    expiryDate: "2026-10-10",
                    status: "scheduled"
                },
                {
                    _id: "demo6",
                    code: "CAFE30",
                    name: "Cafe Orders",
                    discountType: "percentage",
                    discountValue: 30,
                    minimumOrder: 599,
                    maximumDiscount: 400,
                    usedCount: 8,
                    usageLimit: 100,
                    startDate: "2026-09-15",
                    expiryDate: "2026-10-15",
                    status: "inactive"
                }
            ];


            const totalCoupons = coupons.length;

            const activeCoupons =
                coupons.filter(function (coupon) {
                    return coupon.status === "active";
                }).length;


            const expiredCoupons =
                coupons.filter(function (coupon) {
                    return coupon.status === "expired";
                }).length;


            const totalCouponUsage =
                coupons.reduce(function (total, coupon) {
                    return total + (coupon.usedCount || 0);
                }, 0);


            return res.render(
                "admin/coupons",
                {
                    admin: req.admin,
                    coupons: coupons,
                    totalCoupons: totalCoupons,
                    activeCoupons: activeCoupons,
                    expiredCoupons: expiredCoupons,
                    totalCouponUsage: totalCouponUsage,
                    search: req.query.search || "",
                    status: req.query.status || ""
                }
            );

        } catch (error) {

            console.error(
                "ADMIN COUPONS ERROR:",
                error
            );

            return res
                .status(500)
                .send("Failed to load coupons.");

        }
    }
);


module.exports = router;