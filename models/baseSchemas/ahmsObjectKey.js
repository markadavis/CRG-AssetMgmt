const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
	"EnterpriseId": {
		"type": String,
		"required": true
	},
	"PlantId": {
		"type": String,
		"required": true
	},
	"TechnologyId": {
		"type": String,
		"required": true
	}
}, {
	"discriminatorKey": "__type"
});
