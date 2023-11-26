/**
 * @author Sin Yi Tan <stan0197@student.monash.edu>
 */

/**
 * For:
 * - express
 * - Router (express)
 * - path
 */
const express = require("express");
const router = express.Router();
const path = require("path");

/**
 * Path:
 * - Category views
 */
const CATEGORY_PATH = path.resolve(__dirname, "../views/category");

/**
 * Import:
 * - Category mongoose schema
 * - Event mongoose schema
 */
const Category = require("../models/category");
const Event = require("../models/eventMongo");
const Operation = require("../models/operation");

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static("node_modules/bootstrap/dist/css"));
app.use(express.static("images"));

app.use(express.urlencoded({extended: true}));

/**
 * A global array for category database so that it can be accessed in event controller
 * @type {Array<Category>}
 */
global.db = [];

/**
 * Task 1.1
 * @function
 * @description Route to the Add Category input page
 * @param {string} path - Endpoint path
 * @param {function} callback - Callback function
 */
router.get("/add-category", function (req, res) {
    fileName = path.join(CATEGORY_PATH, "add-category.html");
    res.sendFile(fileName);
});

/**
 * Task 1.1
 * @function
 * @description Route to handle the new category from the input and add into category database
 * @param {string} path - Endpoint path
 * @param {function} callback - Callback function
 */
router.post("/add-category", async function (req, res) {
	try {
        image = "/placeholder.jpg";
        if (req.body.image) {
            image = req.body.image;
        }
        
		let aCategory = new Category({ 'name': req.body.name, 'description': req.body.description, 'image': image });
		await aCategory.save();
			
		let operation = await Operation.findOne();
		operation.recordsCreated += 1;
		await operation.save();
	} catch (err) {
		res.send(err);
	}
});

/**
 * Task 1.2
 * @function
 * @description Route to the Category List page
 * @param {string} path - Endpoint path
 * @param {function} callback - Callback function
 */
router.get("/event-category", async function (req, res) {
    categoryDb = await Category.find({});

    fileName = path.join(CATEGORY_PATH, "event-category.html");
    res.render(fileName, {header : "Category List", categoryDb : categoryDb});
});

/**
 * Task 1.3
 * @function
 * @description Route to the Search Category By Description Keyword input page
 * @param {string} path - Endpoint path
 * @param {function} callback - Callback function
 */
router.get("/search-by-category", function (req, res) {
    fileName = path.join(CATEGORY_PATH, "search-by-category.html");
    res.render(fileName);
});

/**
 * Task 1.3
 * @function
 * @description Route to handle the description keyword from the input and redirect to Filtered Category List by Keyword page
 * @param {string} path - Endpoint path
 * @param {function} callback - Callback function
 */
router.post("/search-by-category", function (req, res) {
    let keyword = req.body.keyword;
    let searchPath = "/32880545/search-category?keyword=" + keyword;
    res.redirect(searchPath);
});

/**
 * Task 1.3
 * @function
 * @description Route to the Filtered Category List page
 * @param {string} path - Endpoint path
 * @param {function} callback - Callback function
 */
router.get("/search-category", async function (req, res) {
    keyword = req.query.keyword;

    try {
        let filteredDb = await Category.find({ 'description': RegExp(keyword, 'i') });

        let header = "Filtered by keyword: " + keyword;
    
        fileName = path.join(CATEGORY_PATH, "event-category.html");
        res.render(fileName, {header : header, categoryDb : filteredDb});
    } catch (err) {
        res.send(err);
    }
});

/**
 * Task 1.4
 * @function
 * @description Route to the Search Event input page
 * @param {string} path - Endpoint path
 * @param {function} callback - Callback function
 */
router.get("/search-event", function (req, res) {
    fileName = path.join(CATEGORY_PATH, "search-event.html");
    res.render(fileName);
});

/**
 * Task 1.4
 * @function
 * @description Route to handle the event ID from the input and redirect to Show Event Details page
 * @param {string} path - Endpoint path
 * @param {function} callback - Callback function
 */
router.post("/search-event", function (req, res) {
    let eventId = req.body.eventId;
    let eventPath = "/32880545/event/" + eventId;
    res.redirect(eventPath);
});

/**
 * Task 1.4
 * @function
 * @description Route to the Show Event Details page
 * @param {string} path - Endpoint path
 * @param {function} callback - Callback function
 */
router.get("/event/:eventId", async function (req, res) {
    let theEvent = await Event.findOne({ 'id': req.params.eventId });

    let endDate = new Date(new Date(theEvent.startDate).getTime() + theEvent.duration * 60000).toLocaleString();
    let formattedDuration = formatDuration(theEvent.duration);
    
    fileName = path.join(CATEGORY_PATH, "event.html");
    res.render(fileName, {event: theEvent, endDate: endDate, duration: formattedDuration});
});

/**
 * Task 1.5
 * @function
 * @description Route to the Delete Category input page
 * @param {string} path - Endpoint path
 * @param {function} callback - Callback function
 */
router.get("/delete-category", function (req, res) {
    fileName = path.join(CATEGORY_PATH, "delete-category.html");
    res.render(fileName);
});

/**
 * Task 1.5
 * @function
 * @description Route to handle the category ID from the input and delete the category from the database
 * @param {string} path - Endpoint path
 * @param {function} callback - Callback function
 */
router.post("/delete-category", async function (req, res) {
    try {
        theCategory = await Category.findOne({ 'categoryId': req.body.categoryId });
        for (_id of theCategory.eventsList) {
            await Event.deleteOne({ '_id': _id });
        }

        let update = await Category.deleteOne({ 'categoryId': req.body.categoryId });

        let operation = await Operation.findOne();
        operation.recordsDeleted += update.deletedCount;
        await operation.save();
        
        res.redirect("/32880545/event-category");
    } catch (err) {
        res.send(err);
    }
});

/**
 * For Task 1.4
 * @function
 * @description Method to format the event duration in minutes
 * @param {number} duration - Event duration
 * @returns The formatted duration
 */
function formatDuration(duration) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    let formattedDuration = "";
    if (hours > 0) {
        formattedDuration += `${hours} ${hours === 1 ? "hour" : "hours"}`;
        if (minutes > 0) {
            formattedDuration += ` ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
        }
    } else {
        formattedDuration += `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
    }

    return formattedDuration;
}

module.exports = {
    router: router,
    getDb: () => db  // Exporting a getter function for db
};