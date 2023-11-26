/**
 * @author Sin Yi Tan <stan0197@student.monash.edu>
 * @file RESTful API endpoints
 */

/**
 * For:
 * - express
 * - category controller
 * - Router (express)
 */
const express = require("express");
const categoryCont = require("../controllers/category-controller");
const router = express.Router();

/**
 * @function 
 * @description Route to add a new category
 * @param {string} path - Endpoint path
 * @param {function} callback - The callback function to handle the route
 */
router.post("/add", categoryCont.insertCategory);

/**
 * @function 
 * @description Route to list all categories
 * @param {string} path - Endpoint path
 * @param {function} callback - The callback function to handle the route
 */
router.get("/list", categoryCont.listCategory);

/**
 * @function 
 * @description Route to delete a category
 * @param {string} path - Endpoint path
 * @param {function} callback - The callback function to handle the route
 */
router.delete("/delete", categoryCont.deleteCategory);

/**
 * @function 
 * @description Route to update a category
 * @param {string} path - Endpoint path
 * @param {function} callback - The callback function to handle the route
 */
router.put("/update", categoryCont.updateCategory);

/**
 * @function 
 * @description Route to view a category's details
 * @param {string} path - Endpoint path
 * @param {function} callback - The callback function to handle the route
 */
router.get("/view", categoryCont.viewCategory);

module.exports = router;