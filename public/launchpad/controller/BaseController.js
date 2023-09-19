sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("cargill.ui5.ahms.launchpad.controller.BaseController", {

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function(oEvent) {
			var oHistory = History.getInstance(),
				sDirection = oHistory.getDirection();

			if (sDirection !== "Backwards") {
				return;	// Only handle Back navigation here.
			}

			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("launchpad", {}, true /*no history*/);
			}
		}

	});
});