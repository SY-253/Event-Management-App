/**
 * @author Bryan Brady <bbra0010@student.monash.edu>
 */

/**
 * Represents an event
 * @constructor
 * @param {string} id - The generated id of the event - not required
 * @param {string} name - The name of the event - required
 * @param {string} description - The description of the event - required
 * @param {datetime} startDate - The start date of the event - required
 * @param {int} isActive - The boolean that checks if event is active - not required
 * @param {string} image - The Image path of the event - not required
 * @param {int} capacity - The capacity of the event - not required
 * @param {int} ticketsAvailable - The number of available tickets of the event - not required
 * @param {string} categoryList - An array which holds the unique mongo Id of an category - not required
 *
 */

const mongoose = require("mongoose");
// Retrieve the generateId() function previously mentioned in eventFile.js
const { generateId } = require("./eventFile");
const eventSchema = new mongoose.Schema({
    id: {
        type: String,
        default: function () {
            return generateId();
        },
        required: false,
    },
    // Validation rules: ONLY ALPHANUMERIC from a-z, A-Z, 0-9
    name: {
        type: String,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z0-9]+$/.test(value);
            },
            message: "Name is not a valid alphanumeric string!"
        },
        required: true,
    },
    description: {
        type: String,
        required: false,
    },

    // Validation explanation:
    // "^" means the pattern must match at the start of the string
    // "\d{n} represents n strings [YYYY = \d{4}]
    // "-" is just a separator
    // "T" is to separate between date and time
    // "Z" is to ensure that its is stored in UTC
    startDate: {
        type: Date,
        required: [true, 'Date is required. Please provide a valid date.'],
    },
        duration: {
            type: Number,
            required: [true, 'Duration is required. Please provide a valid duration.'],
        },
    isActive: {
        type: Boolean,
        default: true,
        required: false,
    },
    image: {
        type: String,
        default: "default.png",
        required: false,
    },
    capacity: {
        type: Number,
        default: 1000,
        validate: {
            validator: function(value) {
                return value >= 10 && value <= 2000;
            },
            message: "Capacity must be between 10 and 2000 [Inclusive]"
        },
        required: false,
    },
    // In order to default into capacity, need to use return function as it cannot be referenced directly
    // as mongo has no access to the document "capacity"
    ticketsAvailable: {
        type: Number,
        default: function () {
            return this.capacity;
        },
        required: false,
    },


    // "categoryList" will be an array that has a reference to the Category Objects [it will hold category ids]
    // We will use "populate" to reference categories via their ID
    categoryList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }]

});

module.exports = mongoose.model("Event", eventSchema);