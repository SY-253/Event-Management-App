
let express = require("express");
let router = express.Router();
let path = require("path");

/**
 * Set operations path
 * @const
 */
const OPERATIONS_MODEL_PATH = path.resolve(__dirname, "../models/operation"); //Important so the filepath is correct when mentioning it
const EVENTS_MONGO_MODEL_PATH = path.resolve(__dirname, "../models/eventMongo"); //Important so the filepath is correct when mentioning it
const CATEGORIES_MONGO_MODEL_PATH = path.resolve(__dirname, "../models/category"); //Important so the filepath is correct when mentioning it
/**
 * Import models
 * @const
 * @description: Import events model for use in events controller
 */
//Use all models
const Operations = require(OPERATIONS_MODEL_PATH);
const EventsMongo = require(EVENTS_MONGO_MODEL_PATH);
const CategoriesMongo = require(CATEGORIES_MONGO_MODEL_PATH);

//Every single instances of "bryan" past localhost:8080/bryan/[this] will be picked up here as defined
//via router.get

/**
 * A2 - Home index
 * @function
 * @description Router for the INDEX events page, also creates and sets the operation counter
 * @param {string} path - express path
 * @param {function} callback - express callback
 *
 */
router.get("/update-records", async function (req, res) {
    let operationsDb = await Operations.find({});

    // Use countDocuments to return number of documents
    let eventsCount = await EventsMongo.countDocuments({});
    let categoriesCount = await CategoriesMongo.countDocuments({});

    //In case no events or categories have been made at first.
    if(eventsCount === undefined) {
        eventsCount = 0;
    }

    if(categoriesCount === undefined) {
        categoriesCount = 0;
    }

    // First object, will be used
    let firstOperation = operationsDb[0];

    // If first operations object does not exist, will be created for the first time, but never again
    if (firstOperation === undefined) {
        try {
            let oneOperation = new Operations({
                numOfCategories: categoriesCount,
                numOfEvents: eventsCount,
                recordsCreated: 0,
                recordsDeleted: 0,
                recordsUpdated: 0,
            })
            await oneOperation.save();
            res.render(fileName, {operation: oneOperation});
        } catch (e) {
        }
    } else {
        //If already exists, only update numOfCategories and numOfEvents
        firstOperation.numOfCategories = categoriesCount;
        firstOperation.numOfEvents = eventsCount;

        //Save changes to database
        try {
            await firstOperation.save();
        } catch (e) {
        }
    }
  // Assuming that `operationsDb` is an object that you want to send back as a response
  res.json(firstOperation); // Send the response as JSON
});

router.get("/getOperation", async function (req, res) {
  try {
  let operationsDb = await Operations.find({});
  // First object, will be used
  let firstOperation = operationsDb[0];
  res.status(200).json(firstOperation);
  } catch (e) {
    res.status(400);
  }
});

//Need to export this to server.js for routing to work
module.exports = {
    router: router,
};
