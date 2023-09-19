/* Answer Model CRUD methods */

const AnswerModel = require("../../models/answer.js");

const express = require("express");
const mongoose = require("mongoose");
const verifytoken = require("../../middleware/verifytoken");
const oRouter = express.Router();



/* ==================== */
/*  GET  - all Answers  */
/* ==================== */
oRouter.get("/", verifytoken, function(req, res, next) {
	var answerId = req.params.AnswerId,
		query = AnswerModel.find();

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

/* ============================= */
/*  GET  - by Category Question  */
/* ============================= */
oRouter.get("/category/:CatId/question/:QuestId", verifytoken, function(req, res, next) {
	var questionId = req.params.QuestId || "",
		categoryId = req.params.CatId || "";

	AnswerModel.find({
		CategoryId: categoryId,
		QuestionId: questionId
	}).exec().then(data => {
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(404).json({message: "No Answers Found."});
		}
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});



/* ================================== */
/*  PATCH  - Save an existing Answer  */
/* ================================== */
oRouter.patch("/:AnswerId", verifytoken, function(req, res, next) {
	if (req.params.hasOwnProperty("AnswerId") && req.params.AnswerId) {

		// remove all of the system properties.
		var mUpdateData = {};
		for (var prop in req.body) {
			if (prop.charAt(0) !== "_") {
				mUpdateData[prop] = req.body[prop];
			}
		}

		AnswerModel.update({AnswerId: req.params.AnswerId}, {$set: mUpdateData}).then(result => {
			res.status(200).json(result);
		}).catch(err => {
			res.status(500).json({"error": err});
		});
	} else {
		res.status(500).json({"error": {
			message: "No Answer given for update."
		}});
	}
});



/* ============================= */
/*  POST  - Create a new Answer  */
/* ============================= */
oRouter.post("/", verifytoken, function(req, res, next) {
	// remove all of the system properties.
	var newAnswer = {};
	for (var prop in req.body) {
		if (prop.charAt(0) !== "_") {
			newAnswer[prop] = req.body[prop];
		}
	}

	// Generate a new _id.
	newAnswer._id = new mongoose.Types.ObjectId();

	var answer = new AnswerModel(newAnswer);
	answer.save().then(result => {
		res.status(201).json({result});
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});



/* =========================== */
/*  DELETE  - remove a Answer  */
/* =========================== */
oRouter.delete("/", verifytoken, function(req, res, next) {
	var answerId = req.params.AnswerId,
		query = null;

	AnswerModel.remove({
		AnswerId: answerId
	}).exec().then(result => {
		res.status(200).json(result);
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});


module.exports = oRouter;