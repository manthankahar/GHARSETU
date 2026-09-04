const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ==========================================
// ADMIN SCHEMA
// ==========================================

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ["admin"],
      default: "admin"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);


// ==========================================
// PASSWORD HASH
// ==========================================

adminSchema.pre("save", async function () {

  // Password already hashed hoy to fari hash nahi karvu
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});


// ==========================================
// PASSWORD COMPARE
// ==========================================

adminSchema.methods.comparePassword = async function (enteredPassword) {

  return await bcrypt.compare(
    enteredPassword,
    this.password
  );
};


// ==========================================
// MODEL
// ==========================================

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;