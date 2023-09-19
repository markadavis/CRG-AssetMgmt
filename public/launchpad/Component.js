sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"cargill/ui5/ahms/launchpad/model/models"
], function(UIComponent, JSONModel, Device, models) {
	"use strict";

	return UIComponent.extend("cargill.ui5.ahms.launchpad.Component", {

		metadata: {
			manifest: "json"
		},

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this method, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: function() {
			// Call the base component's init function and create the App view.
			UIComponent.prototype.init.apply(this, arguments);

			// // Disable caching of AJAX responses.
			// $.ajaxSetup({
			// 	cache: false
			// });

			// Create the Device model.
			this.setModel(models.createDeviceModel(), "device");

			this.getRouter().attachBypassed(function(oEvent) {
				if (oEvent.getParameter("hash").indexOf("Launchpad/" + this._sCurrentAppId) >= 0) {
					// This belongs to the sub component (aka Fiori app).
				} else {
					this.getRouter().getTargets().display("notFound");
				}
			}, this);

			// Initialize the router.
			this.getRouter().initialize();
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
		},



		/* =========================================================== */
		/* begin: helper methods                                       */
		/* =========================================================== */

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
			getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}

	});
});
