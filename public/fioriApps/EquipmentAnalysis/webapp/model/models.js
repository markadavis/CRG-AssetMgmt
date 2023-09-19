sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";

	return {

		createDeviceModel: function(oDevice) {
			var oModel = new JSONModel(oDevice);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createDefaultModel: function() {
			var oModel = new JSONModel({
				AssetKey: {
					EnterpriseId: "",
					TechnologyId: "",
					PlantId: ""
				},
				Assets: []
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		createAssetModel: function() {
			var oModel = new JSONModel();
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		createAnalysisModel: function(aData) {
			var oModel = new JSONModel(aData);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		createCategoryModel: function(aData) {
			var oModel = new JSONModel(aData);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		createQuestionModel: function(aData) {
			var oModel = new JSONModel(aData);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		createAnswerModel: function(aData) {
			var oModel = new JSONModel(aData);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		createEnterpriseModel: function(aData) {
			var oModel = new JSONModel(aData);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createTechnologyModel: function(aData) {
			var oModel = new JSONModel(aData);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createPlantModel: function(aData) {
			var oModel = new JSONModel(aData);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}

	};
});