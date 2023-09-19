sap.ui.define([
	"cargill/ui5/ahms/EquipmentQuestions/controller/BaseController",
	"cargill/ui5/ahms/EquipmentQuestions/model/models"
], function(BaseController, models) {
	"use strict";

	return BaseController.extend("cargill.ui5.ahms.EquipmentQuestions.controller.Main", {


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

			// Set the defult model.
			this.oView.setModel(models.createDefaultModel());

			// Set the initial (empty) Categories Model.
			this.oComponent.setModel(models.createCategoryModel(), "Category");

			// Bind the route matched (initialization) handler.
			this.oComponent.getRouter().getRoute("main").attachPatternMatched(this._onRouteMatched, this);

			// Apply the content density mode to the root view.
			this.oView.addStyleClass(this.oComponent.getContentDensityClass());

			// Define the "Display" mode table templates.
			this.oReadOnlyTemplate = new sap.m.ColumnListItem({
				vAlign: "Middle",
				type: "Navigation",
				cells: [
					new sap.m.Text({
						wrapping: false,
						text: "{Category>Name}"
					}), new sap.m.Text({
						wrapping: false,
						text: "{Category>Weight}"
					})
				]
			});

			// Define the "Edit" mode table templates.
			this.oEditableTemplate = new sap.m.ColumnListItem({
				vAlign: "Middle",
				type: "Inactive",
				cells: [
					new sap.m.Text({
						wrapping: false,
						text: "{Category>Name}"
					}), new sap.m.Input({
						width: "10em",
						value: "{Category>Weight}",
						description: "%"
					})
				]
			});
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
		onExit: function() {
			this.oComponent.getModel("Category").setData();
		},



		/* =========================================================== */
		/* begin: helper methods                                       */
		/* =========================================================== */

		onCategoryChange: function(oEvent) {
			var oModel = this.oView.getModel(),
				oModelData = oModel.getData(),
				sElementId = oEvent.getSource().getId();

			if (sElementId.indexOf("idEnterprise") >= 0) {
				oModelData.CategoryKey.EnterpriseId = this.oView.byId("idEnterprise").getSelectedKey();
			} else if (sElementId.indexOf("idTechnology") >= 0) {
				oModelData.CategoryKey.TechnologyId = this.oView.byId("idTechnology").getSelectedKey();
			} else if (sElementId.indexOf("idPlant") >= 0) {
				oModelData.CategoryKey.PlantId = this.oView.byId("idPlant").getSelectedKey();
			}

			if (oModelData.CategoryKey.EnterpriseId !== "" && 
				oModelData.CategoryKey.TechnologyId !== "" && 
				oModelData.CategoryKey.PlantId !== "") {

				this._loadCategories(oModelData.CategoryKey, function(oData) {
					if (oData && oData.length > 0) {
						oModelData.Categories = oData;
						oModel.setData(oModelData);
						this._setTableMode("Display");
					} else {
						oModelData.Categories = [];
						oModel.setData(oModelData);
						this._setTableMode("NoData");
						alert("No Categories Found!");
					}
				}.bind(this));

			} else {
				oModelData.Categories = [];
				oModel.setData(oModelData);
				this.oComponent.getModel("Category").setData();
				this._setTableMode("NoData");
			}
		},

		onRowSelection: function(oEvent) {
			var sPath = oEvent.getParameter("listItem").getBindingContextPath(),
				mCategory = this.oComponent.getModel("Category").getProperty(sPath);

			oEvent.oSource.removeSelections();

			this.oComponent.getRouter().navTo("questions", {
				categoryId: mCategory.CategoryId
			});

		},

		onCategoryEditPress: function(oEvent) {
			this.originalData = jQuery.extend(true, [], this.oComponent.getModel("Category").getData());
			this._setTableMode("Edit");
		},

		onCategorySavePress: function(oEvent) {
			var aChanges = this._getChangedCategories();

			for (var i = 0; i < aChanges.length; i++) {
				this._updateCategory(aChanges[i], function(mResult) {
					if (mResult) {
						this._setTableMode("Display");	
					}
				}.bind(this));
			}
		},

		onCategoryCancelPress: function(oEvent) {
			this._setTableMode("Display");
			this.oComponent.getModel("Category").setData(this.originalData);
		},

		onCategoryPrintPress: function(oEvent) {
			alert("Not Implemented.");
		},



		/* =========================================================== */
		/* begin: privatge methods                                     */
		/* =========================================================== */

		_onRouteMatched: function(oEvent) {
			var oModel = this.oView.getModel(),
				oData = oModel.getData();
			if (oData) {
				this.oView.byId("idEnterprise").setSelectedKey(oData.CategoryKey.EnterpriseId);
				this.oView.byId("idTechnology").setSelectedKey(oData.CategoryKey.TechnologyId);
				this.oView.byId("idPlant").setSelectedKey(oData.CategoryKey.PlantId);
				this.oComponent.getModel("Category").setData(oData.Categories);
				// oModel.setData(oData);
			}
		},


		_loadEnterprises: function() {
			$.ajax({
				async: false,
				url: "/data/enterprise/*",
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
			$.ajax({
				async: false,
				url: "/data/technology/*",
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
			var oModel = models.createPlantModel();
			this.oComponent.setModel(oModel, "Plant");
			$.ajax({
				async: false,
				url: "/data/plant/*",
				success: function(data) {
					oModel.setData(data);
				}.bind(this),
				error: function(err) {
					console.error("No Plant Data Found!");
				}
			});
		},

		_loadCategories: function(mKeys, fnCallBack) {
			var oModel = this.oComponent.getModel("Category"),
				sURL = "/data/category/" + mKeys.EnterpriseId + "/" + mKeys.TechnologyId + "/" + mKeys.PlantId;
			$.ajax({
				async: false,
				url: sURL,
				success: function(data) {
					oModel.setData(data);
					fnCallBack(data);
				}.bind(this),
				error: function(err) {
					oModel.setData();
					fnCallBack(null);
				}
			});
		},

		_getChangedCategories() {
			var aCategories = this.oComponent.getModel("Category").getData(),
				aChanges = [];

			for(var i = 0; i < aCategories.length; i++) {
				var mData = aCategories[i],
					mOriginalData = this.originalData.find(function(oData) {
						return oData._id === mData._id;
					});

				if (mOriginalData) {
					for (var sModelProp in mData) {
						if (mOriginalData.hasOwnProperty(sModelProp) && mOriginalData[sModelProp] !== mData[sModelProp]) {
							aChanges.push(mData)
						}
					}
				}
			}

			return aChanges;
		},

		_updateCategory: function(oData, fnCallback) {
			// remove all of the system properties.
			var mData = {};
			for (var prop in oData) {
				if (prop.charAt(0) !== "_") {
					mData[prop] = oData[prop];
				}
			}

			$.ajax({
				async: false,
				type: "PATCH",	// Save existing Asset
				url: "/data/category/" + oData._id,
				dataType: "json",
				data: mData,
				success: function(mData) {
					fnCallback(mData);
				}.bind(this),
				error: function(mError) {
					fnCallback();
				}
			});
		},

		_setTableMode: function(sMode) {
			switch (sMode) {

				case "NoData":
					this.byId("idCategoryCancelBtn").setVisible(false);
					this.byId("idCategorySaveBtn").setVisible(false);
					this.byId("idCategoryEditBtn").setVisible(true);
					this.byId("idCategoryPrintBtn").setVisible(true);

					this.byId("idCategoryEditBtn").setEnabled(false);
					this.byId("idCategoryPrintBtn").setEnabled(false);

					if (this.oReadOnlyTemplate) {
						this._rebindTable(this.oReadOnlyTemplate, "Navigation");
					}
					break;

				case "Edit":
					this.byId("idCategoryCancelBtn").setVisible(true);
					this.byId("idCategorySaveBtn").setVisible(true);
					this.byId("idCategoryEditBtn").setVisible(false);
					this.byId("idCategoryPrintBtn").setVisible(false);

					this._rebindTable(this.oEditableTemplate, "Edit");
					break;

				case "Display":
					this.byId("idCategoryCancelBtn").setVisible(false);
					this.byId("idCategorySaveBtn").setVisible(false);
					this.byId("idCategoryEditBtn").setVisible(true);
					this.byId("idCategoryPrintBtn").setVisible(true);

					this.byId("idCategoryEditBtn").setEnabled(true);
					this.byId("idCategoryPrintBtn").setEnabled(true);

					if (this.oReadOnlyTemplate) {
						this._rebindTable(this.oReadOnlyTemplate, "Navigation");
					}
					break;
			}
		},

		_rebindTable: function(oTemplate, sKeyboardMode) {
			this.oView.byId("idCategoryTable").bindItems({
				path: "Category>/",
				sorter: {path: "Name"},
				template: oTemplate
			}).setKeyboardMode(sKeyboardMode);
		}

	});
});
