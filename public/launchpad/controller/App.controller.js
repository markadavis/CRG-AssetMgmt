sap.ui.define([
	"cargill/ui5/ahms/launchpad/controller/BaseController",
	"cargill/ui5/ahms/launchpad/model/models"
], function(BaseController, models) {
	"use strict";

	return BaseController.extend("cargill.ui5.ahms.launchpad.controller.App", {

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this method, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		onInit: function(evt) {
			this.oComponent = this.getOwnerComponent();
			
			this.oComponent.setModel(models.createUserModel(), "User");

			this.oComponent.getRouter().getRoute("app").attachPatternMatched(this._onRouteMatched, this);
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
		 * Load the user info object.
		 * @public
		 */
		getUserAuthFromToken: function(fnCallback) {
			$.ajax({
				async: false,
				type: "GET",
				url: "/data/user/verifyToken",
				success: function(mResponse) {
					this.oComponent.getModel("User").setData(mResponse.user);
					fnCallback(true);
				}.bind(this),
				error: function(mError) {
					fnCallback(false);
				}
			});
		},



		/* =========================================================== */
		/* begin: privatge methods                                     */
		/* =========================================================== */

		_onRouteMatched: function(oEvent) {
			// Get the User info and navigate to the launchpad (if logged in, otherwise go to the login page).
			this.getUserAuthFromToken(function(bIsOkay) {
				var sRouteId = "launchpad";
				if (!bIsOkay) {
					sRouteId = "login";
				}
				this.oComponent.getRouter().navTo(sRouteId, {}, true /*no history*/);
			}.bind(this));
		}
	});
});
