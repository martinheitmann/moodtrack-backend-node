const mongoose = require("mongoose");

/*
  Schema for the collection of logged messages.
  Whenever a notification message is sent, an entry 
  is inserted into this collection which allows for
  the tracking of events related to this "chain" of messages.

  This schema has no use outside keeping track of sent messages.
*/
const NotificationMessageSchema = new mongoose.Schema({
  timestamp: { type: Date },
  userId: { type: String },
  nqId: { type: mongoose.Types.ObjectId },
});

/*
  Wrapper methods for the schema.
*/

NotificationMessageSchema.statics.fetchAllNotificationMessages =
  async function () {
    return await this.find({});
  };

NotificationMessageSchema.statics.findNotificationMessages = async function (
  params
) {
  return await this.find(params || {});
};

NotificationMessageSchema.statics.findNotificationMessageByEmail =
  async function (email) {
    return await this.findOne({ email: email });
  };

NotificationMessageSchema.statics.findNotificationMessageById = async function (
  id
) {
  return await this.findById(id);
};

NotificationMessageSchema.statics.createNotificationMessage = async function (
  params
) {
  return await this.create(params);
};

NotificationMessageSchema.statics.updateNotificationMessage = async function (
  id,
  params
) {
  return await this.findOneAndUpdate({ _id: id }, params, { new: true });
};

module.exports = mongoose.model(
  "NotificationMessage",
  NotificationMessageSchema
);
