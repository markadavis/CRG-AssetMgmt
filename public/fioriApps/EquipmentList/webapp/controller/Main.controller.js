sap.ui.define([
	"cargill/ui5/ahms/EquipmentList/controller/BaseController",
	"cargill/ui5/ahms/EquipmentList/model/models"
], function(BaseController, models) {
	"use strict";

	return BaseController.extend("cargill.ui5.ahms.EquipmentList.controller.Main", {


		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf thd.recmobile.view.view.view.App
		 */
		onInit: function() {
			this.oComponent = this.getOwnerComponent();

			// Load the data models.
			this._loadEnterprises();
			this._loadTechnologies();
			this._loadPlants();

			// Set the View's default model.
			this.oView.setModel(models.createDefaultModel());
			this._oModel = this.oView.getModel();

			// Bind the route matched (initialization) handler.
			this.oComponent.getRouter().getRoute("main").attachPatternMatched(this._onRouteMatched, this);

			// Apply the content density mode to the root view.
			this.oView.addStyleClass(this.oComponent.getContentDensityClass());
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf thd.recmobile.view.view.view.App
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf thd.recmobile.view.view.view.App
		 */
		//	onAfterRendering: function() {
		//
		// },

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf thd.recmobile.view.view.view.App
		 */
		//	onExit: function() {
		//
		// },



		/* =========================================================== */
		/* begin: helper methods                                       */
		/* =========================================================== */

		onAssetChange: function (oEvent) {
			var mData = this._oModel.getData();

			var fnClearData = function(mDat) {
				for (var sProp in mDat) {
					if (sProp !== "EnterpriseId" &&
						sProp !== "TechnologyId" &&
						sProp !== "PlantId") {
						mDat[sProp] = "";
					}
				}
				return mDat;
			};

			if (mData.EnterpriseId && mData.TechnologyId && mData.PlantId) {
				this._loadAsset(mData, function(data) {
					if (data) {
						this._oModel.setData(data);
					} else {
						this._oModel.setData(fnClearData(mData));
					}
				}.bind(this));
			} else {
				this._oModel.setData(fnClearData(mData));
			}
		},

		onSave: function(oEvent) {
			var mData = this._oModel.getData();

			// TODO - analysis needs to be on a different schema !!!!
			mData.Analysis = {
				"Date" :new Date(),
				"Progress": 0,
				"Score": 0
			};

			this._saveAsset(mData, function(data) {
				
			});
		},



		/* =========================================================== */
		/* begin: privatge methods                                     */
		/* =========================================================== */

		_onRouteMatched: function(oEvent) {
			
		},

		_loadEnterprises: function() {
			$.ajax({
				async: false,
				url: "/data/enterprise/*",
				success: function(response) {
					var oModel = models.createEnterpriseModel(response);
					this.oComponent.setModel(oModel, "Enterprise");
				}.bind(this),
				error: function(err) {
					alert("No Enterprise Data Found!");
				}
			});
		},

		_loadTechnologies: function() {
			$.ajax({
				async: false,
				url: "/data/technology/*",
				success: function(response) {
					var oModel = models.createTechnologyModel(response);
					this.oComponent.setModel(oModel, "Technology");
				}.bind(this),
				error: function(err) {
					alert("No Technology Data Found!");
				}
			});
		},

		_loadPlants: function() {
			$.ajax({
				async: false,
				url: "/data/plant/*",
				success: function(response) {
					var oModel = models.createPlantModel(response);
					this.oComponent.setModel(oModel, "Plant");
				}.bind(this),
				error: function(err) {
					alert("No Plant Data Found!");
				}
			});
		},

		_loadAsset: function(mData, fnCallBack) {
			var sPath = "/data/asset/" + mData.EnterpriseId + '/' + mData.TechnologyId + '/' + mData.PlantId;
			$.ajax({
				async: false,
				url: sPath,
				success: function(response) {
					fnCallBack(response);
				}.bind(this),
				error: function(err) {
					fnCallBack();
				}
			});
		},

		_saveAsset: function(mData, fnCallBack) {
			if (mData && mData.AssetId) {
				$.ajax({
					async: false,
					type: "PATCH",	// Save existing Asset
					url: "/data/asset/" + mData.AssetId,
					dataType: "json",
					data: mData,
					success: function(response) {
						fnCallBack(response);
					}.bind(this),
					error: function(err) {
						fnCallBack();
					}
				});
			} else if (mData) {
				$.ajax({
					async: false,
					type: "POST",	// Create a new Asset
					url: "/data/asset/",
					dataType: "json",
					data: mData,
					success: function(response) {
						var mData = response.result;
						this._oModel.setData(mData);
						fnCallBack(response);
					}.bind(this),
					error: function(err) {
						fnCallBack();
					}
				});
			}
		}

	});
});