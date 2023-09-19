var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost", {"dbName" : "ahms"}, function(oError) {
	if (oError) {
		console.error("Error connecting to the Database.");
	} else {
		console.log("Database connection successful.")
	}
});



/* ****************************** */
/*  Define the data to be loaded  */
/* ****************************** */

// Create the Enterprise LOV data.
var aEnterprises = [
	{
		"code": "0",
		"text": "Enterprise Zero"
	},{
		"code": "1",
		"text": "Enterprise One"
	},{
		"code": "2",
		"text": "Enterprise Two"
	},{
		"code": "3",
		"text": "Enterprise Three"
	},{
		"code": "4",
		"text": "Enterprise Four"
	},{
		"code": "5",
		"text": "Enterprise Five"
	}
];

// Create the Technology LOV data.
var aTechnologises = [
	{
		"code": "0",
		"text": "Technology Zero"
	},{
		"code": "1",
		"text": "Technology One"
	},{
		"code": "2",
		"text": "Technology Two"
	},{
		"code": "3",
		"text": "Technology Three"
	}
];

// Create the Plant LOV data.
var aPlants = [
	{
		"code": "0",
		"text": "Plant Zero"
	},{
		"code": "1",
		"text": "Plant One"
	},{
		"code": "2",
		"text": "Plant Two"
	},{
		"code": "3",
		"text": "Plant Three"
	},{
		"code": "4",
		"text": "Plant Four"
	},{
		"code": "5",
		"text": "Plant Five"
	},{
		"code": "6",
		"text": "Plant Six"
	},{
		"code": "7",
		"text": "Plant Seven"
	},{
		"code": "8",
		"text": "Plant Eight"
	},{
		"code": "9",
		"text": "Plant Nine"
	}
];

// Create the Asset data.
var aCategories = [
	{
		"EnterpriseId": "1",
		"TechnologyId": "1",
		"PlantId": "1",
		"CategoryId": "1",
		"Name": "Safety Impact",
		"Weight": 30
	}, {
		"EnterpriseId": "1",
		"TechnologyId": "1",
		"PlantId": "1",
		"CategoryId": "2",
		"Name": "Environmental Impact",
		"Weight": 10
	}, {
		"EnterpriseId": "1",
		"TechnologyId": "1",
		"PlantId": "1",
		"CategoryId": "3",
		"Name": "Customer and Quality Impact",
		"Weight": 10
	}, {
		"EnterpriseId": "1",
		"TechnologyId": "1",
		"PlantId": "1",
		"CategoryId": "4",
		"Name": "Operational Impact",
		"Weight": 35
	}, {
		"EnterpriseId": "1",
		"TechnologyId": "1",
		"PlantId": "1",
		"CategoryId": "5",
		"Name": "Food Safety Impact",
		"Weight": 35
	}
];

var aQuestions = [
	{
		"CategoryId": "1",
		"QuestionId": "1",
		"Text": "Critical Safety Devices"
	}, {
		"CategoryId": "1",
		"QuestionId": "2",
		"Text": "Injury Potential"
	}, {
		"CategoryId": "1",
		"QuestionId": "3",
		"Text": "Fire/Explosion Potential"
	}, {
		"CategoryId": "1",
		"QuestionId": "4",
		"Text": "Less Potential"
	}, {
		"CategoryId": "1",
		"QuestionId": "5",
		"Text": "Safety During maintenance"
	}, {
		"CategoryId": "1",
		"QuestionId": "6",
		"Text": "Likelyhood of Failure"
	}
];

