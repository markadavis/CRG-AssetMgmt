const fs = require("fs");
const mongoose = require("mongoose");
const oUtilities = require("../controllers/utilities.js");


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

// Create the Enterprise LOV data.
var aEnterprises = [];
fs.readFile( __dirname + "/data/enterprises.json", function (oError, aData) {
	if (oError) {
		console.error(oError);
	} else {
		aEnterprises = JSON.parse(aData);
		console.log("File enterprises.json loaded with " + aEnterprises.length + " records.");
		fnSaveEnterprises();
	}
});


// Create the Plant LOV data.
var aPlants = [];
fs.readFile( __dirname + "/data/plants.json", function (oError, aData) {
	if (oError) {
		console.error(oError);
	} else {
		aPlants = JSON.parse(aData);
		console.log("File plants.json loaded with " + aPlants.length + " records.");
		fnSavePlants();
	}
});


// Create the Technology LOV data.
var aTechnologises = [];
fs.readFile( __dirname + "/data/technologies.json", function (oError, aData) {
	if (oError) {
		console.error(oError);
	} else {
		aTechnologises = JSON.parse(aData);
		console.log("File technologies.json loaded with " + aTechnologises.length + " records.");
		fnSaveTechnologies();
	}
});


// Create the Asset data.
var aAssets = [];
fs.readFile( __dirname + "/data/assets.json", function (oError, aData) {
	if (oError) {
		console.error(oError);
	} else {
		aAssets = JSON.parse(aData);
		console.log("File assets.json loaded with " + aAssets.length + " records.");
		fnSaveAssets()
	}
});


// Create the Category data.
// var aCategories = [];
// fs.readFile( __dirname + "/data/categories.json", function (oError, aData) {
// 	if (oError) {
// 		console.error(oError);
// 	} else {
// 		aCategories = JSON.parse(aData);
// 		console.log("File categories.json loaded with " + aCategories.length + " records.");
// 		fnSaveCategories();
// 	}
// });


// Create the Category Question data.
var aQuestions = [];
fs.readFile( __dirname + "/data/questions.json", function (oError, aData) {
	if (oError) {
		console.error(oError);
	} else {
		aQuestions = JSON.parse(aData);
		console.log("File questions.json loaded with " + aQuestions.length + " records.");
		fnSaveQuestions();
	}
});


// Create the Category Question Answer data.
var aAnswers = [];
fs.readFile( __dirname + "/data/answers.json", function (oError, aData) {
	if (oError) {
		console.error(oError);
	} else {
		aAnswers = JSON.parse(aData);
		console.log("File answers.json loaded with " + aAnswers.length + " records.");
		fnSaveAnsers();
	}
});


// Create the//  Analysis data.
// var aAnalysis = [];
// fs.readFile( __dirname + "/data/analysis.json", function (oError, aData) {
// 	if (oError) {
// 		console.error(oError);
// 	} else {
// 		aAnalysis = JSON.parse(aData);
// 		console.log("File analysis.json loaded with " + aAnalysis.length + " records.");
// 		fnSaveAnalysis();
// 	}
// });



/* ============================ */
/*  Drop & Reload the app data  */
/* ============================ */

// Drop and Reload the Enterprise Model data.
var fnSaveEnterprises = function() {
	var oEnterpriseModel = require("../models/enterprise.js");
	oEnterpriseModel.remove({}, function(dropError) {
		if (dropError) {
			console.error("Error deleting the Enterprise Model data.");
		} else {
			console.log("Enterprise Model successfully cleared.");
			var fnCallback = function(insertError, aDocs) {
				if (insertError) {
					console.error("Error saving the Enterprise Model data.");
					console.error(insertError);
				} else {
					console.log("Enterprise Model data saved.")
				}
			};
			oEnterpriseModel.insertMany(aEnterprises, fnCallback);
		}
	});
};


// Drop and Reload the Plant Model data.
var fnSavePlants = function() {
	var oPlantModel = require("../models/plant.js");
	oPlantModel.remove({}, function(dropError) {
		if (dropError) {
			console.error("Error deleting the Plant Model data.");
		} else {
			console.log("Plant Model successfully cleared.");
			var fnCallback = function(insertError, aDocs) {
				if (insertError) {
					console.error("Error saving the Plant Model data.");
					console.error(insertError);
				} else {
					console.log("Plant Model data saved.")
				}
			};
			oPlantModel.insertMany(aPlants, fnCallback);
		}
	});
};


// Drop and Reload the Technology Model data.
var fnSaveTechnologies = function() {
	var oTechnologyModel = require("../models/technology.js");
	oTechnologyModel.remove({}, function(dropError) {
		if (dropError) {
			console.error("Error deleting the Technology Model data.");
		} else {
			console.log("Technology Model successfully cleared.");
			var fnCallback = function(insertError, aDocs) {
				if (insertError) {
					console.error("Error saving the Technology Model data.");
					console.error(insertError);
				} else {
					console.log("Technology Model data saved.")
				}
			};
			oTechnologyModel.insertMany(aTechnologises, fnCallback);
		}
	});
};


// Drop and Reload the Asset Model data.
var fnSaveAssets = function() {
	var oAssetModel = require("../models/asset.js");
	oAssetModel.remove({}, function(dropError) {
		if (dropError) {
			console.error("Error deleting the Asset Model data.");	
		} else {
			console.log("Asset Model successfully cleared.");
			var fnCallback = function(insertError, aDocs) {
				if (insertError) {
					console.error("Error saving the Asset Model data.");
					console.error(insertError);
				} else {
					console.log("Asset Model data saved.")
				}
			};
			oAssetModel.insertMany(aAssets, fnCallback);
		}
	});
};


// Drop and Reload the Category Model data.
var fnSaveCategories = function() {
	var oCategoryModel = require("../models/category.js");
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
};


// Drop and Reload the Category Question Model data.
var fnSaveQuestions = function() {
	var oQuestionModel = require("../models/question.js");
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
};


// Drop and Reload the Category Question Answer Model data.
var fnSaveAnsers = function() {
	var oAnswerModel = require("../models/answer.js");
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
};


// Drop and Reload the Analysis Model data.
var fnSaveAnalysis = function() {
	var oAnalysisModel = require("../models/analysis.js");
	oAnalysisModel.remove({}, function(dropError) {
		if (dropError) {
			console.error("Error deleting the Analysis Model data.");	
		} else {
			console.log("Analysis Model successfully cleared.");
			var fnCallback = function(insertError, aDocs) {
				if (insertError) {
					console.error("Error saving the Analysis Model data.");
					console.error(insertError);
				} else {
					console.log("Analysis Model data saved.")
				}
			};
			oAnalysisModel.insertMany(aAnalysis, fnCallback);
		}
	});
};