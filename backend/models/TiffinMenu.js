const mongoose = require("mongoose");

// ======================================================
// TIFFIN MENU SCHEMA
// ======================================================

const tiffinMenuSchema = new mongoose.Schema(
    {

        // ==================================================
        // TIFFIN SELLER
        // ==================================================

        seller: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "TiffinSeller",

            required: true

        },


        // ==================================================
        // DAY
        // ==================================================

        day: {

            type: String,

            enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],

            required: true

        },


        // ==================================================
        // MENU ITEMS
        // ==================================================

        items: [

            {

                name: {

                    type: String,

                    required: true,

                    trim: true

                },

                description: {

                    type: String,

                    default: "",

                    trim: true

                },

                isAvailable: {

                    type: Boolean,

                    default: true

                }

            }

        ],


        // ==================================================
        // MENU STATUS
        // ==================================================

        isActive: {

            type: Boolean,

            default: true

        }

    },

    {

        timestamps: true

    }

);


// ======================================================
// PREVENT DUPLICATE DAY FOR SAME SELLER
// ======================================================

tiffinMenuSchema.index(
    {
        seller: 1,
        day: 1
    },
    {
        unique: true
    }
);


// ======================================================
// MODEL
// ======================================================

const TiffinMenu =
    mongoose.model(
        "TiffinMenu",
        tiffinMenuSchema
    );


// ======================================================
// EXPORT
// ======================================================

module.exports = TiffinMenu;