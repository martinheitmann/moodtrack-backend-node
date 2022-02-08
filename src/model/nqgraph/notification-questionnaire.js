const mongoose = require("mongoose");

const NotificationQuestionnaireSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  created: { type: Date },
  isActive: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  enrolledUsers: [{ type: String, ref: "User" }],
});

/**
 * Removes a user from the notification questionnaire's list
 * of registered users.
 * @param {String} nqId
 * @param {String} userId
 */
NotificationQuestionnaireSchema.statics.removeUser = async function (
  nqId,
  userId
) {
  const session = await mongoose.startSession();
  session.startTransaction();
  const nq = await this.findById(nqId, {}, { session });
  if (nq) {
    let enrolledUsers = nq.enrolledUsers;
    if (!enrolledUsers || enrolledUsers.length === 0) {
      // Array is either null or empty, return or throw error.
      await session.abortTransaction();
      session.endSession();
      throw new Error(
        "Delete failed, user isn't defined or there are no users to delete."
      );
    } else if (enrolledUsers.includes(userId)) {
      // User already exists in array, delete the user
      // and return the new array.
      const itemIndex = enrolledUsers.indexOf(userId);
      enrolledUsers.splice(itemIndex, 1);
      const result = await this.findOneAndUpdate(
        { _id: nqId },
        { enrolledUsers: enrolledUsers },
        { new: true, session: session }
      )
        .populate("enrolledUsers")
        .exec();

      await session.commitTransaction();
      session.endSession();
      return result;
    } else {
      // User does not exist in array, abort and throw.
      await session.abortTransaction();
      session.endSession();
      throw new Error("Delete failed, user doesn't exist.");
    }
  }
};

/**
 * Adds a user from the notification questionnaire's list
 * of registered users.
 * @param {String} nqId
 * @param {String} userId
 */
NotificationQuestionnaireSchema.statics.addUser = async function (
  nqId,
  userId
) {
  const session = await mongoose.startSession();
  session.startTransaction();
  const nq = await this.findById(nqId, {}, { session });
  if (nq) {
    let enrolledUsers = nq.enrolledUsers;
    if (!enrolledUsers || enrolledUsers.length === 0) {
      // Array is either null or empty, set array with item.
      enrolledUsers = [userId];
      const result = await this.findOneAndUpdate(
        { _id: nqId },
        { enrolledUsers: enrolledUsers },
        { new: true, session: session }
      )
        .populate("enrolledUsers")
        .exec();
      await session.commitTransaction();
      session.endSession();
      return result;
    } else if (enrolledUsers.includes(userId)) {
      // User already exists in array, return error or null.
      await session.abortTransaction();
      session.endSession();
      return new Error("User is already enrolled.");
    } else {
      // User does not exist in array, add and update.
      enrolledUsers.push(userId);
      const result = await this.findOneAndUpdate(
        { _id: nqId },
        { enrolledUsers: enrolledUsers },
        { new: true }
      )
        .populate("enrolledUsers")
        .exec();
      await session.commitTransaction();
      session.endSession();
      return result;
    }
  }
};

NotificationQuestionnaireSchema.statics.getAllNotificationQuestionnaires =
  async function () {
    return await this.find({}).populate("enrolledUsers").exec();
  };

NotificationQuestionnaireSchema.statics.getNotificationQuestionnaires =
  async function (params) {
    return await this.find(params).populate("enrolledUsers").exec();
  };

NotificationQuestionnaireSchema.statics.findNotificationQuestionnaire =
  async function (params) {
    return await this.findOne(params).populate("enrolledUsers").exec();
  };

NotificationQuestionnaireSchema.statics.findNotificationQuestionnaireById =
  async function (id) {
    return await this.findById(id).populate("enrolledUsers").exec();
  };

NotificationQuestionnaireSchema.statics.createNotificationQuestionnaire =
  async function (params) {
    return await this.create(params);
  };

NotificationQuestionnaireSchema.statics.updateNotificationQuestionnaire =
  async function (id, params) {
    return await this.findOneAndUpdate({ _id: id }, params, {
      new: true,
    })
      .populate("enrolledUsers")
      .exec();
  };

NotificationQuestionnaireSchema.statics.deleteOneNotificationQuestionnaire =
  async function (params) {
    await this.deleteOne(params);
    return params._id || null;
  };

NotificationQuestionnaireSchema.statics.deleteManyOneNotificationQuestionnaires =
  async function (params) {
    return await this.deleteMany(params);
  };

module.exports = mongoose.model(
  "NotificationQuestionnaire",
  NotificationQuestionnaireSchema
);
