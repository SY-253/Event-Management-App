const mongoose = require("mongoose");

const operationSchema = new mongoose.Schema({
    numOfCategories: {
        type: Number,
        required: false,
    },

    numOfEvents: {
        type: Number,
        required: false,
    },

    recordsCreated: {
        type: Number,
        required: false,
    },
    
    recordsDeleted: {
        type: Number,
        required: false,
    },

    recordsUpdated: {
        type: Number,
        required: false,
    },
});

module.exports = mongoose.model("Operation", operationSchema);