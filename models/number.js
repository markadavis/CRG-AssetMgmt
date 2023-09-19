const mongoose = require("mongoose");

const NumberRangeSchema = new mongoose.Schema({
	"numberRangeId": {
		"type": String,
		"required": true,
		"unique": true
	},
	"numberLength": {
		"type": Number,
		"default": 10
	},
	"zeroFill": {
		"type": Boolean,
		"default": true
	},
	"nextNumber": {
		"type": Number,
		"default": 1
	}
});

module.exports = mongoose.model("NumberRanges", NumberRangeSchema);