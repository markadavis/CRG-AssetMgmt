sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createUserModel: function () {
			var oModel = new JSONModel({
				userId: "",
				email: "",
				password: ""
			});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createLaunchpadModel: function() {
			var oModel = new JSONModel();
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createLoginModel: function() {
			var oModel = new JSONModel({
				userId: "",
				password: ""
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		}

	};
});
