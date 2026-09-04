const User = require("../models/user");
const Order = require("../models/Order");
const mongoose = require("mongoose");


// =====================================================
// ADMIN - CUSTOMER MANAGEMENT
// =====================================================

const getCustomers = async (req, res) => {
    try {

        // ==========================================
        // SEARCH
        // ==========================================

        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : "";

        // ==========================================
        // STATUS FILTER
        // ==========================================

        const status =
            typeof req.query.status === "string"
                ? req.query.status
                : "all";


        // ==========================================
        // BASE QUERY
        // Only customers
        // ==========================================

        const query = {
            role: "customer"
        };


        // ==========================================
        // SEARCH FILTER
        // ==========================================

        if (search) {

            query.$or = [
                {
                    name: {
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


        // ==========================================
        // ACTIVE / INACTIVE FILTER
        // ==========================================

        if (status === "active") {

            query.isActive = true;

        } else if (status === "inactive") {

            query.isActive = false;

        }


        // ==========================================
        // CUSTOMER COUNTS
        // ==========================================

        const totalCustomers =
            await User.countDocuments({
                role: "customer"
            });


        const activeCustomers =
            await User.countDocuments({
                role: "customer",
                isActive: true
            });


        const inactiveCustomers =
            await User.countDocuments({
                role: "customer",
                isActive: false
            });


        // ==========================================
        // GET CUSTOMERS
        // ==========================================

        const customers =
            await User.find(query)
                .select(
                    "name email mobile profileImage isActive createdAt"
                )
                .sort({
                    createdAt: -1
                })
                .lean();


        // ==========================================
        // RENDER
        // ==========================================

        return res.render(
            "admin/customers",
            {
                admin: req.admin,

                customers,

                totalCustomers,
                activeCustomers,
                inactiveCustomers,

                search,
                status,

                pendingRestaurants: 0,
                pendingSellers: 0
            }
        );

    } catch (error) {

        console.error(
            "ADMIN CUSTOMER MANAGEMENT ERROR:",
            error
        );

        return res.status(500).send(
            "Customer management failed."
        );
    }
};



// =====================================================
// CUSTOMER DETAILS
// =====================================================

const getCustomerDetails = async (req, res) => {

    try {

        const { id } = req.params;


        // ==========================================
        // VALIDATE ID
        // ==========================================

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid customer ID."
            });

        }


        // ==========================================
        // FIND CUSTOMER
        // ==========================================

        const customer =
            await User.findOne({
                _id: id,
                role: "customer"
            })
            .select(
                "name email mobile profileImage isActive createdAt updatedAt"
            )
            .lean();


        if (!customer) {

            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });

        }


        // ==========================================
        // ORDER COUNT
        // ==========================================

        let totalOrders = 0;

        try {

            totalOrders =
                await Order.countDocuments({
                    customer: customer._id
                });

        } catch (orderError) {

            console.log(
                "Customer order count skipped:",
                orderError.message
            );

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.json({

            success: true,

            customer: {
                _id: customer._id,
                name: customer.name,
                email: customer.email,
                mobile: customer.mobile,
                profileImage: customer.profileImage,
                isActive: customer.isActive,
                createdAt: customer.createdAt,
                updatedAt: customer.updatedAt,
                totalOrders
            }

        });

    } catch (error) {

        console.error(
            "CUSTOMER DETAILS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load customer details."
        });

    }
};



// =====================================================
// ACTIVATE / DEACTIVATE CUSTOMER
// =====================================================

const toggleCustomerStatus = async (req, res) => {

    try {

        const { id } = req.params;


        // ==========================================
        // VALIDATE ID
        // ==========================================

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid customer ID."
            });

        }


        // ==========================================
        // FIND CUSTOMER
        // ==========================================

        const customer =
            await User.findOne({
                _id: id,
                role: "customer"
            });


        if (!customer) {

            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });

        }


        // ==========================================
        // TOGGLE STATUS
        // ==========================================

        customer.isActive =
            !customer.isActive;


        await customer.save();


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.json({

            success: true,

            message:
                customer.isActive
                    ? "Customer activated successfully."
                    : "Customer deactivated successfully.",

            isActive: customer.isActive

        });

    } catch (error) {

        console.error(
            "TOGGLE CUSTOMER STATUS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update customer status."
        });

    }
};



module.exports = {
    getCustomers,
    getCustomerDetails,
    toggleCustomerStatus
};