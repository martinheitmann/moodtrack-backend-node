const mongoose = require("mongoose");
const InAppQuestionnaireFreeTextQuestion = require("./in-app-questionnaire-freetext-question");
const InAppQuestionnaireMultipleChoiceQuestion = require("./in-app-questionnaire-multiplechoice-question");

/*
  Schema representing the contents of a node. All data related to 
  questions/conditions and other elements part of a notification 
  questionnaire is contained in this schema.
*/
const InAppQuestionnaireContentSchema = new mongoose.Schema({
  creationDate: { type: Date },
  questionnaireId: { type: mongoose.Types.ObjectId },
  multipleChoiceItems: [InAppQuestionnaireMultipleChoiceQuestion],
  freeTextItems: [InAppQuestionnaireFreeTextQuestion],
});

/* Wrapper methods around mongoose.Model for InAppQuestionnaireContents  */

InAppQuestionnaireContentSchema.statics.getInAppQuestionnaireContent =
  async function (params) {
    return await this.findOne(params);
  };

InAppQuestionnaireContentSchema.statics.getInAppQuestionnaireContents =
  async function (params) {
    return await this.find(params);
  };

InAppQuestionnaireContentSchema.statics.createInAppQuestionnaireContent =
  async function (params) {
    return await this.create(params);
  };

InAppQuestionnaireContentSchema.statics.getLatestInAppQuestionnaireContent =
  async function (params) {
    return await this.findOne(params)
      .sort({ creationDate: -1 })
      .limit(1)
      .exec();
  };

module.exports = mongoose.model(
  "InAppQuestionnaireContent",
  InAppQuestionnaireContentSchema
);
