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
var aAssets = [
	{
		"AssetId": "0",
		"EnterpriseId": "0",
		"TechnologyId": "0",
		"PlantId": "0",
		"CmmsEquipmentNumber": "0000000-000",
		"CmmsEquipmentDescription": "Eqpuipment description for the 0's",
		"EquipmentClass": "Widget",
		"CorporateAssetNumber": "11111-11-1111111",
		"Analysis": {
			"Date" : new Date(),
			"Progress": 25,
			"Score": 230
		}
	},{
		"AssetId": "1",
		"EnterpriseId": "1",
		"TechnologyId": "1",
		"PlantId": "1",
		"CmmsEquipmentNumber": "1111111-111",
		"CmmsEquipmentDescription": "Eqpuipment description for the 1's",
		"EquipmentClass": "Widget",
		"CorporateAssetNumber": "22222-22-2222222",
		"Analysis": {
			"Date" : new Date(),
			"Progress": 85,
			"Score": 202
		}
	},{
		"AssetId": "2",
		"EnterpriseId": "2",
		"TechnologyId": "2",
		"PlantId": "2",
		"CmmsEquipmentNumber": "2222222-222",
		"CmmsEquipmentDescription": "Eqpuipment description for the 2's",
		"EquipmentClass": "Widget",
		"CorporateAssetNumber": "33333-33-3333333",
		"Analysis": {
			"Date" : new Date(),
			"Progress": 100,
			"Score": 195
		}
	},{
		"AssetId": "3",
		"EnterpriseId": "3",
		"TechnologyId": "3",
		"PlantId": "3",
		"CmmsEquipmentNumber": "3333333-333",
		"CmmsEquipmentDescription": "Eqpuipment description for the 3's",
		"EquipmentClass": "Widget",
		"CorporateAssetNumber": "44444-44-4444444",
		"Analysis": {
			"Date" : new Date(),
			"Progress": 75,
			"Score": 305
		}
	},{
		"AssetId": "4",
		"EnterpriseId": "4",
		"TechnologyId": "4",
		"PlantId": "4",
		"CmmsEquipmentNumber": "4444444-444",
		"CmmsEquipmentDescription": "Eqpuipment description for the 4's",
		"EquipmentClass": "Widget",
		"CorporateAssetNumber": "55555-55-5555555",
		"Analysis": {
			"Date" : new Date(),
			"Progress": 65,
			"Score": 260
		}
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

// Define the Enterprise LOV Model schema.
var oAssetSchema = new mongoose.Schema({
	"AssetId": String,
	"EnterpriseId": String,
	"TechnologyId": String,
	"PlantId": String,
	"CmmsEquipmentNumber": String,
	"CmmsEquipmentDescription": String,
	"EquipmentClass": String,
	"CorporateAssetNumber": String,
	"Analysis": {
		"Date" :{
			"type": Date,
			"default": Date.now
		},
		"Progress": {
			"type": Number,
			"default": 0
		},
		"Score": {
			"type": Number,
			"default": 0
		}
	}
});



/* ******************* */
/*  Load the app data  */
/* ******************* */

// Drop and Reload the Enterprise Model data.
var oEnterpriseModel = mongoose.model("Enterprise", oEnterpriseSchema);
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

// Drop and Reload the Technology Model data.
var oTechnologyModel = mongoose.model("Technology", oTechnologySchema);
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

// Drop and Reload the Plant Model data.
var oPlantModel = mongoose.model("Plant", oPlantSchema);
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

// Drop and Reload the Asset Model data.
var oAssetModel = mongoose.model("Asset", oAssetSchema);
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