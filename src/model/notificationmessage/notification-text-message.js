const mongoose = require("mongoose");

/*
  Schema for the collection of logged text notification messages.
  Stores the message title and body of the sent notification.

  This schema has no use outside keeping track of sent messages.
*/
const NotificationTextMessageSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  entity: { type: mongoose.Schema.Types.Mixed },
});

/*
  Wrapper methods for the schema.
*/

NotificationTextMessageSchema.statics.fetchAllNotificationTextMessages =
  async function () {
    return await this.find({});
  };

NotificationTextMessageSchema.statics.findNotificationTextMessages =
  async function (params) {
    return await this.find(params || {});
  };

NotificationTextMessageSchema.statics.findNotificationTextMessageByEmail =
  async function (email) {
    return await this.findOne({ email: email });
  };

NotificationTextMessageSchema.statics.findNotificationTextMessageById =
  async function (id) {
    return await this.findById(id);
  };

NotificationTextMessageSchema.statics.createNotificationTextMessage =
  async function (params) {
    return await this.create(params);
  };

NotificationTextMessageSchema.statics.updateNotificationMessage =
  async function (id, params) {
    return await this.findOneAndUpdate({ _id: id }, params, { new: true });
  };

module.exports = mongoose.model(
  "NotificationTextMessage",
  NotificationTextMessageSchema
);
