const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
	"CategoryId": {
		"type": String,
		"required": true
	},
	"QuestionId": {
		"type": String,
		"required": true
	},
	"AnswerId": {
		"type": String,
		"required": true
	},
	"Color": {
		"type": String,
		"required": true
	},
	"Weight": {
		"type": Number,
		"required": true
	},
	"Text": {
		"type": String,
		"required": true
	}
});

module.exports = mongoose.model("Answer", AnswerSchema);