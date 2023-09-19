sap.ui.define([
	"cargill/ui5/ahms/launchpad/controller/BaseController",
	"sap/m/Shell",
	"sap/ui/core/ComponentContainer"
], function(BaseController, Shell, ComponentContainer) {
	"use strict";

	return BaseController.extend("cargill.ui5.ahms.launchpad.controller.FioriApp", {

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this method, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		onInit: function(evt) {
			this.oComponent = this.getOwnerComponent();

			this.oComponent.getRouter().getRoute("fioriapp").attachPatternMatched(this._onRouteMatched, this);

			this.oRouter = this.oComponent.getRouter();
			window.addEventListener("hashchange", function(oEvent) {
				var bIsLaunchpad = oEvent.newURL.indexOf("#/Launchpad") >= 0 ? true : false;
				if (bIsLaunchpad) {
					// Restart the Launchpad.
					if (!sap.ui.getCore().byId("idLaunchpadShell")) {
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
					}
				}
			}.bind(this));
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



		_onRouteMatched: function(oEvent) {
			var oCore = sap.ui.getCore(),
				oShellContainer = oCore.byId("idComponentContainer"),
				sAppId = oEvent.getParameter("arguments").appId,
				sNamespace = "",
				aTiles = this.oComponent.getModel("LaunchpadConfig").getProperty("/TileCollection");

			aTiles.forEach(function(oTile) {
				var aParts = oTile.id.split("."),
					sApp = aParts[aParts.length - 1];
				if (sAppId === sApp) {
					sNamespace = oTile.id;
				}
			});

			if (sAppId && sNamespace) {
				this.oComponent._oCurrentApp = {
					id: sAppId,
					namespace: sNamespace
				};

				var oShell = new Shell("id" + sAppId + "Shell", {
					app: new ComponentContainer({
						height: "100%",
						url: "../fioriApps/" + sAppId + "/webapp",
						name: sNamespace,
						settings: {
							id: "id" + sAppId
						}
					})
				});

				oShellContainer.destroyItems().addItem(oShell);

			} else {
				this.oComponent._sCurrentAppId = sAppId;1
				this.oComponent.getRouter().getTargets().display("notFound");
			}

		}
		// _onRouteMatched: function(oEvent) {
		// 	var oCore = sap.ui.getCore(),
		// 		oPage = this.oView.byId("idFioriAppPage"),
		// 		sAppId = oEvent.getParameter("arguments").appId,
		// 		sNamespace = "",
		// 		aTiles = this.oComponent.getModel("LaunchpadConfig").getProperty("/TileCollection");
		//
		// 	aTiles.forEach(function(oTile) {
		// 		var aParts = oTile.id.split("."),
		// 			sApp = aParts[aParts.length - 1];
		// 		if (sAppId === sApp) {
		// 			sNamespace = oTile.id;
		// 		}
		// 	});
		//
		// 	if (sAppId && sNamespace) {
		// 		this.oComponent._sCurrentAppId = sAppId;
		// 		var oApp = new sap.ui.core.ComponentContainer({
		// 			height: "100%",
		// 			url: "../fioriApps/" + sAppId + "/webapp",
		// 			name: sNamespace,
		// 			settings: {
		// 				id: "id" + sAppId
		// 			}
		// 		});
		// 	} else {
		// 		this.oComponent._sCurrentAppId = sAppId;1
		// 		this.oComponent.getRouter().getTargets().display("notFound");
		// 	}
		//
		// 	oPage.destroyContent().addContent(oApp);
		// }

	});
});
