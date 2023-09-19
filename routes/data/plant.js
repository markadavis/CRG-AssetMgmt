/* Plant Model data */

const Plant = require("../../models/plant.js");

const express = require("express");
const verifytoken = require("../../middleware/verifytoken");
const oRouter = express.Router();

/* ===== */
/*  GET  */
/* ===== */
oRouter.get("/:PlantId", verifytoken, function(req, res, next) {
	var plantId = req.params.PlantId,
		query = null;

	if (plantId !== "*") {
		query = Plant.findOne({
			code: plantId
		});
	} else {
		query = Plant.find();
	}

	query.exec().then(data => {
		res.status(200).json(data);
	}).catch(err => {
		res.status(500).json({"err": err});
	});
});

module.exports = oRouter;