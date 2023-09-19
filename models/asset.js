const mongoose = require("mongoose");
const oUtilities = require("../controllers/utilities.js");


const mAssetDataType = {
	"AssetId": {
		"type": String,
		"required": false
	},
	"CmmsEquipmentNumber": {
		"type": String,
		"required": false
	},
	"CmmsEquipmentDescription": {
		"type": String,
		"required": false
	},
	"EquipmentClass": {
		"type": String,
		"required": false
	},
	"CorporateAssetNumber": {
		"type": String,
		"required": false
	}

	,"Analysis": {
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
};

const AssetSchema = new oUtilities.AhmsObjectKeySchema(mAssetDataType);


// Get the Asset ID from the number range object for new Assets (create).
AssetSchema.pre('save', function(next) {
	var that = this;
	return new Promise((resolve, reject) => {
		if (!that.AssetId) {
			// Generate a new Asset ID.
			oUtilities.getFromNumberRange("Asset").then(
				function(mResponse) {	// Success
					that.AssetId = mResponse.value;
					resolve();
				},
				function(mError) {		// Error
					reject(new Error("Unable to assign Asset ID from the \"Asset\" number range object!"));
				}
			);
		} else {
			resolve();
		}

	});
});


module.exports = mongoose.model("Asset", AssetSchema);
