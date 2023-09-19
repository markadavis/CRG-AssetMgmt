/* Launchpad Configuration Model CRUD methods */

const Launchpad = require("../../models/launchpad.js");

const express = require("express");
const verifytoken = require("../../middleware/verifytoken");

const oRouter = express.Router();


/* ======================== */
/*  GET  - by Launchpad ID  */
/* ======================== */
oRouter.get("/:LaunchpadId", verifytoken, function(req, res, next) {
	var launchpadId = req.params.LaunchpadId,
		query = null;

	if (launchpadId !== "*") {
		query = Launchpad.findOne({
			LaunchpadId: launchpadId
		});
	} else {
		query = Launchpad.find();
	}

	query.exec().then(data => {
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(404).body({message: "No Launchpad configruation found."});
		}
	}).catch(err => {
		res.status(500).json({"error": err});
	});
});


module.exports = oRouter;