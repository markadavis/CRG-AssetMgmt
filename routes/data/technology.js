/* Technology Model data */

const Technology = require("../../models/technology.js");

const express = require("express");
const verifytoken = require("../../middleware/verifytoken");
const oRouter = express.Router();

/* ===== */
/*  GET  */
/* ===== */
oRouter.get("/:TechnologyId", verifytoken, function(req, res, next) {
	var technologyId = req.params.TechnologyId,
		query = null;

	if (technologyId !== "*") {
		query = Technology.findOne({
			code: technologyId
		});
	} else {
		query = Technology.find();
	}

	query.exec().then(data => {
		res.status(200).json(data);
	}).catch(err => {
		res.status(500).json({"err": err});
	});
});

module.exports = oRouter;