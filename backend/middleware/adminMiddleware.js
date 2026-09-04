const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;

    if (!token) {
      return res.redirect("/admin/login");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded.id || decoded.role !== "admin") {
      return res.redirect("/admin/login");
    }

    const admin = await Admin.findById(decoded.id).lean();

    if (!admin) {
      res.clearCookie("adminToken");
      return res.redirect("/admin/login");
    }

    if (!admin.isActive) {
      res.clearCookie("adminToken");
      return res.status(403).send("Admin account is inactive.");
    }

    req.admin = admin;
    req.user = decoded;

    next();

  } catch (error) {
    console.error("ADMIN MIDDLEWARE ERROR:", error);

    res.clearCookie("adminToken");
    return res.redirect("/admin/login");
  }
};

module.exports = adminMiddleware;