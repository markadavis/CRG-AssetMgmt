sap.ui.define([
	"cargill/ui5/ahms/EquipmentQuestions/controller/BaseController",
	"cargill/ui5/ahms/EquipmentQuestions/model/models"
], function(BaseController, models) {
	"use strict";

	return BaseController.extend("cargill.ui5.ahms.EquipmentQuestions.controller.Questions", {


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

			// Set the initial (empty) Question & Answer Models.
			this.oView.setModel(models.createCategoryModel(), "Category");
			this.oView.setModel(models.createQuestionModel(), "Question");
			this.oView.setModel(models.createAnswerModel(), "Answer");

			// Bind the route matched (initialization) handler.
			this.oComponent.getRouter().getRoute("questions").attachPatternMatched(this._onRouteMatched, this);

			// Apply the content density mode to the root view.
			this.oView.addStyleClass(this.oComponent.getContentDensityClass());

			// Define the "Display" mode for the Question table templates.
			this.oQuestionReadOnlyTemplate = new sap.m.ColumnListItem({
				vAlign: "Middle",
				type: "Active",
				cells: [
					new sap.m.Text({
						text: "{Question>Text}"
					}), new sap.m.Button({
						type: "Transparent",
						visible: false,
						icon: "sap-icon://sys-cancel",
						press: ""
					})
				]
			});

			// Define the "Edit" mode for the Question table templates.
			this.oQuestionEditableTemplate = new sap.m.ColumnListItem({
				vAlign: "Middle",
				type: "Inactive",
				cells: [
					new sap.m.Input({
						value: "{Question>Text}"
					}), new sap.m.Button({
						type: "Transparent",
						visible: true,
						icon: "sap-icon://sys-cancel",
						press: "onQuestionDeletePress"
					})
				]
			});
			// Define the "Display" mode for the Answer table templates.
			this.oAnswerReadOnlyTemplate = new sap.m.ColumnListItem({
				vAlign: "Middle",
				type: "Inactive",
				cells: [
					new sap.ui.core.Icon({
						color: "{Answer>Color}",
						src: "sap-icon://color-fill"
					}), new sap.m.Text({
						text: "{Answer>Weight}%",
						description: "%"
					}), new sap.m.Text({
						text: "{Answer>Text}"
					}), new sap.m.Button({
						type: "Transparent",
						visible: false,
						icon: "sap-icon://sys-cancel",
						press: ""
					})
				]
			});

			// Define the "Edit" mode for the Answer table templates.
			this.oAnswerEditableTemplate = new sap.m.ColumnListItem({
				vAlign: "Middle",
				type: "Inactive",
				cells: [
					new sap.m.Input({
						value: "{Answer>Color}"
					}), new sap.m.Input({
						value: "{Answer>Weight}",
						description: "%"
					}), new sap.m.Input({
						value: "{Answer>Text}"
					}), new sap.m.Button({
						type: "Transparent",
						visible: true,
						icon: "sap-icon://sys-cancel",
						press: "onAnswerDeletePress"
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
		// onExit: function() {
		//
		// },



		/* =========================================================== */
		/* begin: helper methods                                       */
		/* =========================================================== */

		onQuestionRowSelect: function(oEvent) {
			var oListItem = oEvent.getParameter("listItem"),
				sPath = oListItem.getBindingContextPath(),
				mQuestion = this.oView.getModel("Question").getProperty(sPath);
			this._loadAnswers(mQuestion.CategoryId, mQuestion.QuestionId, function(oData) {
				if (oData) {
					this.oView.getModel("Answer").setData(oData);
				} else {
					this.oView.getModel("Answer").setData();
				}
			}.bind(this));
		},

		onQuestionEditPress: function(oEvent) {
			this.originalQuestionData = jQuery.extend(true, [], this.oView.getModel("Question").getData());
			this._setQuestionTableMode("Edit");
		},

		onQuestionSavePress: function(oEvent) {
			var aChanges = this._getChangedQuestions();

			for (var i = 0; i < aChanges.length; i++) {
				this._updateQuestions(aChanges[i], function(mResult) {
					if (mResult) {
						this._setQuestionTableMode("Display");	
					}
				}.bind(this));
			}
		},

		onQuestionCancelPress: function(oEvent) {
			this._setQuestionTableMode("Display");
			this.oView.getModel("Question").setData(this.originalQuestionData);
		},

		onQuestionDeletePress: function(oEvent) {
			
		},

		onAnswerEditPress: function(oEvent) {
			this.originalAnswerData = jQuery.extend(true, [], this.oView.getModel("Answer").getData());
			this._setAnswerTableMode("Edit");
		},

		onAnswerSavePress: function(oEvent) {
			var aAnswers = this._getChangedAnswers();

			for (var i = 0; i < aAnswers.length; i++) {
				this._updateAnswers(aAnswers[i], function(mResult) {
					if (mResult) {
						this._setAnswerTableMode("Display");	
					}
				}.bind(this));
			}
		},

		onAnswerCancelPress: function(oEvent) {
			this._setAnswerTableMode("Display");
			this.oView.getModel("Answer").setData(this.originalAnswerData);
		},

		onAnswerDeletePress: function(oEvent) {
			
		},



		/* =========================================================== */
		/* begin: privatge methods                                     */
		/* =========================================================== */

		_onRouteMatched: function(oEvent) {
			var sCategoryId = oEvent.getParameter("arguments").categoryId;

			// Remove previously selected Questions (if any).
			var oQuestionTable = this.oView.byId("idQuestionTable");
			oQuestionTable.removeSelections();

			// Remove any residual Answers (from previously selected Questions).
			this.oView.getModel("Answer").setData();

			// Set the mode to "Display" for both Question and Answer tables.
			this._setQuestionTableMode("Display");
			this._setAnswerTableMode("Display");

			// Load the Category & Questions.
			this._loadCategory(sCategoryId, function(oData) {
				if (oData){
					// Get the header texts
					var oCategoryModel = this.oView.getModel("Category"),
						aValue = null;

					// Set the Enterprise text
					aValue = this.oComponent.getModel("Enterprise").getData().filter(function(mEnterprise) {
						return mEnterprise.code === oData.EnterpriseId
					});
					if (aValue) {
						oCategoryModel.setProperty("/EnterpriseText", aValue[0].text);
					}

					// Set the Technology text
					aValue = this.oComponent.getModel("Technology").getData().filter(function(mTechnology) {
						return mTechnology.code === oData.TechnologyId
					});
					if (aValue) {
						oCategoryModel.setProperty("/TechnologyText", aValue[0].text);
					}

					// Set the Plant text
					aValue = this.oComponent.getModel("Plant").getData().filter(function(mPlant) {
						return mPlant.code === oData.PlantId
					});
					if (aValue) {
						oCategoryModel.setProperty("/PlantText", aValue[0].text);
					}

					// Load all of the Questions for the Category.
					this._loadQuestions(oData.CategoryId, function(oData) {
						if (oData && oData.length > 0) {
							var oTable = this.oView.byId("idQuestionTable"),
								oItem = oTable.getItems().length > 0 ? oTable.getItems()[0] : null;
							if (oItem) {
								oTable.setSelectedItem(oItem);
								this._loadAnswers(oData[0].CategoryId, oData[0].QuestionId, function(){});
							}
						}
					}.bind(this));
				} else {
					this.oView.getModel("Question").setData();
				}
			}.bind(this));
		},

		_loadCategory: function(sCategoryId, fnCallBack) {
			var oModel = this.oView.getModel("Category"),
				sURL = "/data/category/" + sCategoryId;
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

		_loadQuestions: function(sCategoryId, fnCallBack) {
			var oModel = this.oView.getModel("Question"),
				sURL = "/data/question/category/" + sCategoryId;
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

		_loadAnswers: function(sCategoryId, sQuestionId, fnCallBack) {
			var oModel = this.oView.getModel("Answer"),
				sURL = "/data/answer/category/" + sCategoryId + "/question/" + sQuestionId;
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

		_getChangedQuestions() {
			var aQuestions = this.oView.getModel("Question").getData(),
				aChanges = [];

			for(var i = 0; i < aQuestions.length; i++) {
				var mData = aQuestions[i],
					mOriginalData = this.originalQuestionData.find(function(oData) {
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

		_getChangedAnswers() {
			var aAnswers = this.oView.getModel("Answer").getData(),
				aChanges = [];

			for(var i = 0; i < aAnswers.length; i++) {
				var mData = aAnswers[i],
					mOriginalData = this.originalAnswerData.find(function(oData) {
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

		_updateQuestions: function(oData, fnCallback) {
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
				url: "/data/question/" + oData._id,
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

		_updateAnswers: function(oData, fnCallback) {
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
				url: "/data/answer/" + oData._id,
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

		_setQuestionTableMode: function(sMode) {
			switch (sMode) {

				case "NoData":
					this.byId("idQuestionAddBtn").setVisible(false);
					this.byId("idQuestionCancelBtn").setVisible(false);
					this.byId("idQuestionSaveBtn").setVisible(false);
					this.byId("idQuestionEditBtn").setVisible(true);

					this.byId("idQuestionEditBtn").setEnabled(false);
					this.byId("idAnswerEditBtn").setEnabled(true);

					if (this.oQuestionReadOnlyTemplate) {
						this._rebindQuestionTable(this.oQuestionReadOnlyTemplate, "Navigation");
					}
					break;

				case "Edit":
					this.byId("idQuestionAddBtn").setVisible(true);
					this.byId("idQuestionCancelBtn").setVisible(true);
					this.byId("idQuestionSaveBtn").setVisible(true);
					this.byId("idQuestionEditBtn").setVisible(false);

					this.byId("idAnswerEditBtn").setEnabled(false);

					this._rebindQuestionTable(this.oQuestionEditableTemplate, "Edit");
					break;

				case "Display":
					this.byId("idQuestionAddBtn").setVisible(false);
					this.byId("idQuestionCancelBtn").setVisible(false);
					this.byId("idQuestionSaveBtn").setVisible(false);
					this.byId("idQuestionEditBtn").setVisible(true);

					this.byId("idQuestionEditBtn").setEnabled(true);
					this.byId("idAnswerEditBtn").setEnabled(true);

					if (this.oQuestionReadOnlyTemplate) {
						this._rebindQuestionTable(this.oQuestionReadOnlyTemplate, "Navigation");
					}
					break;
			}
		},

		_setAnswerTableMode: function(sMode) {
			switch (sMode) {

				case "NoData":
					this.byId("idAnswerAddBtn").setVisible(false);
					this.byId("idAnswerCancelBtn").setVisible(false);
					this.byId("idAnswerSaveBtn").setVisible(false);
					this.byId("idAnswerEditBtn").setVisible(true);

					this.byId("idAnswerEditBtn").setEnabled(false);
					this.byId("idQuestionEditBtn").setEnabled(true);

					if (this.oAnswerReadOnlyTemplate) {
						this._rebindAnswerTable(this.oAnswerReadOnlyTemplate, "Navigation");
					}

					this.oView.byId("idAnswerColumn1").setWidth("10%");
					this.oView.byId("idAnswerColumn2").setWidth("15%");
					this.oView.byId("idAnswerColumn3").setWidth("75%");
					break;

				case "Edit":
					this.byId("idAnswerAddBtn").setVisible(true);
					this.byId("idAnswerCancelBtn").setVisible(true);
					this.byId("idAnswerSaveBtn").setVisible(true);
					this.byId("idAnswerEditBtn").setVisible(false);

					this.byId("idQuestionEditBtn").setEnabled(false);

					this._rebindAnswerTable(this.oAnswerEditableTemplate, "Edit");


					this.oView.byId("idAnswerColumn1").setWidth("20%");
					this.oView.byId("idAnswerColumn2").setWidth("25%");
					this.oView.byId("idAnswerColumn3").setWidth("55%");
					break;

				case "Display":
					this.byId("idAnswerAddBtn").setVisible(false);
					this.byId("idAnswerCancelBtn").setVisible(false);
					this.byId("idAnswerSaveBtn").setVisible(false);
					this.byId("idAnswerEditBtn").setVisible(true);

					this.byId("idAnswerEditBtn").setEnabled(true);
					this.byId("idQuestionEditBtn").setEnabled(true);

					if (this.oAnswerReadOnlyTemplate) {
						this._rebindAnswerTable(this.oAnswerReadOnlyTemplate, "Navigation");
					}

					this.oView.byId("idAnswerColumn1").setWidth("10%");
					this.oView.byId("idAnswerColumn2").setWidth("15%");
					this.oView.byId("idAnswerColumn3").setWidth("75%");
					break;
			}
		},

		_rebindQuestionTable: function(oTemplate, sKeyboardMode) {
			this.oView.byId("idQuestionTable").bindItems({
				path: "Question>/",
				sorter: {path: "Text"},
				template: oTemplate
			}).setKeyboardMode(sKeyboardMode);
		},

		_rebindAnswerTable: function(oTemplate, sKeyboardMode) {
			this.oView.byId("idAnswerTable").bindItems({
				path: "Answer>/",
				sorter: {path: "Weight"},
				template: oTemplate
			}).setKeyboardMode(sKeyboardMode);
		}

	});
});
