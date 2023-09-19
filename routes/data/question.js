/* Question Model CRUD methods */

const QuestionModel = require("../../models/question.js");

const express = require("express");
const mongoose = require("mongoose");
const verifytoken = require("../../middleware/verifytoken");
const oRouter = express.Router();



/* ======================= */
/*  GET  - all Questions  */
/* ======================= */
oRouter.get("/", verifytoken, function(req, res, next) {
	var questionId = req.params.QuestionId,
		query = QuestionModel.find();

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

/* ==================== */
/*  GET  - by Category  */
/* ==================== */
oRouter.get("/category/:CategoryId", verifytoken, function(req, res, next) {
	var categoryId = req.params.CategoryId || "";

	QuestionModel.find({
		CategoryId: categoryId
	}).exec().then(data => {
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(404).json({message: "No Questions Found."});
		}
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});



/* ==================================== */
/*  PATCH  - Save an existing Question  */
/* ==================================== */
oRouter.patch("/:QuestionId", verifytoken, function(req, res, next) {
	if (req.params.hasOwnProperty("QuestionId") && req.params.QuestionId) {

		// remove all of the system properties.
		var mUpdateData = {};
		for (var prop in req.body) {
			if (prop.charAt(0) !== "_") {
				mUpdateData[prop] = req.body[prop];
			}
		}

		QuestionModel.update({QuestionId: req.params.QuestionId}, {$set: mUpdateData}).then(result => {
			res.status(200).json(result);
		}).catch(err => {
			res.status(500).json({"error": err});
		});
	} else {
		res.status(500).json({"error": {
			message: "No Question given for update."
		}});
	}
});



/* =============================== */
/*  POST  - Create a new Question  */
/* =============================== */
oRouter.post("/", verifytoken, function(req, res, next) {
	// remove all of the system properties.
	var newQuestion = {};
	for (var prop in req.body) {
		if (prop.charAt(0) !== "_") {
			newQuestion[prop] = req.body[prop];
		}
	}

	// Generate a new _id.
	newQuestion._id = new mongoose.Types.ObjectId();

	var question = new QuestionModel(newQuestion);
	question.save().then(result => {
		res.status(201).json({result});
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});



/* ============================= */
/*  DELETE  - remove a Question  */
/* ============================= */
oRouter.delete("/", verifytoken, function(req, res, next) {
	var questionId = req.params.QuestionId,
		query = null;

	QuestionModel.remove({
		QuestionId: questionId
	}).exec().then(result => {
		res.status(200).json(result);
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});


module.exports = oRouter;