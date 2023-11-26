/**
 * @author Bryan Brady <bbra0010@student.monash.edu>
 *
 *     Now uses this instead of it used to be inside the controllers
 */

let express = require("express");
let router = express.Router();
let path = require("path");

/**
 * Set paths
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

// Irrelevant, now use mongoDb event instead of local, letting this be now because it would break the un-updated category
let eventsDb;

//Every single instances of "bryan" past localhost:8080/bryan/[this] will be picked up here as defined
//via router.get

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * A2 portion
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/**
 * A2 - Task 2.1 - Adding Events via postman
 * Sample input:
 *
 * {
 *   "name": "test",
 *   "description": "Desc ",
 *   "startDate": "2023-08-01T22:22Z",
 *   "durationInMinutes": 100,
 *   "capacity": 100,
 *   "categories": "CCA-3001,CCA-7895"
 * }
 *
 * http://127.0.0.1:8080/bryan/api/v1/event/add
 *
 * POST request
 */

router.post("/api/v1/event/add", async function (req, res) {

    //Try to see if works, if not send a 404 message and displays the error message as well
    try {

        const name = req.body.name
        const description = req.body.description;
        const startDate = req.body.startDate;
        const duration = req.body.durationInMinutes;

        /////////////////////////////////
        /* Conditional for: Is Active  */
        /////////////////////////////////
        // Edited such that checkbox is originally true.
        // Strangely, the "false" value or, unchecked, in this case gives "undefined"
        // So to counteract that, check if undefined and if such, set to "false"

        let isActive = req.body.isActive;

        if (isActive === undefined) {
            isActive = false;
        }

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

        /////////////////////////////////
        /* Conditional for: Image  */
        /////////////////////////////////
        let image;
        if (!req.body.image) {
            image = "/default.png"
        } else {
            image = req.body.image;
        }
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

        /////////////////////////////////
        /* Conditional for: capacity  */
        /////////////////////////////////
        let capacity;
        if (!req.body.capacity) {
            capacity = 1000;
        } else {
            capacity = req.body.capacity;
        }
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

        /////////////////////////////////////////
        /* Conditional for: Tickets Available? */
        /////////////////////////////////////////
        //Defaults to capacity if no tickets specified
        //Done after capacity is set so ticket is never null
        let ticketsAvailable;
        if (!req.body.ticketsAvailable) {
            ticketsAvailable = capacity;
        } else {
            ticketsAvailable = req.body.ticketsAvailable;
        }
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


        ////////////////////////////////////////////////////////////
        // A2 Addition
        ////////////////////////////////////////////////////////////

        let categoryList;
        let mongoCategoryListId;
        // In order to get the ids separated by a comma, need to first use inbuilt function "split()"
        // What Split does:
        // Turns string into array that is separated by ([separator])
        // Because it becomes array, we want to trim spaces for all elements in the array
        // to do this, use map to apply to all elements in array and the arrow function notation to trim all category ids
        if(req.body.categories !== undefined) {
            categoryList = req.body.categories.split(',').map(category => category.trim());
            // Find ALL categories where id is in the categoryList and outputs in an array.
            mongoCategoryListId = await CategoriesMongo.find({ categoryId: { $in: categoryList } });
        } else {
            mongoCategoryListId = [];
        }

        let anEvent = new EventsMongo({
            name: name,
            description: description,
            startDate: startDate,
            duration: parseInt(duration),
            isActive: isActive,
            image: image,
            capacity: capacity,
            ticketsAvailable: ticketsAvailable,
            categoryList: mongoCategoryListId
        })
        await anEvent.save();

        //we can use then() and catch() for asyncthronous operations to catch errors if there are any.
        // update relevant
        updateAddCategoryEventList(anEvent.categoryList, anEvent._id)
            .catch(error);

        ////////////////////////////////////////////////////////////
        // End A2 Addition
        ////////////////////////////////////////////////////////////

        await updateCreateOperation();

        res.status(200).json(anEvent.id);

    } catch (error) {
        res.status(400).json(error.message);
    }
})