var aAnswers = [
	{
		"CategoryId": "1",
		"QuestionId": "1",
		"AnswerId": "1",
		"Color": "lightgrey",
		"Weight": 0,
		"Text": "Equipment has no critical safety devices"
	}, {
		"CategoryId": "1",
		"QuestionId": "1",
		"AnswerId": "2",
		"Color": "darkgrey",
		"Weight": 25,
		"Text": "Equipment has unsafe environmental conditions"
	}, {
		"CategoryId": "1",
		"QuestionId": "1",
		"AnswerId": "3",
		"Color": "grey",
		"Weight": 50,
		"Text": "Equipment has a non critical safety device interlock"
	}, {
		"CategoryId": "1",
		"QuestionId": "1",
		"AnswerId": "4",
		"Color": "dimgrey",
		"Weight": 75,
		"Text": "Equipment has critical safety"
	}, {
		"CategoryId": "1",
		"QuestionId": "1",
		"AnswerId": "5",
		"Color": "black",
		"Weight": 100,
		"Text": "Equipment is a critical safety device"
	},
	{
		"CategoryId": "1",
		"QuestionId": "2",
		"AnswerId": "1",
		"Color": "lightgrey",
		"Weight": 0,
		"Text": "Equipment has no critical safety devices"
	}, {
		"CategoryId": "1",
		"QuestionId": "2",
		"AnswerId": "2",
		"Color": "darkgrey",
		"Weight": 25,
		"Text": "Equipment has unsafe environmental conditions"
	}, {
		"CategoryId": "1",
		"QuestionId": "2",
		"AnswerId": "3",
		"Color": "grey",
		"Weight": 50,
		"Text": "Equipment has a non critical safety device interlock"
	}, {
		"CategoryId": "1",
		"QuestionId": "2",
		"AnswerId": "4",
		"Color": "dimgrey",
		"Weight": 75,
		"Text": "Equipment has critical safety"
	}, {
		"CategoryId": "1",
		"QuestionId": "2",
		"AnswerId": "5",
		"Color": "black",
		"Weight": 100,
		"Text": "Equipment is a critical safety device"
	},
	{
		"CategoryId": "1",
		"QuestionId": "3",
		"AnswerId": "1",
		"Color": "lightgrey",
		"Weight": 0,
		"Text": "Equipment has no critical safety devices"
	}, {
		"CategoryId": "1",
		"QuestionId": "3",
		"AnswerId": "2",
		"Color": "darkgrey",
		"Weight": 25,
		"Text": "Equipment has unsafe environmental conditions"
	}, {
		"CategoryId": "1",
		"QuestionId": "3",
		"AnswerId": "3",
		"Color": "grey",
		"Weight": 50,
		"Text": "Equipment has a non critical safety device interlock"
	}, {
		"CategoryId": "1",
		"QuestionId": "3",
		"AnswerId": "4",
		"Color": "dimgrey",
		"Weight": 75,
		"Text": "Equipment has critical safety"
	}, {
		"CategoryId": "1",
		"QuestionId": "3",
		"AnswerId": "5",
		"Color": "black",
		"Weight": 100,
		"Text": "Equipment is a critical safety device"
	},
	{
		"CategoryId": "1",
		"QuestionId": "4",
		"AnswerId": "1",
		"Color": "lightgrey",
		"Weight": 0,
		"Text": "Equipment has no critical safety devices"
	}, {
		"CategoryId": "1",
		"QuestionId": "4",
		"AnswerId": "2",
		"Color": "darkgrey",
		"Weight": 25,
		"Text": "Equipment has unsafe environmental conditions"
	}, {
		"CategoryId": "1",
		"QuestionId": "4",
		"AnswerId": "3",
		"Color": "grey",
		"Weight": 50,
		"Text": "Equipment has a non critical safety device interlock"
	}, {
		"CategoryId": "1",
		"QuestionId": "4",
		"AnswerId": "4",
		"Color": "dimgrey",
		"Weight": 75,
		"Text": "Equipment has critical safety"
	}, {
		"CategoryId": "1",
		"QuestionId": "4",
		"AnswerId": "5",
		"Color": "black",
		"Weight": 100,
		"Text": "Equipment is a critical safety device"
	},
	{
		"CategoryId": "1",
		"QuestionId": "5",
		"AnswerId": "1",
		"Color": "lightgrey",
		"Weight": 0,
		"Text": "Equipment has no critical safety devices"
	}, {
		"CategoryId": "1",
		"QuestionId": "5",
		"AnswerId": "2",
		"Color": "darkgrey",
		"Weight": 25,
		"Text": "Equipment has unsafe environmental conditions"
	}, {
		"CategoryId": "1",
		"QuestionId": "5",
		"AnswerId": "3",
		"Color": "grey",
		"Weight": 50,
		"Text": "Equipment has a non critical safety device interlock"
	}, {
		"CategoryId": "1",
		"QuestionId": "5",
		"AnswerId": "4",
		"Color": "dimgrey",
		"Weight": 75,
		"Text": "Equipment has critical safety"
	}, {
		"CategoryId": "1",
		"QuestionId": "5",
		"AnswerId": "5",
		"Color": "black",
		"Weight": 100,
		"Text": "Equipment is a critical safety device"
	},
	{
		"CategoryId": "1",
		"QuestionId": "6",
		"AnswerId": "1",
		"Color": "lightgrey",
		"Weight": 0,
		"Text": "Equipment has no critical safety devices"
	}, {
		"CategoryId": "1",
		"QuestionId": "6",
		"AnswerId": "2",
		"Color": "darkgrey",
		"Weight": 25,
		"Text": "Equipment has unsafe environmental conditions"
	}, {
		"CategoryId": "1",
		"QuestionId": "6",
		"AnswerId": "3",
		"Color": "grey",
		"Weight": 50,
		"Text": "Equipment has a non critical safety device interlock"
	}, {
		"CategoryId": "1",
		"QuestionId": "6",
		"AnswerId": "4",
		"Color": "dimgrey",
		"Weight": 75,
		"Text": "Equipment has critical safety"
	}, {
		"CategoryId": "1",
		"QuestionId": "6",
		"AnswerId": "5",
		"Color": "black",
		"Weight": 100,
		"Text": "Equipment is a critical safety device"
	}
];



/* ******************** */
/*  Define the schemas  */
/* ******************** */

