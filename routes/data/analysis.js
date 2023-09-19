/* Analysis Model CRUD methods */

const AnalysisModel = require("../../models/analysis.js");

const express = require("express");
const mongoose = require("mongoose");
const verifytoken = require("../../middleware/verifytoken");
const oRouter = express.Router();



/* ====================================================== */
/*  GET  - Analysis by Enterprise/Plant/Technology/Asset  */
/* ====================================================== */
oRouter.get("/:EntId/:PlantId/:TechId/:AssetId", verifytoken, function(req, res, next) {
	var entId = req.params.EntId || "",
		plantId = req.params.PlantId || "",
		techId = req.params.TechId || "",
		assetId = req.params.PlantId || "";

	AnalysisModel.find({
		EnterpriseId: entId,
		PlantId: plantId,
		TechnologyId: techId,
		AssetId: assetId
	}).exec().then(data => {
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(404).json({message: "No AnalysisModel Found."});
		}
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});



/* ================================================ */
/*  PATCH  - Save an existing Analysis by Category  */
/* ================================================ */
oRouter.patch("/:EntId/:PlantId/:TechId/:AssetId/CatId", verifytoken, function(req, res, next) {
	// remove all of the system properties.
	var updates = {};
	for (var prop in req.body) {
		if (prop.charAt(0) !== "_") {
			updates[prop] = req.body[prop];
		}
	}

	AnalysisModel.update({
			EnterpriseId: req.params.EntId,
			PlantId: req.params.PlantId,
			TechnologyId: req.params.TechId,
			AssetId: req.params.AssetId,
			CategoryId: req.params.CatId
		}, {
		$set: updates
	}).then(result => {
		res.status(200).json(result);
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});



/* ========================================= */
/*  POST  - Create an new Analysis Category  */
/* ========================================= */
oRouter.post("/", verifytoken, function(req, res, next) {
	// remove all of the system properties.
	var newAnalysis = {};
	for (var prop in req.body) {
		if (prop.charAt(0) !== "_") {
			newAnalysis[prop] = req.body[prop];
		}
	}

	var analysis = new AnalysisModel(new mongoose.Types.ObjectId());

	analysis.save().then(result => {
		res.status(201).json({result});
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});



/* ===================================================== */
/*  DELETE  - Remove all existing Analysis for an Asset  */
/* ===================================================== */
oRouter.delete("/:EntId/:PlantId/:TechId/:AssetId", verifytoken, function(req, res, next) {
	var entId = req.params.EntId || "",
		plantId = req.params.PlantId || "",
		techId = req.params.TechId || "",
		assetId = req.params.PlantId || "";

	AnalysisModel.remove({
		EnterpriseId: entId,
		TechnologyId: techId,
		PlantId: plantId,
		AssetId: assetId
	}).exec().then(result => {
		res.status(200).json(result);
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});


module.exports = oRouter;