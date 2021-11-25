const mongoose = require("mongoose");

const NotificationQuestionnaireResponseSchema = new mongoose.Schema({
  timestamp: { type: Date },
  messageId: { type: mongoose.Types.ObjectId }, // For querying, not strictly needed.
  message: {
    // For populating
    type: mongoose.Types.ObjectId,
    ref: "NotificationMessage",
  },
  user: {
    type: String,
    ref: "User",
  },
  notificationQuestionnaire: {
    type: mongoose.Types.ObjectId,
    ref: "NotificationQuestionnaire",
  },
  previous: { type: mongoose.Types.ObjectId }, // Not used, may also be incorrect.
  next: { type: mongoose.Types.ObjectId }, // Maybe used, may also be incorrect.
  nodeId: { type: mongoose.Types.ObjectId },
  responseData: {
    questionText: { type: String },
    choices: [
      {
        choiceIconMd5: { type: String },
        choiceIconId: { type: mongoose.Types.ObjectId },
        choiceIcon: { type: String },
        choiceValueType: { type: String },
        choiceValue: { type: String },
      },
    ],
    selectedChoice: {
      choiceIcon: { type: String },
      choiceValueType: { type: String },
      choiceValue: { type: String },
    },
  },
});

NotificationQuestionnaireResponseSchema.statics.getNotificationQuestionnaireResponse =
  async function (params) {
    return await this.findOne(params)
      .populate("user")
      .populate("notificationQuestionnaire")
      .populate("message")
      .exec();
  };

NotificationQuestionnaireResponseSchema.statics.getNotificationQuestionnaireResponses =
  async function (params) {
    return await this.find(params || {})
      .populate("user")
      .populate("notificationQuestionnaire")
      .populate("message")
      .exec();
  };

NotificationQuestionnaireResponseSchema.statics.createNotificationQuestionnaireResponse =
  async function (params) {
    const result = await this.create(params);
    // Since we cant populate a newly created model,
    // find and then return the populated doc.
    const newDoc = await this.findById(result._id)
      .populate("user")
      .populate("notificationQuestionnaire")
      .populate("message")
      .exec();
    return newDoc;
  };

NotificationQuestionnaireResponseSchema.statics.updateNotificationQuestionnaireResponse =
  async function (id, params) {
    return await this.findOneAndUpdate({ _id: id }, params, { new: true })
      .populate("user")
      .populate("notificationQuestionnaire")
      .populate("message")
      .exec();
  };

NotificationQuestionnaireResponseSchema.statics.deleteNotificationQuestionnaireResponse =
  async function (params) {
    await this.deleteOne(params);
    return params._id || null; // Delete has no return value, so just return the _id.
  };

/**
 * A simple aggregation for getting the number of responses for
 * each day during a month.
 * @param {*} startDate
 * @param {*} endDate
 * @returns
 */
NotificationQuestionnaireResponseSchema.statics.aggregateNumberOfResponsesEachDay =
  async function (startDate, endDate) {
    if (!startDate || !endDate)
      throw new Error(
        "Invalid or null dates passed to function: received values were " +
          startDate +
          ", " +
          endDate +
          "."
      );
    const aggregationResult = await this.aggregate([
      {
        $match: {
          timestamp: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
    ]);
    return JSON.stringify(aggregationResult);
  };

module.exports = mongoose.model(
  "NotificationQuestionnaireResponse",
  NotificationQuestionnaireResponseSchema
);
