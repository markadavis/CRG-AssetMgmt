sap.ui.define([
	"cargill/ui5/ahms/EquipmentAnalysis/controller/BaseController",
	"cargill/ui5/ahms/EquipmentAnalysis/model/models"
], function(BaseController, models) {
	"use strict";

	return BaseController.extend("cargill.ui5.ahms.EquipmentAnalysis.controller.Analysis", {


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

			// Construct the view models.
			this.oView.setModel(models.createAnalysisModel([]), "Analysis");
			this.oView.setModel(models.createCategoryModel([]), "Category");
			this.oView.setModel(models.createQuestionModel([]), "Question");
			this.oView.setModel(models.createAnswerModel([]), "Answer");

			// Bind the route matched (initialization) handler.
			this.oComponent.getRouter().getRoute("analysis").attachPatternMatched(this._onRouteMatched, this);

			// Apply the content density mode to the root view.
			this.oView.addStyleClass(this.oComponent.getContentDensityClass());
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf thd.recmobile.view.view.view.App
		 */
		// onBeforeRendering: function() {
		//
		// },

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf thd.recmobile.view.view.view.App
		 */
		onAfterRendering: function() {
			// Set the Wizard's height.
			this._setWizardHeight();
		},

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

		onQuestionUpdate: function(oEvent) {
			this._NavigatToNextQuestion();
		},

		onAnswerUpdate: function(oEvent) {
            var aItems = this.oView.byId("idAnswerTable").getItems();

			// Clear the Answer Selections.
			this.oView.byId("idAnswerTable").removeSelections();

			var oItem = aItems.find(function(oItm) {
				var sPath = oItm.getBindingContextPath(),
					mAnswer = this.oView.getModel("Answer").getProperty(sPath);
				return mAnswer.AnswerId ? false : true;
			}, this);

			if (oItem) {
	            this.oView.byId("idAnswerTable").setSelectedItem(oItem); 
			}
		},

		_oPreviousQuestion: null,
		onQuestionRowSelect: function(oEvent) {
			var oListItem = oEvent.getParameter("listItem"),
				sPath = oListItem.getBindingContextPath(),
				mQuestion = this.oView.getModel("Question").getProperty(sPath);

			// Clear the answer selction.
			this.oView.byId("idAnswerTable").removeSelections();

			if (this._oPreviousQuestion) {
				if (this._oPreviousQuestion.getAggregation("cells")[1].getIcon() !== "sap-icon://accept") {
					this._oPreviousQuestion.getAggregation("cells")[1].setVisible(false);
				}
			}
			this._oPreviousQuestion = jQuery.extend(true, {}, oListItem);

			// Show the Column Selection indicator (right-arrow).
			oListItem.getAggregation("cells")[1].setVisible(true);

			this._loadAnswers(mQuestion.CategoryId, mQuestion.QuestionId, function(aData) {
				if (aData) {
					this.oView.getModel("Answer").setData(aData);
				} else {
					this.oView.getModel("Answer").setData();
				}
			}.bind(this));
		},

		_oPreviousAnswer: null,
		onAnswerSelect: function(oEvent) {
			var oAnswerListItem = oEvent.getParameter("listItem"),
				oQuestionListItem = this.oView.byId("idQuestionTable").getSelectedItem(),
				sAnswerPath = oAnswerListItem.getBindingContextPath(),
				sAnswerId = this.oView.getModel("Answer").getProperty(sAnswerPath).AnswerId,
				sQuestionPath = oQuestionListItem.getBindingContextPath(),
				sCategoryId = this.oView.getModel("Question").getProperty(sQuestionPath).CategoryId;

			if (this._oPreviousAnswer) {
				var sPreviousPath = this._oPreviousAnswer.getBindingContextPath();
				this.oView.getModel("Answer").setProperty(sPreviousPath + "/Selected", false);
			}
			this.oView.getModel("Answer").setProperty(sAnswerPath + "/Selected", true);
			this.oView.getModel("Question").setProperty(sQuestionPath + "/AnswerId", sAnswerId);

			this._updateCategoryProgress(sCategoryId);

			oQuestionListItem.getAggregation("cells")[1].setIcon("sap-icon://accept");
		},

		onNavNext: function(oEvent) {
			this._NavigatToNextQuestion();
		},



		/* =========================================================== */
		/* begin: privatge methods                                     */
		/* =========================================================== */

		_onRouteMatched: function(oEvent) {
			var mAsset = this.oComponent.getModel("Asset").getData();

			// // Reset the Wizard control.
			// var oWizard = this.oView.byId("idWizard"),
			// 	oStep = oWizard.getSteps()[0];
			// oWizard.discardProgress();

			// Clear any previously selected Questions & Answers.
			this.oView.byId("idQuestionTable").removeSelections();
			this.oView.byId("idAnswerTable").removeSelections();

			// Clear any Questions/Answers from previous navigations.
			this.oView.getModel("Question").setData([]);
			this.oView.getModel("Answer").setData([]);

			// Load the Analysis & Categories for the Asset.
			Promise.all([
				this._loadAnalysis(mAsset),
				this._loadCategories(mAsset)
			]).then(jQuery.proxy(function(oEvent) {
				// Set the Navigation buttons.
				this.oView.byId("idBtnDone").setVisible(false);
				this.oView.byId("idBtnNext").setVisible(true);

				// Set the Navigation (wizard) and load the corresponding data.
				this._NavigatToNextCategory(true /* Navigation reset - Start at first step */);
			}, this));
		},

		_setWizardHeight: function() {
			var oWizard = this.oView.byId("idWizard"),
				oNav = oWizard.mAggregations._progressNavigator,
				oDom = $("#" + oNav.getId()),
				sPixels = (oDom.height() * 2).toString() + "px";

			oWizard.setHeight(sPixels);
		},

		_loadAnalysis: function(mAsset) {
			var oPromise = jQuery.Deferred(),
				oModel = this.oView.getModel("Analysis"),
				sURL = "/data/analysis/" + mAsset.EnterpriseId + "/" + mAsset.PlantId + "/" + mAsset.TechnologyId + "/" + mAsset.AssetId;

			$.ajax({
				async: false,
				url: sURL,
				success: function(aAnalysis) {
					oModel.setData(aAnalysis);
					oPromise.resolve(aAnalysis);
				},
				error: function(err) {
					oModel.setData([]);
					oPromise.resolve(null);
				}
			});

			return oPromise;
		},

		_loadCategories: function(mAsset) {
			var oPromise = jQuery.Deferred(),
				oModel = this.oView.getModel("Category"),
				sURL = "/data/category/" + mAsset.EnterpriseId + "/" + mAsset.TechnologyId + "/" + mAsset.PlantId;

			$.ajax({
				async: false,
				url: sURL,
				success: function(aCategories) {
					oModel.setData(aCategories);
					oPromise.resolve(aCategories);
				},
				error: function(err) {
					oModel.setData([]);
					oPromise.resolve(null);
				}
			});

			return oPromise;
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

		_loadAnswers: function(sCategory, sQuestionId, fnCallBack) {
			var oModel = this.oView.getModel("Answer"),
				sURL = "/data/answer/category/" + sCategory + "/question/" + sQuestionId;

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

		_updateCategoryProgress: function(sCategoryId) {
			var oQuestionModel = this.oView.getModel("Question"),
				aQuestions = oQuestionModel.getData().filter(function(mQuestion) {
					return mQuestion.CategoryId === sCategoryId ? true : false;
				}),
				iAnswers = aQuestions.filter(function(mQuestion) {
					return mQuestion.hasOwnProperty("AnswerId") && mQuestion.AnswerId ? true : false;
				}).length;

			var oCategoryModel = this.oView.getModel("Category"),
				aCategories = oCategoryModel.getData();

			for (var i = 0; i < aCategories.length; i++) {
				var oCategory = aCategories[i];
				if (oCategory.CategoryId === sCategoryId) {
					oCategory.Progress = (iAnswers / aQuestions.length * 100);
				}
			}

			// oCategoryModel.setData(aCategories);
		},

		_NavigatToNextCategory: function(bFirstStep) {
			var oWizard = this.oView.byId("idWizard"),
				aSteps = oWizard.getSteps(),
				aCategories = this.oView.getModel("Category").getData(),
				sLastStepId = aSteps[aSteps.length - 1].getId(),
				sCurrentStepId = oWizard.getCurrentStep();

			this.oView.getModel("Answer").setData([]);

			if (bFirstStep) {
				oWizard.goToStep(aSteps[0]);
				oWizard.setCurrentStep(aSteps[0]);
				sCurrentStepId = aSteps[0].getId();
				aSteps.forEach(function(oStep) {
					oStep.setValidated(false);
				});
			// } else if (sCurrentStepId === sLastStepId) {
			// 	this.onNavBack();
			// 	return;
			} else {
				oWizard.nextStep();
				sCurrentStepId = oWizard.getCurrentStep();
			}

			if (sCurrentStepId === sLastStepId) {
				this.oView.byId("idBtnDone").setVisible(true);
				this.oView.byId("idBtnNext").setVisible(false);
			}

			for (var i=0; i < aCategories.length; i++) {
				var mCategory = aCategories[i],
					bComplete = mCategory.Progress === 100 ? true : false;

				var oStep = aSteps.find(function(mStep) {
					var sStepPath = mStep.getBindingInfo("title").binding.oContext.sPath,
						sCategoryId = this.oView.getModel("Category").getProperty(sStepPath).CategoryId;
					return mCategory.CategoryId === sCategoryId;
				}, this);

				// Load the Category's Questions.
				if (oStep.getId() === sCurrentStepId) {
					// Load the Step's Questions.
					this._loadQuestions(mCategory.CategoryId, function() {});

					// Reset the Table Item navigation indicator.
					this.oView.byId("idQuestionTable").getItems().forEach(function(oItem) {
						oItem.getAggregation("cells")[1].setVisible(false);
					});
				}
			}
		},

		_NavigatToNextQuestion: function() {
			var oTable = this.oView.byId("idQuestionTable"),
				aItems = oTable.getItems(),
				oItem = aItems.find(function(oItm) {
					var sPath = oItm.getBindingContextPath(),
						mQuestion = this.oView.getModel("Question").getProperty(sPath);
					return !mQuestion.AnswerId;
				}, this);

			if (oItem) {
				oTable.fireSelectionChange({
					listItem: oItem,
					selected: true
				});

				oTable.setSelectedItem(oItem);
			} else {
				if (aItems.length > 0) {
					this._NavigatToNextCategory();
				}
			}
		}

	});
});
