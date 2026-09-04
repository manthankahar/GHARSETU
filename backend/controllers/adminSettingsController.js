const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

// ==========================================
// GET ADMIN SETTINGS
// ==========================================
const getAdminSettings = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select("-password");

        if (!admin) {
            return res.status(404).send("Admin not found.");
        }

        return res.render("admin/settings", {
            admin
        });

    } catch (error) {
        console.error("ADMIN SETTINGS ERROR:", error);
        return res.status(500).send("Failed to load admin settings.");
    }
};


// ==========================================
// UPDATE ADMIN PROFILE
// ==========================================
const updateAdminProfile = async (req, res) => {
    try {
        const { name, email, mobile } = req.body;

        if (!name || !email || !mobile) {
            return res.status(400).send("All profile fields are required.");
        }

        const admin = await Admin.findById(req.admin._id);

        if (!admin) {
            return res.status(404).send("Admin not found.");
        }

        admin.name = name.trim();
        admin.email = email.trim().toLowerCase();
        admin.mobile = mobile.trim();

        await admin.save();

        return res.redirect("/admin/settings?success=profile");

    } catch (error) {
        console.error("ADMIN PROFILE UPDATE ERROR:", error);

        if (error.code === 11000) {
            return res.status(400).send(
                "Email or mobile number is already registered."
            );
        }

        return res.status(500).send("Failed to update admin profile.");
    }
};


// ==========================================
// CHANGE ADMIN PASSWORD
// ==========================================
const changeAdminPassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).send("All password fields are required.");
        }

        if (newPassword.length < 6) {
            return res.status(400).send(
                "New password must be at least 6 characters."
            );
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).send(
                "New password and confirm password do not match."
            );
        }

        const admin = await Admin.findById(req.admin._id);

        if (!admin) {
            return res.status(404).send("Admin not found.");
        }

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            admin.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).send(
                "Current password is incorrect."
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        admin.password = hashedPassword;

        await admin.save();

        return res.redirect("/admin/settings?success=password");

    } catch (error) {
        console.error("ADMIN PASSWORD CHANGE ERROR:", error);

        return res.status(500).send(
            "Failed to change admin password."
        );
    }
};


// ==========================================
// EXPORTS
// ==========================================
module.exports = {
    getAdminSettings,
    updateAdminProfile,
    changeAdminPassword
};