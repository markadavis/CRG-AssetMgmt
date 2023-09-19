sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Shell",
	"sap/ui/core/ComponentContainer",
	"sap/ui/core/routing/History"
], function(Controller, Shell, ComponentContainer, History) {
	"use strict";

	return Controller.extend("cargill.ui5.ahms.EquipmentList.controller.BaseController", {

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function(oEvent) {
			var oHistory = History.getInstance(),
				sDirection = oHistory.getDirection();

			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined && sPreviousHash !== "Launchpad") {
				history.go(-1);
			} else if (sPreviousHash === "Launchpad") {
				// Restart the Launchpad.
				var oShell = new Shell("idLaunchpadShell", {
					app: new ComponentContainer({
						height: "100%",
						url: "../../launchpad",
						name: "cargill.ui5.ahms.launchpad",
						settings: {
							id: "launchpad"
						}
					})
				});

				sap.ui.getCore().byId("idComponentContainer").destroyItems().addItem(oShell);
				history.go(-1);
			}
		}

	});
});
