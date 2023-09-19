sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/BindingMode"
], function(JSONModel, BindingMode) {
	"use strict";

	return {

		createDeviceModel: function(oDevice) {
			var oModel = new JSONModel(oDevice);
			oModel.setDefaultBindingMode(BindingMode.OneWay);
			return oModel;
		},

		createDefaultModel: function(mData) {
			mData = mData ? mData : {
				EnterpriseId: "",
				TechnologyId: "",
				PlantId: ""
			};
			var oModel = new JSONModel(mData);
			oModel.setDefaultBindingMode(BindingMode.TwoWay);
			return oModel;
		},

		createEnterpriseModel: function(aData) {
			aData = aData ? aData : [];
			var oModel = new JSONModel(aData);
			oModel.setDefaultBindingMode(BindingMode.OneWay);
			return oModel;
		},

		createPlantModel: function(aData) {
			aData = aData ? aData : [];
			var oModel = new JSONModel(aData);
			oModel.setDefaultBindingMode(BindingMode.OneWay);
			return oModel;
		},

		createTechnologyModel: function(aData) {
			aData = aData ? aData : [];
			var oModel = new JSONModel(aData);
			oModel.setDefaultBindingMode(BindingMode.OneWay);
			return oModel;
		}
	};
});