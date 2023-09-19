sap.ui.define([
	"cargill/ui5/ahms/EquipmentAnalysis/controller/BaseController",
	"cargill/ui5/ahms/EquipmentAnalysis/model/models"
], function(BaseController, models) {
	"use strict";

	return BaseController.extend("cargill.ui5.ahms.EquipmentAnalysis.controller.Main", {


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

			// Create the Asset model (for navigation).
			this.oComponent.setModel(models.createAssetModel(), "Asset");

			// Set the View's default model.
			this.oView.setModel(models.createDefaultModel());

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

		onAssetChange: function(oEvent) {
			var oModel = this.oView.getModel(),
				mAssetKey = oModel.getProperty("/AssetKey");

			if (mAssetKey.EnterpriseId && mAssetKey.TechnologyId && mAssetKey.PlantId) {
				this._loadAssets({
					EnterpriseId: mAssetKey.EnterpriseId,
					TechnologyId: mAssetKey.TechnologyId,
					PlantId: mAssetKey.PlantId
				}, function(oData) {
					if (oData) {
						oModel.setProperty("/Assets", oData);
					} else {
						oModel.setProperty("/Assets", []);
					}
				}.bind(this));
			} else {
				oModel.setProperty("/Assets", []);
			}
		},

		onCreatePress : function(oEvent) {
			var oTable = this.oView.byId("idAssetTable"),
				oItem = oTable.getSelectedItem();

			if (oItem) {
				var sPath = oItem.getBindingContextPath(),
					mAsset = this.oView.getModel().getProperty(sPath);

				// Set the Asset data before navigating.
				this.oComponent.getModel("Asset").setData(mAsset);

				// Navigat to the Analysis view.
				this.oComponent.getRouter().navTo("analysis", {
					assetId: mAsset.AssetId
				});
			}
		},



		/* =========================================================== */
		/* begin: privatge methods                                     */
		/* =========================================================== */

		_onRouteMatched: function(oEvent) {
			var oModel = this.oView.getModel(),
				mAssetKey = oModel.getProperty("/AssetKey");

			// Make sure none of the Assets are selected.
			this.oView.byId("idAssetTable").removeSelections();
			
			// Clear any previously selected Asset.
			this.oComponent.getModel("Asset").setData();

			if (mAssetKey) {
				if (mAssetKey.EnterpriseId && mAssetKey.TechnologyId && mAssetKey.PlantId) {
					this._loadAssets({
						EnterpriseId: mAssetKey.EnterpriseId,
						TechnologyId: mAssetKey.TechnologyID,
						PlantId: mAssetKey.PlantId
					}, function(oData) {
						if (oData) {
							oModel.setProperty("/Assets", oData);
						} else {
							oModel.setProperty("/Assets", []);
						}
					}.bind(this));
				} else {
					Model.setProperty("/Assets", []);
				}
			} else {
				oModel.setProperty("/AssetKey", {
					EnterpriseId: "",
					TechnologyId: "",
					PlantId: ""
				});
				oModel.setProperty("/Assets", []);
			}
		},


		_loadEnterprises: function() {
			var sPath = "/data/enterprise/*";

			$.ajax({
				async: false,
				url: sPath,
				success: function(data) {
					var oModel = models.createEnterpriseModel(data);
					this.oComponent.setModel(oModel, "Enterprise");
				}.bind(this),
				error: function(err) {
					alert("No Enterprise Data Found!");
				}
			});
		},

		_loadTechnologies: function() {
			var sPath = "/data/technology/*";

			$.ajax({
				async: false,
				url: sPath,
				success: function(data) {
					var oModel = models.createTechnologyModel(data);
					this.oComponent.setModel(oModel, "Technology");
				}.bind(this),
				error: function(err) {
					alert("No Technology Data Found!");
				}
			});
		},

		_loadPlants: function() {
			var sPath = "/data/plant/*",
				oModel = models.createPlantModel();

			this.oComponent.setModel(oModel, "Plant");

			$.ajax({
				async: false,
				url: sPath,
				success: function(data) {
					oModel.setData(data);
				}.bind(this),
				error: function(err) {
					console.error("No Plant Data Found!");
				}
			});
		},

		_loadAssets: function(mKey, fnCallBack) {
			var sPath = "/data/asset/*";

			$.ajax({
				async: false,
				url: sPath,
				success: function(data) {
					for (var i in data) {
						// Convert the date from a string.
						var oDate = new Date(data[i].Analysis.Date);
						data[i].Analysis.Date = oDate;
					}
					fnCallBack(data);
				}.bind(this),
				error: function(err) {
					fnCallBack();
				}
			});
		},

		_loadAnalysis: function(sAssetId, fnCallBack) {
			var sPath = "/data/analysis/" + sAssetId;

			$.ajax({
				async: false,
				url: sPath,
				success: function(mData) {
					fnCallBack(mData);
				}.bind(this),
				error: function(oError) {
					console.error("No Analysis Data Found!");
					fnCallBack(null)
				}
			});
		}

	});
});
