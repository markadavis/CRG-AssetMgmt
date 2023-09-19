const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
	"CategoryId": {
		"type": String,
		"required": true
	},
	"QuestionId": {
		"type": String,
		"required": true
	},
	"Text": {
		"type": String,
		"required": true
	}
});

module.exports = mongoose.model("Question", QuestionSchema);