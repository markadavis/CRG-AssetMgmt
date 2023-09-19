const fs = require("fs");
const mongoose = require("mongoose");


// Connect to the AHMS Mongo Database.
mongoose.connect("mongodb://localhost", {"dbName" : "ahms"}, function(oError) {
	if (oError) {
		console.error("Error connecting to the Database.");
	} else {
		console.log("Database connection successful.")
	}
});



/* ===================== */
/*  Load the data files  */
/* ===================== */

// Create the Lunchpad Configuration (tiles by group) data.
var aLunchpadConfig = [];
fs.readFile("./data/launchpad.json", function (oError, aData) {
	if (oError) {
		console.error(oError);
	} else {
		aLunchpadConfig = JSON.parse(aData);
		console.log("File launchpad.json loaded with " + aLunchpadConfig.length + " records.");
		fnSaveLaunchpadConfig();
	}
});



/* ======================== */
/*  Drop & Reload the data  */
/* ======================== */

// Drop and Reload the Launchpad Configuration Model data.
var fnSaveLaunchpadConfig = function() {
	var oLaunchpadModel = require("../../../models/launchpad.js");
	oLaunchpadModel.remove({}, function(dropError) {
		if (dropError) {
			console.error("Error deleting the LaunchpadConfig Model data.");	
		} else {
			console.log("LaunchpadConfig Model successfully cleared.");	
			var fnCallback = function(insertError, aDocs) {
				if (insertError) {
					console.error("Error saving the LaunchpadConfig Model data.");
				} else {
					console.log("LaunchpadConfig Model data saved.")
				}
			};
			oLaunchpadModel.collection.insert(aLunchpadConfig, fnCallback);
		}
	});
};