// Define the Enterprise LOV Model schema.
var oEnterpriseSchema = new mongoose.Schema({
	"code": String,
	"text": String
});
// Define the Enterprise LOV Model schema.
var oTechnologySchema = new mongoose.Schema({
	"code": String,
	"text": String
});

// Define the Enterprise LOV Model schema.
var oPlantSchema = new mongoose.Schema({
	"code": String,
	"text": String
});

// Define the Category Model schema.
var oCategorySchema = new mongoose.Schema({
	"EnterpriseId": {
		"type": String,
		"required": true
	},
	"TechnologyId": {
		"type": String,
		"required": true
	},
	"PlantId": {
		"type": String,
		"required": true
	},
	"CategoryId": {
		"type": String,
		"required": true
	},
	"Name": {
		"type": String,
		"required": true
	},
	"Weight": {
		"type": Number,
		"required": true
	}
});

// Define the Question Model schema.
var oQuestionSchema = new mongoose.Schema({
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

var oAnswerSchema = new mongoose.Schema({
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

/* ******************* */
/*  Load the app data  */
/* ******************* */

// // Drop and Reload the Enterprise Model data.
// var oEnterpriseModel = mongoose.model("Enterprise", oEnterpriseSchema);
// oEnterpriseModel.remove({}, function(dropError) {
// 	if (dropError) {
// 		console.error("Error deleting the Enterprise Model data.");
// 	} else {
// 		console.log("Enterprise Model successfully cleared.");
// 		var fnCallback = function(insertError, aDocs) {
// 			if (insertError) {
// 				console.error("Error saving the Enterprise Model data.");
// 				console.error(insertError);
// 			} else {
// 				console.log("Enterprise Model data saved.")
// 			}
// 		};
// 		oEnterpriseModel.insertMany(aEnterprises, fnCallback);
// 	}
// });
//
// // Drop and Reload the Technology Model data.
// var oTechnologyModel = mongoose.model("Technology", oTechnologySchema);
// oTechnologyModel.remove({}, function(dropError) {
// 	if (dropError) {
// 		console.error("Error deleting the Technology Model data.");
// 	} else {
// 		console.log("Technology Model successfully cleared.");
// 		var fnCallback = function(insertError, aDocs) {
// 			if (insertError) {
// 				console.error("Error saving the Technology Model data.");
// 				console.error(insertError);
// 			} else {
// 				console.log("Technology Model data saved.")
// 			}
// 		};
// 		oTechnologyModel.insertMany(aTechnologises, fnCallback);
// 	}
// });
//
// // Drop and Reload the Plant Model data.
// var oPlantModel = mongoose.model("Plant", oPlantSchema);
// oPlantModel.remove({}, function(dropError) {
// 	if (dropError) {
// 		console.error("Error deleting the Plant Model data.");
// 	} else {
// 		console.log("Plant Model successfully cleared.");
// 		var fnCallback = function(insertError, aDocs) {
// 			if (insertError) {
// 				console.error("Error saving the Plant Model data.");
// 				console.error(insertError);
// 			} else {
// 				console.log("Plant Model data saved.")
// 			}
// 		};
// 		oPlantModel.insertMany(aPlants, fnCallback);
// 	}
// });

// Drop and Reload the Category Model data.
var oCategoryModel = mongoose.model("Category", oCategorySchema);
oCategoryModel.remove({}, function(dropError) {
	if (dropError) {
		console.error("Error deleting the Category Model data.");	
	} else {
		console.log("Category Model successfully cleared.");
		var fnCallback = function(insertError, aDocs) {
			if (insertError) {
				console.error("Error saving the Category Model data.");
				console.error(insertError);
			} else {
				console.log("Category Model data saved.")
			}
		};
		oCategoryModel.insertMany(aCategories, fnCallback);
	}
});

// Drop and Reload the Question Model data.
var oQuestionModel = mongoose.model("Question", oQuestionSchema);
oQuestionModel.remove({}, function(dropError) {
	if (dropError) {
		console.error("Error deleting the Question Model data.");	
	} else {
		console.log("Question Model successfully cleared.");
		var fnCallback = function(insertError, aDocs) {
			if (insertError) {
				console.error("Error saving the Question Model data.");
				console.error(insertError);
			} else {
				console.log("Question Model data saved.")
			}
		};
		oQuestionModel.insertMany(aQuestions, fnCallback);
	}
});

// Drop and Reload the Answer Model data.
var oAnswerModel = mongoose.model("Answer", oAnswerSchema);
oAnswerModel.remove({}, function(dropError) {
	if (dropError) {
		console.error("Error deleting the Answer Model data.");	
	} else {
		console.log("Answer Model successfully cleared.");
		var fnCallback = function(insertError, aDocs) {
			if (insertError) {
				console.error("Error saving the Answer Model data.");
				console.error(insertError);
			} else {
				console.log("Answer Model data saved.")
			}
		};
		oAnswerModel.insertMany(aAnswers, fnCallback);
	}
});