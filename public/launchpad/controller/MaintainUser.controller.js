sap.ui.define([
	"cargill/ui5/ahms/launchpad/controller/BaseController",
	"sap/m/MessageBox",
	"cargill/ui5/ahms/launchpad/model/models"
], function(BaseController, MessageBox, models) {
	"use strict";

	return BaseController.extend("cargill.ui5.ahms.launchpad.controller.MaintainUser", {

		onInit: function(evt) {
			this.oComponent = this.getOwnerComponent();
			this.oView.setModel(models.createUserModel().setDefaultBindingMode("TwoWay"));

			this.oComponent.getRouter().getRoute("maintainUser").attachPatternMatched(this._onRouteMatched, this);
		},



		/* =========================================================== */
		/* begin: helper methods                                       */
		/* =========================================================== */

		handleCreateUserPress: function(oEvent) {
			var oModel = this.oView.getModel(),
				mData = oModel.getData();

			this._setPageBusy(true);

			$.ajax({
				async: false,
				type: "POST",
				url: "/data/user/add",
				data: mData,
				success: function(mResponse) {
					this.oComponent.getModel("User").setData(mResponse.data);
					this._setPageBusy(false);

					MessageBox.success("User " + mData.userId + " was created successfully.", {
						title: "Success",
						onClose: null,
						initialFocus: null
					});
				}.bind(this),
				error: function(mError) {
					this.oComponent.getModel("User").setData();
					this._setPageBusy(false);

					MessageBox.error("User " + mData.userId + " could not be created!" + "\n\n\n" + mError.message, {
						title: "Error",
						onClose: null,
						initialFocus: null
					});
				}.bind(this)
			});
		},

		handleDeleteUserPress: function(oEvent) {
			var oModel = this.oView.getModel();

			this._setPageBusy(true);

			$.ajax({
				async: false,
				type: "POST",
				url: "/data/user/remove",
				data: oModel.getData(),
				success: function(mResponse) {
					this.oComponent.getModel("User").setData(mResponse.data);
					this._setPageBusy(false);

					MessageBox.success("User " + mData.userId + " was successfully deleted.", {
						title: "Success",
						onClose: null,
						initialFocus: null
					});
				}.bind(this),
				error: function(mError) {
					this.oComponent.getModel("User").setData();
					this._setPageBusy(false);

					MessageBox.error("User " + mData.userId + " could not be deleted!" + "\n\n\n" + mError.message, {
						title: "Error",
						onClose: null,
						initialFocus: null
					});
				}.bind(this)
			});
		},



		/* =========================================================== */
		/* begin: privatge methods                                     */
		/* =========================================================== */

		_onRouteMatched: function(oEvent) {
			
		},

		_setPageBusy: function(bBusy) {
			var oPageContainer = this.getView().byId("idMaintainUserPage");
			oPageContainer.setBusy(bBusy);
		},

	});
});
