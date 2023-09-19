sap.ui.define([
	"cargill/ui5/ahms/launchpad/controller/BaseController",
	"cargill/ui5/ahms/launchpad/model/models"
], function(BaseController, models) {
	"use strict";

	return BaseController.extend("cargill.ui5.ahms.launchpad.controller.Login", {

		onInit: function(evt) {
			this.oComponent = this.getOwnerComponent();

			// Bind an event handler to the [Enter] key for both form fields.
			this.oView.byId("idLogonId").onsapenter = this.handleEnterPress.bind(this);
			this.oView.byId("idLogonPassword").onsapenter = this.handleEnterPress.bind(this);

			// Attache a route match event handler
			this.oComponent.getRouter().getRoute("login").attachPatternMatched(this._onRouteMatched, this);
		},



		/* =========================================================== */
		/* begin: helper methods                                       */
		/* =========================================================== */

		handleLoginPress: function(oEvent) {
			var oModel = this.oView.getModel();

			this._setPageBusy(true);

			$.ajax({
				async: false,
				type: "POST",
				url: "/data/user/authenticate",
				data: oModel.getData(),
				success: function(data) {
					this.oComponent.getModel("User").setData(data.user);
					this._setPageBusy(false);
					this.oComponent.getRouter().navTo("launchpad", {}, true /*no history*/);
				}.bind(this),
				error: function(oError) {
					this.oComponent.getModel("User").setData();
					this._setPageBusy(false);
				}.bind(this)
			});
		},

		handleEnterPress: function(oEvent) {
			var sPath = "/userId",
				sId = oEvent.srcControl.sId,
				oInput = sap.ui.getCore().byId(sId);

			if (sId.indexOf("idLogonPassword") >= 0) {
				sPath = "/password"
			}

			this.oView.getModel().setProperty(
				sPath,
				oInput.getValue()
			);

			this.handleLoginPress();
		},

		handleNewUserPress: function(oEvent) {
			this.oComponent.getRouter().navTo("maintainUser", {}, true /*no history*/);
		},




		/* =========================================================== */
		/* begin: privatge methods                                     */
		/* =========================================================== */

		_onRouteMatched: function(oEvent) {
			// Refresh the model each time the logon page is routed to.
			this.oView.setModel(models.createLoginModel());
		},

		_setPageBusy: function(bBusy) {
			var oPageContainer = this.getView().byId("idLoginPage");
			oPageContainer.setBusy(bBusy);
		}

	});
});
