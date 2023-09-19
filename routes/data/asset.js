/* Asset Model CRUD methods */

const AssetModel = require("../../models/asset.js");

const oExpress = require("express");
const oMongoose = require("mongoose");
const oVerifytoken = require("../../middleware/verifytoken");
const oUtilities = require("../../controllers/utilities.js");

const oRouter = oExpress.Router();



/* ==================== */
/*  GET  - by Asset ID  */
/* ==================== */
oRouter.get("/:AssetId", oVerifytoken, function(req, res, next) {
	var assetId = req.params.AssetId,
		query = null;

	if (assetId === "*") {
		query = AssetModel.find();
	} else {
		query = AssetModel.findOne({
			AssetId: assetId
		});
	}

	query.exec().then(data => {
		if (data) {
			// const mData = data.toObject();
			// res.status(200).send(mData);
			res.status(200).json(data);
		} else {
			res.status(404).json({message: "No Assets Found."});
		}
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});

/* ======================================= */
/*  GET  - by Enterprise/Technology/Plant  */
/* ======================================= */
oRouter.get("/:EntId/:TechId/:PlantId", oVerifytoken, function(req, res, next) {
	var entId = req.params.EntId || "",
		techId = req.params.TechId || "",
		plantId = req.params.PlantId || "";

	AssetModel.findOne({
		EnterpriseId: entId,
		TechnologyId: techId,
		PlantId: plantId
	}).exec().then(data => {
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(404).json({message: "No AssetModel Found."});
		}
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});



/* ================================= */
/*  PATCH  - Save an existing Asset  */
/* ================================= */
oRouter.patch("/:AssetId", oVerifytoken, function(req, res, next) {

	// remove all of the system properties.
	var updates = {};
	for (var prop in req.body) {
		if (prop.charAt(0) !== "_") {
			updates[prop] = req.body[prop];
		}
	}

	AssetModel.update({AssetId: req.params.AssetId},{$set: updates}).then(result => {
		res.status(200).json(result);
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});



/* ============================= */
/*  POST  - Create an new Asset  */
/* ============================= */
oRouter.post("/", oVerifytoken, function(req, res, next) {
	// remove all of the system properties.
	var newAsset = {};
	for (var prop in req.body) {
		if (prop.charAt(0) !== "_") {
			newAsset[prop] = req.body[prop];
		}
	}

	// Generate a new _id
	newAsset._id = new oMongoose.Types.ObjectId();

	var asset = new AssetModel(newAsset);
	asset.save().then(result => {
		res.status(201).json({result});
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});



/* =========================== */
/*  DELETE  - remove an Asset  */
/* =========================== */
oRouter.delete("/", oVerifytoken, function(req, res, next) {
	var assetId = req.params.AssetId,
		query = null;

	AssetModel.remove({
		AssetId: assetId
	}).exec().then(result => {
		res.status(200).json(result);
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});


module.exports = oRouter;