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
				CategoryKey: {
					EnterpriseId: "",
					TechnologyId: "",
					PlantId: ""
				},
				Categories: []
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		createCategoryModel: function(oData) {
			var oModel = new JSONModel(oData);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		createQuestionModel: function(oData) {
			var oModel = new JSONModel(oData);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		createAnswerModel: function(oData) {
			var oModel = new JSONModel(oData);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		createEnterpriseModel: function(oData) {
			var oModel = new JSONModel(oData);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createTechnologyModel: function(oData) {
			var oModel = new JSONModel(oData);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createPlantModel: function(oData) {
			var oModel = new JSONModel(oData);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}

	};
});