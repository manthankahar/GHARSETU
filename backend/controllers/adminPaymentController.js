const Payment = require("../models/Payment");


// ========================================
// GET ALL PAYMENTS
// ========================================

const getAdminPayments = async (req, res) => {
    try {

        const search = req.query.search || "";
        const status = req.query.status || "";
        const method = req.query.method || "";

        const query = {};

        // ------------------------------------
        // STATUS FILTER
        // ------------------------------------

        if (status) {
            query.status = status;
        }


        // ------------------------------------
        // PAYMENT METHOD FILTER
        // ------------------------------------

        if (method) {
            query.paymentMethod = method;
        }


        // ------------------------------------
        // SEARCH
        // ------------------------------------

        if (search) {

            const searchRegex = new RegExp(search, "i");

            query.$or = [
                {
                    paymentId: searchRegex
                },
                {
                    transactionId: searchRegex
                },
                {
                    transactionReference: searchRegex
                }
            ];

        }


        // ------------------------------------
        // GET PAYMENTS
        // ------------------------------------

        const payments = await Payment.find(query)
            .populate("customer", "name email mobile")
            .populate("order", "_id")
            .sort({ createdAt: -1 });


        // ------------------------------------
        // PAYMENT STATISTICS
        // ------------------------------------

        const totalPayments =
            await Payment.countDocuments();


        const successfulPayments =
            await Payment.countDocuments({
                status: "successful"
            });


        const pendingPayments =
            await Payment.countDocuments({
                status: "pending"
            });


        const failedPayments =
            await Payment.countDocuments({
                status: "failed"
            });


        const refundedPayments =
            await Payment.countDocuments({
                status: "refunded"
            });


        return res.render("admin/payments", {

            admin: req.admin,

            payments,

            totalPayments,

            successfulPayments,

            pendingPayments,

            failedPayments,

            refundedPayments,

            search,

            status,

            method

        });

    } catch (error) {

        console.error(
            "ADMIN PAYMENTS ERROR:",
            error
        );

        return res.status(500).send(
            "Failed to load payments."
        );

    }
};



// ========================================
// GET SINGLE PAYMENT
// ========================================

const getAdminPaymentDetails = async (req, res) => {

    try {

        const payment =
            await Payment.findById(req.params.id)
                .populate(
                    "customer",
                    "name email mobile"
                )
                .populate(
                    "order"
                );


        if (!payment) {

            return res.status(404).json({
                success: false,
                message: "Payment not found."
            });

        }


        return res.status(200).json({

            success: true,

            payment

        });

    } catch (error) {

        console.error(
            "PAYMENT DETAILS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to load payment details."

        });

    }

};



module.exports = {

    getAdminPayments,

    getAdminPaymentDetails

};