const mongoose = require("mongoose");
const InAppQuestionnaireContent = require("./in-app-questionnaire-content");

const InAppQuestionnaireSchema = new mongoose.Schema({
  name: { type: String },
  isArchived: { type: Boolean, default: false },
  creationDate: { type: Date },
  description: { type: String },
  contents: [
    {
      creationDate: Date,
      content: {
        type: mongoose.Types.ObjectId,
        ref: InAppQuestionnaireContent,
      },
    },
  ],
});

/* Wrapper methods around mongoose.Model for InAppQuestionnaire  */

InAppQuestionnaireSchema.statics.getInAppQuestionnaire = async function (
  params
) {
  return await this.findOne(params)
    .populate({
      path: "contents",
      populate: {
        path: "content",
      },
    })
    .exec();
};

InAppQuestionnaireSchema.statics.getInAppQuestionnaires = async function (
  params
) {
  return await this.find(params)
    .populate({
      path: "contents",
      populate: {
        path: "content",
      },
    })
    .exec();
};

InAppQuestionnaireSchema.statics.createInAppQuestionnaire = async function (
  params
) {
  return await this.create(params);
};

InAppQuestionnaireSchema.statics.updateInAppQuestionnaire = async function (
  id,
  params
) {
  return await this.findOneAndUpdate({ _id: id }, params, { new: true });
};

InAppQuestionnaireSchema.statics.deleteInAppQuestionnaire = async function (
  params
) {
  await this.deleteOne(params);
  return params._id || null;
};

module.exports = mongoose.model("InAppQuestionnaire", InAppQuestionnaireSchema);
