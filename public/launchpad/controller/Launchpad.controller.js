sap.ui.define([
	"cargill/ui5/ahms/launchpad/controller/BaseController",
	"cargill/ui5/ahms/launchpad/model/models"
], function(BaseController, models) {
	"use strict";

	return BaseController.extend("cargill.ui5.ahms.launchpad.controller.Launchpad", {

		onInit: function(evt) {
			this.oComponent = this.getOwnerComponent();

			// Create the default model.
			this.oComponent.setModel(models.createLaunchpadModel(), "LaunchpadConfig");
			this.oView.setModel(this.oComponent.getModel("LaunchpadConfig"));

			// Bind the route matched (initialization) handler.
			this.oComponent.getRouter().getRoute("launchpad").attachPatternMatched(this._onRouteMatched, this);
		},



		/* =========================================================== */
		/* begin: helper methods                                       */
		/* =========================================================== */

		handleTilePress: function(oEvent) {
			var bReplaceHistory = false, //Device.system.phone,
				oSource = oEvent.getSource(),
				sPath = oSource.getBindingContext().sPath,
				mConfig = this.oView.getModel().getProperty(sPath),
				aParts = mConfig.id.split("."),
				sAppId = aParts[aParts.length - 1];

			this.oComponent.getRouter().navTo("fioriapp", {
				appId: sAppId
			}, bReplaceHistory);

		},

		handleLogoffPress: function(oEvent) {
			$.ajax({
				async: false,
				type: "POST",
				url: "/data/user/revokeToken",
				success: function(mResponse) {
					this.oComponent.getModel("User").setData();
					this.oComponent.getRouter().navTo("login", {}, true /*no history*/ );
				}.bind(this),
				error: function(mError) {
					//TODO - Throw an error message popup.
				}
			});
		},

		handleEditPress: function(oEvent) {
			var oTileContainer = this.getView().byId("container");
			var newValue = !oTileContainer.getEditable();
			oTileContainer.setEditable(newValue);
			oEvent.getSource().setText(newValue ? "Done" : "Edit");
		},

		handleTileDelete: function(oEvent) {
			var tile = oEvent.getParameter("tile");
			oEvent.getSource().removeTile(tile);
		},



		/* =========================================================== */
		/* begin: privatge methods                                     */
		/* =========================================================== */

		_onRouteMatched: function(oEvent) {
			// Load the Launchpad meta data.
			this._getConfig(function(oError) {
				if (oError) {
					this.oComponent.getRouter().navTo("login", {}, true /*no history*/ );
				}
			}.bind(this));
		},

		_setLaunchpadBusy: function(bBusy) {
			var oTileContainer = this.getView().byId("container");
			oTileContainer.setBusy(bBusy);
		},

		/**
		 * Load the user info object.
		 * @private
		 */
		_getConfig: function(fnCallback) {
			this._setLaunchpadBusy(true);

			$.ajax({
				async: false,
				url: "/data/launchpad/AHMS",
				success: function(data) {
					this.oComponent.getModel("LaunchpadConfig").setData(data);
					this._setLaunchpadBusy(false);
					fnCallback();
				}.bind(this),
				error: function(oError) {
					this._setLaunchpadBusy(false);
					fnCallback(oError);
				}.bind(this)
			});
		}

	});
});
