const mongoose = require("mongoose");

const TileSchema = new mongoose.Schema({
	"id": String,
	"icon": String,
	"type": String,
	"number": String,
	"numberUnit": String,
	"title": String,
	"info": String,
	"infoState": String,
});

const launchpadSchema = new mongoose.Schema({
	"LaunchpadId": String,
	"Title": String,
	"TileCollection": { type : Array , "default" : [TileSchema] }
});

module.exports = mongoose.model("LaunchpadConfig", launchpadSchema);