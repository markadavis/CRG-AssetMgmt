const mongoose = require("mongoose");

const oAssetModel = require("./asset.js");

const AnalysisSchema = new mongoose.Schema({
	"Date": {
		"type": Date,
		"default": Date.now
	},
	"Progress": {
		"type": Number,
		"default": 0
	},
	"Score": {
		"type": Number,
		"default": 0
	},
	"Categories": [{
		"CategoryId": String,
		"Questions": [{
			"QuestionId": String,
			"AnswerId": String
		}]
	}]
});

module.exports = oAssetModel.discriminator("Analysis", AnalysisSchema);
