/**
 * @author Sin Yi Tan <stan0197@student.monash.edu>
 * @file Functions for RESTful API endpoints
 */

/**
 * For:
 * - Category schema
 * - Event schema
 * - Operation schema
 */
const Category = require("../models/category");
const Event = require("../models/eventMongo");
const Operation = require("../models/operation");

module.exports = {
	/**
	 * Insert a new category.
	 * @function
	 * @async
	 * @param {Object} req - Express request object.
	 * @param {Object} res - Express response object.
	 * @returns {Object} JSON response with the ID of the newly added category.
	 */
	insertCategory: async function (req, res) {
		try {
			if (req.body.image) {
				image = req.body.image;
			} else {
				image = '/placeholder.jpg';
			}
			let aCategory = new Category({ 'name': req.body.name, 'description': req.body.description, 'image': image });
			await aCategory.save();
			
			let operation = await Operation.findOne();
			operation.recordsCreated += 1;
			await operation.save();

			res.status(201).json({ id: aCategory.categoryId });
		} catch (err) {
			res.status(400).json(err);
		}
	},

	/**
	 * List all categories with their associated events.
	 * @function
	 * @async
	 * @param {Object} req - Express request object.
	 * @param {Object} res - Express response object.
	 * @returns {Object} JSON response with the list of all categories.
	 */
	listCategory: async function (req, res) {
		let allCategory = await Category.find().populate('eventsList').exec();
		res.status(200).json(allCategory);
	},

	/**
	 * Delete a category by ID and its associated events.
	 * @function
	 * @async
	 * @param {Object} req - Express request object.
	 * @param {Object} res - Express response object.
	 * @returns {Object} JSON response with acknowledgment and deleted count.
	 */
	deleteCategory: async function (req, res) {
		try {
			theCategory = await Category.findOne({ 'categoryId': req.query.categoryId });
			for (_id of theCategory.eventsList) {
				await Event.deleteOne({ '_id': _id });
			}

			let update = await Category.deleteOne({ 'categoryId': req.query.categoryId });

			let operation = await Operation.findOne();
			operation.recordsDeleted += update.deletedCount;
			await operation.save();

			res.status(200).json({ 'acknowledge': true, 'deletedCount': update.deletedCount })
		} catch (err) {
			res.status(400).json(err);
		}
	},

	/**
	 * Update a category's name and description by ID.
	 * @function
	 * @async
	 * @param {Object} req - Express request object.
	 * @param {Object} res - Express response object.
	 * @returns {Object} JSON response with a status message.
	 */
	updateCategory: async function (req, res) {
		try {
			let update = await Category.updateOne({ 'categoryId': req.body.categoryId }, { $set: { 'name': req.body.name, 'description': req.body.description } });
			
			if (update.modifiedCount === 0) {
				res.status(404).json({ status: "ID not found"});
			} else {
				let operation = await Operation.findOne();
				operation.recordsUpdated += 1;
				await operation.save();

				res.status(200).json({ status: "Category name and description updated"});
			}
		} catch (err) {
			res.status(400).json(err);
		}	
	},

	/**
	 * View a category's details.
	 * @function
	 * @async
	 * @param {Object} req - Express request object.
	 * @param {Object} res - Express response object.
	 * @returns {Object} JSON response with a status message.
	 */
	viewCategory: async function (req, res) {
		try {
			let theCategory = await Category.findOne({ 'categoryId': req.query.categoryId }).populate('eventsList').exec()
			console.log(theCategory);
			res.status(200).json(theCategory);
		} catch (err) {
			res.status(400).json(err);
		}	
	}
};
