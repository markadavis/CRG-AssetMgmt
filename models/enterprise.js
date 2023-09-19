const mongoose = require("mongoose");

const EnterpriseSchema = new mongoose.Schema({
	"code" : String,
	"text" : String
});

module.exports = mongoose.model("Enterprise", EnterpriseSchema);