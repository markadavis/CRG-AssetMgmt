const mongoose = require("mongoose");
const oUtilities = require("../controllers/utilities.js");


const mCategoryDataType = {
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
};

const CategorySchema = new oUtilities.AhmsObjectKeySchema(mCategoryDataType);

// Get the Asset ID from the number range object for new Assets (create).
CategorySchema.pre('save', function(next) {
	var that = this;
	return new Promise((resolve, reject) => {
		if (!that.CategoryId) {
			// Generate a new Asset ID.
			oUtilities.getFromNumberRange("Category").then(
				function(mResponse) {	// Success
					that.CategoryId = mResponse.value;
					resolve();
				},
				function(mError) {		// Error
					reject(new Error("Unable to assign Category ID from the \"Category\" number range object!"));
				}
			);
		} else {
			resolve();
		}

	});
});

module.exports = mongoose.model("Category", CategorySchema);
