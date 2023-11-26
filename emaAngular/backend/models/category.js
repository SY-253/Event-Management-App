/**
 * @author Sin Yi Tan <stan0197@student.monash.edu>
 */

/**
 * @const randomString module
 */
const randString = require("randomstring");

/**
 * @const mongoose module
 */
const mongoose = require("mongoose");

/**
 * Represents a Category.
     * @param {String} name - The name of the category.
     * @param {String} description - The description of the category.
     * @param {String} image - The image of the category (A path to existing static).
     * @param {Date} createdAt - The created date of the category.
     */

const categorySchema = mongoose.Schema({
    categoryId: {
        type: String,
        default: generateId()
    },
    name: {
        type: String,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z0-9 ]+$/.test(value);
            },
            message: "Name must be in alphanumeric only."
        },
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: "/placeholder.jpg"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    eventsList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    ]
});

/**
 * A function to generate a random category ID.
 * @returns An alpha-numeric string that starts with C, follows by two random uppercase characters, a hypen, and a random 4-digit number.
 */
function generateId() {
    str = 'C';

    str += randString.generate({
        length: 2,
        charset: "alphabetic",
        capitalization: "uppercase"
    });

    str += '-'

    str += Math.floor(Math.random() * (9999 - 1000) + 1000);

    return str;
}

module.exports = mongoose.model("Category", categorySchema);