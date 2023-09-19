const mongoose = require("mongoose");

const TechnologySchema = new mongoose.Schema({
	"code" : String,
	"text" : String
});

module.exports = mongoose.model("Technology", TechnologySchema);