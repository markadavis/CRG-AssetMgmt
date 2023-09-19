const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
	"code" : String,
	"text" : String
});

module.exports = mongoose.model("Plant", PlantSchema);