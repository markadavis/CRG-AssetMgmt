sap.ui.define([
	"cargill/ui5/ahms/EquipmentQuestions/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("cargill.ui5.ahms.EquipmentQuestions.controller.App", {

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this method, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		onInit: function(evt) {

		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, all of the constructed components are destroyed.
		 * @public
		 * @override
		 */
		destroy: function() {
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}

	});
});
