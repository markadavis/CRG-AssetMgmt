/* Category Model CRUD methods */

const CategoryModel = require("../../models/category.js");

const express = require("express");
const mongoose = require("mongoose");
const verifytoken = require("../../middleware/verifytoken");
const oUtilities = require("../../controllers/utilities.js");

const oRouter = express.Router();



/* ======================= */
/*  GET  - all Categories  */
/* ======================= */
oRouter.get("/", verifytoken, function(req, res, next) {
	var categoryId = req.params.CategoryId,
		query = CategoryModel.find();

	query.exec().then(data => {
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(404).json({message: "No Categories Found."});
		}
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});

/* ========================================= */
/*  GET  - a single Category by Category iD  */
/* ========================================= */
oRouter.get("/:CategoryId", verifytoken, function(req, res, next) {
	var categoryId = req.params.CategoryId || "";

	CategoryModel.findOne({
		CategoryId: categoryId
	}).exec().then(data => {
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(404).json({message: "Category " + categoryId + " does not exist."});
		}
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});

/* ====================================================== */
/*  GET  - all Categories by Enterprise/Technology/Plant  */
/* ====================================================== */
oRouter.get("/:EntId/:TechId/:PlantId", verifytoken, function(req, res, next) {
	var entId = req.params.EntId || "",
		techId = req.params.TechId || "",
		plantId = req.params.PlantId || "";

	CategoryModel.find({
		EnterpriseId: entId,
		TechnologyId: techId,
		PlantId: plantId
	}).exec().then(data => {
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(404).json({message: "No Categories Found."});
		}
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});



/* ==================================== */
/*  PATCH  - Save an existing Category  */
/* ==================================== */
oRouter.patch("/:CategoryId", verifytoken, function(req, res, next) {
	if (req.params.hasOwnProperty("CategoryId") && req.params.CategoryId) {

		// remove all of the system properties.
		var mUpdateData = {};
		for (var prop in req.body) {
			if (prop.charAt(0) !== "_") {
				mUpdateData[prop] = req.body[prop];
			}
		}

		CategoryModel.update({CategoryId: req.params.CategoryId}, {$set: mUpdateData}).then(result => {
			res.status(200).json(result);
		}).catch(err => {
			res.status(500).json({"error": err});
		});
	} else {
		res.status(500).json({"error": {
			message: "No Category given for update."
		}});
	}
});



/* =============================== */
/*  POST  - Create a new Category  */
/* =============================== */
oRouter.post("/", verifytoken, function(req, res, next) {
	// remove all of the system properties.
	var newCategory = {};
	for (var prop in req.body) {
		if (prop.charAt(0) !== "_") {
			newCategory[prop] = req.body[prop];
		}
	}

	// Generate a new _id.
	newCategory._id = new mongoose.Types.ObjectId();

	var category = new CategoryModel(newCategory);
	category.save().then(result => {
		res.status(201).json({result});
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});



/* ============================= */
/*  DELETE  - remove a Category  */
/* ============================= */
oRouter.delete("/", verifytoken, function(req, res, next) {
	var categoryId = req.params.CategoryId,
		query = null;

	CategoryModel.remove({
		CategoryId: categoryId
	}).exec().then(result => {
		res.status(200).json(result);
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});


module.exports = oRouter;