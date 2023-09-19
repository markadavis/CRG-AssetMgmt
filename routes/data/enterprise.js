/* Enterprise Model CRUD methods */

const Enterprise = require("../../models/enterprise.js");

const express = require("express");
const verifytoken = require("../../middleware/verifytoken");
const oRouter = express.Router();

/* ========================== */
/*  GET  - by Enterprise ID. */
/* ========================== */
oRouter.get("/:EnterpriseId", verifytoken, function(req, res, next) {
	var enterpriseId = req.params.EnterpriseId,
		query = null;

	if (enterpriseId !== "*") {
		query = Enterprise.findOne({
			code: enterpriseId
		});
	} else {
		query = Enterprise.find();
	}

	query.exec().then(data => {
		res.status(200).json(data);
	}).catch(err => {
		res.status(500).json({"err": err});
	});
});

module.exports = oRouter;