//Updates all categories listed in categoryList of a provided event categoryList
// For no hassle populate, store eventId in eventList as its _id
async function updateAddCategoryEventList(categoryList, eventId) {
    try {
        // Update the eventList of each category
        // How it works is that:
        // > map ensures the function (in this case, arrow notation function) will apply to all elements inside of
        // categoriesToUpdate array.
        // > the arrow notation function is like defining a function normally, but simpler and is inline. it takes category as parameters
        // and will push the eventId to all retrieved categories' eventList in categoriesToUpdate
        // Promise.all ensures that all category is saved first before proceeding with function
        const updatedCategories = await Promise.all(categoryList.map(async (category) => {
            category.eventsList.push(eventId);
            return await category.save();
        }));

        return updatedCategories;
    } catch (error) {
        throw error;
    }
}

/**
 * A2 - Task 2.2 - View all events & their respective categories
 * pending, need category.js to be updated by teammate to add category
 *
 * GET request
 *
 * http://127.0.0.1:8080/bryan/api/v1/event/view-all
 *
 * commented out:
 * http://127.0.0.1:8080/bryan/api/v1/category/view-all
 */
router.get("/api/v1/event/view-all", async function (req, res) {
    try {
        let events = await EventsMongo.find({}).populate('categoryList');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * A2 - Task 3.1 - Delete an event based on its generated id
 * Sample input:
 *
 * {
 * "eventId": "[event id here]"
 * }
 * DELETE request
 *
 * http://127.0.0.1:8080/bryan/api/v1/event/delete
 *
 * UPDATED TO ACCOMMODATE A3 - NOT ONLY WILL IT ACCEPT BOTH JSON, IT ALSO WORKS FOR ANGULAR PURPOSES WHERE IT USES URL
 * QUERY INSTEAD; EX: /bryan/api/v1/event/delete?eventId=[someEventId]
 */
router.delete("/api/v1/event/delete", async function (req, res) {
    try {
        let mongoEventId;

        //In order to preserve DELETE request via json object, we set 2 different scenarios
        // scenario 1: sent via query param
        // scenario 2: sent via json object
        // this function checks if there is a json object and its of eventId
        let eventId;
        if(req.body.eventId === undefined) {
          eventId = req.query.eventId;
        } else {
          eventId = req.body.eventId;
        }

        ///////////////////////////////////////////////////////
        // A2 Delete event additions
        ///////////////////////////////////////////////////////
        // Find the event object provided with id
        let thisEventObject = await EventsMongo.findOne({ id: eventId });
        // Retrieve the event object's _id
        if(thisEventObject){
            mongoEventId = thisEventObject._id;
        }

        let obj = await EventsMongo.deleteOne({ id: eventId});

        //we can use then() and catch() for asyncthronous operations to catch errors if there are any.
        updateRemoveCategoryEventList(mongoEventId)
            .catch(error => {
            });
        ///////////////////////////////////////////////////////
        // End A2 Delete event additions
        ///////////////////////////////////////////////////////

        updateDeleteOperation();

        res.json(obj);
    } catch (error) {
        res.json(error);
    }
})

// Similar to add, but this time instead of push, pop.
// Cascade delete all categories that has the eventId
async function updateRemoveCategoryEventList(mongoEventId) {
    // Retrieve all categories that has eventId in eventList
    const categoriesWithEventId = await CategoriesMongo.find({ eventList: { $in: mongoEventId } });

    //Very similar to updateAddCategoryEventList - difference being this Pops instead of pushes
    // It takes the array categoriesWithEventId and maps it to an async arrow function, removing
    // the removed event's mongoEventId from the categories' eventList
    // We use pull as it works for mongo arrays,
    try {
        const updatedCategories = await Promise.all(categoriesWithEventId.map(async (category) => {
            category.eventList.pull(mongoEventId);
            return await category.save();
        }));

        return updatedCategories;
    } catch (error) {
        throw error;
    }
}

/**
 * A2 - Task 4 - Update event name and capacity by ID
 *
 * Update event name and capacity by ID. The ID, new name and capacity are sent as a JSON object through the request body. For example:
 *
 * {
 *     "eventId":"EKU-1429",
 *     "name":"new event",
 *     "capacity":300
 * }
 *
 * PUT request
 *
 * http://127.0.0.1:8080/bryan/api/v1/event/update
 */

router.put("/api/v1/event/update", async function (req, res) {
    try {
        let id = req.body.eventId;
        let name = req.body.name;
        let capacity = req.body.capacity;

        //Modified to include direct validation as somehow updateOne does not go through schema to test validation
        if (capacity < 10 || capacity > 2000) {
          return res.status(400).json("Invalid capacity. It must be between 10 and 2000.");
        }

      // Find one with id : id and set its values
        let obj = await EventsMongo.updateOne(
            { "id": id },
            {
                $set: {
                    "name": name,
                    "capacity": capacity,
                }
            }
        );
        //If return 0, does not find anything. Else, found something.
        if(obj.modifiedCount === 0) {
            res.status(400).json("Provided event iD: " + id + " Does not exist" )
        } else {
            await updateEditOperation();
            res.status(200).json("Event ID: " + id + " Successfully updated" )
        }
    } catch (error) {
        res.status(400).json(error);
    }
})

/**
 * A2 - Operations: Create
 *
 * @description updates records created for operations
 * @returns N/A
 */
async function updateCreateOperation () {
    ////////////////////////////////////////////////////////////
    // Operation update
    ////////////////////////////////////////////////////////////
    // Get operation DB
    let operationsDb = await Operations.find({});

    // Get first operation DB
    let firstOperation = operationsDb[0];

    // Update necessary operation
    firstOperation.recordsCreated += 1;

    try {
        await firstOperation.save();
    } catch (e) {
    }
}

/**
 * A2 - Operations: Edit
 *
 * @description updates records edited for operations
 * @returns N/A
 */
async function updateEditOperation () {
////////////////////////////////////////////////////////////
    // Operation update
    ////////////////////////////////////////////////////////////
    // Get operation DB
    let operationsDb = await Operations.find({});

    // Get first operation DB
    let firstOperation = operationsDb[0];

    // Update necessary operation
    firstOperation.recordsUpdated += 1;

    try {
        await firstOperation.save();
    } catch (e) {
    }
    ////////////////////////////////////////////////////////////
    // End Operation update
    ////////////////////////////////////////////////////////////
}

/**
 * A2 - Operations: Delete
 *
 * @description updates records deleted for operations
 * @returns N/A
 */
async function updateDeleteOperation () {
    ////////////////////////////////////////////////////////////
    // Operation update
    ////////////////////////////////////////////////////////////
    // Get operation DB
    let operationsDb = await Operations.find({});

    // Get first operation DB
    let firstOperation = operationsDb[0];

    // Update necessary operation
    firstOperation.recordsDeleted += 1;

    try {
        await firstOperation.save();
    } catch (e) {
    }
    ////////////////////////////////////////////////////////////
    // End Operation update
    ////////////////////////////////////////////////////////////
}
/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * End A2 portion
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/**
 * Task 1.4 - Display an event and its details
 * @function
 * @description Find one based on provided ID
 * @param {string} path - Endpoint path
 * @param {function} callback - Callback function
 *
 * EX: /bryan/api/v1/event?eventId=[eventId]
 * NEWLY CREATED BACKEND
 */
router.get("/get-event", async function (req, res) {

  try {
    const eventId = req.query.eventId;
    const event = await EventsMongo.findOne({"id": eventId}).populate('categoryList');

    if (!event) {
      return res.status(400).json({message: "Event not found"});
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({message: "Internal server error", error: error.message});
  }

});

/**
 * Export module so category.js can extract and make use of eventsDb and so server.js can import this controller.
 */
//Need to export this to server.js for routing to work
module.exports = {
    router: router,
    eventsDb: eventsDb,
};
