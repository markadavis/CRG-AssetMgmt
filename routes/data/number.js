/* Enterprise Model CRUD methods */

const NumberRangeModel = require("../../models/number.js");
const oUtilities = require("../../controllers/utilities.js");

const express = require("express");
const mongoose = require("mongoose");
const verifytoken = require("../../middleware/verifytoken");
const oRouter = express.Router();



/* =========================== */
/*  GET  - by Number Range ID  */
/* =========================== */
oRouter.get("/:NbrId", verifytoken, function(req, res, next) {

	oUtilities.getFromNumberRange(req.params.NbrId).then(
		function(mResponse) {	// Success
			res.status(200).json(mResponse);
		},
		function(mError) {		// Error
			res.status(500).json(mError);
		}
	);

});

module.exports = oRouter;