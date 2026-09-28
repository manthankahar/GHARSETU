const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
},

mobile: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true
},

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        role: {
            type: String,
            enum: [
                "customer",
                "provider",
                "restaurant",
                "delivery",
                "admin"
            ],
            default: "customer"
        },

        profileImage: {
            type: String,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Prevent OverwriteModelError
const User =
    mongoose.models.User ||
    mongoose.model("User", userSchema);

module.exports = User;