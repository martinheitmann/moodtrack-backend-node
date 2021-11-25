const mongoose = require("mongoose");

const InAppQuestionnaireResponseSchema = new mongoose.Schema({
  messageId: { type: mongoose.Types.ObjectId },
  message: {
    type: mongoose.Types.ObjectId,
    ref: "NotificationMessage",
  },
  precedingNotificationQuestion: {
    type: mongoose.Types.ObjectId,
    ref: "NotificationQustionnaireResponse",
  },
  timestamp: { type: Date },
  user: {
    type: String,
    ref: "User",
  },
  questionnaire: {
    type: mongoose.Types.ObjectId,
    ref: "InAppQuestionnaire",
  },
  name: { type: String },
  multipleChoiceItems: [
    {
      index: { type: Number },
      question: { type: String },
      choices: [
        {
          display: { type: String },
          value: { type: String, required: true },
          type: { type: String },
        },
      ],
      selectedChoice: {
        display: { type: String },
        value: { type: String, required: true },
        type: { type: String },
      },
    },
  ],
  freeTextItems: [
    {
      index: { type: Number },
      question: { type: String },
      response: { type: String },
    },
  ],
});

InAppQuestionnaireResponseSchema.statics.getInAppQuestionnaireResponse =
  async function (params) {
    try {
      return await this.findOne(params)
        .populate("user")
        .populate("questionnaire")
        .populate("message")
        .exec();
    } catch (error) {
      return error;
    }
  };

InAppQuestionnaireResponseSchema.statics.getInAppQuestionnaireResponses =
  async function (params) {
    try {
      return await this.find(params || {})
        .populate("user")
        .populate("questionnaire")
        .populate("message")
        .exec();
    } catch (error) {
      return error;
    }
  };

InAppQuestionnaireResponseSchema.statics.createInAppQuestionnaireResponse =
  async function (params) {
    const result = await this.create(params);
    const newDoc = await this.findById(result._id)
      .populate("user")
      .populate("questionnaire")
      .populate("message")
      .exec();
    return newDoc;
  };

InAppQuestionnaireResponseSchema.statics.updateInAppQuestionnaireResponse =
  async function (id, params) {
    return await this.findOneAndUpdate({ _id: id }, params, { new: true });
  };

InAppQuestionnaireResponseSchema.statics.deleteInAppQuestionnaireResponse =
  async function (params) {
    await this.deleteOne(params);
    return params._id || null;
  };

module.exports = mongoose.model(
  "InAppQuestionnaireResponse",
  InAppQuestionnaireResponseSchema
);
