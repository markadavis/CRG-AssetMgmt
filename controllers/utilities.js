/* Utility Method Implementations */

const mongoose = require("mongoose");
const NumberRangeModel = require("../models/number.js");

module.exports = {

	/* ===================================== */
	/*  AHMS Object Key - Schema Construtor  */
	/* ===================================== */
	AhmsObjectKeySchema: function(mSupplementalFields) {
		var BaseSchema = require("../models/baseSchemas/ahmsObjectKey.js");

		if (mSupplementalFields) {
			BaseSchema.add(mSupplementalFields);
		}

		return BaseSchema;
	},


	/* ======================================================== */
	/*  Get the next number from a Number Range object (by ID)  */
	/* ======================================================== */
    getFromNumberRange: function(sNumberRangeId) {
		return new Promise(function(resolve, reject) {

			// Get the next number.
			NumberRangeModel.findOne({
				numberRangeId: sNumberRangeId
			}).exec().then(mData => {

				var fnGetAndUpdate = function(mNumberRange) {
					var mResponse={};
					if (mNumberRange.zeroFill) {
						mResponse.value = mNumberRange.nextNumber.toString().padStart(mNumberRange.numberLength, "0");
					} else {
						mResponse.value = mNumberRange.nextNumber;
					}
		
					// Increment the next number.
					mNumberRange.nextNumber++;
					NumberRangeModel.update(
						{numberRangeId: mNumberRange.numberRangeId},
						{$set: mNumberRange}
					).then(result => {
						resolve(mResponse);
					}).catch(err => {
						reject({"error": {
							text: "Error updating the Number Range object " + numberRangeId + "!  (" + err + ")"
						}});
					});
				};

				if(!mData) {
					// Create it if needed.
					var mNew = {};
					mNew._id = new mongoose.Types.ObjectId();
					mNew.numberRangeId = numberRangeId;

					var oNumberRange = new NumberRangeModel(mNew);
					oNumberRange.save().then(result => {
						fnGetAndUpdate(result);
					}).catch(err => {
						reject({"error": {
							text: "Unable to create Number Range " + numberRangeId + "!  (" + err + ")"
						}});
					});
			
				} else {
					fnGetAndUpdate(mData);
				}
			}).catch(err => {
				reject({"error": {
					text: "Number Range " + numberRangeId + " not found!  (" + err + ")"
				}});
			});

		});
    }

}