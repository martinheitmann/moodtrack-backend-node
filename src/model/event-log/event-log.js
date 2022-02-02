const mongoose = require("mongoose");
const User = require("../user/user");
const EventLogExtra = require("./event-log-extra");
const { allowedActions, allowedObjects } = require("../../util/event-log-util");

const EventLogSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  actor: {
    type: String,
    required: true,
    ref: User,
  },
  action: { type: String, required: true, enum: allowedActions },
  eventObject: { type: String, required: true, enum: allowedObjects },
  extras: [EventLogExtra],
});

EventLogSchema.statics.fetchAllEventLogs = async function () {
  return await this.find({}).populate("actor").exec();
};

EventLogSchema.statics.findEventLogs = async function (params) {
  return await this.find(params || {})
    .populate("actor")
    .exec();
};

EventLogSchema.statics.findEventLogById = async function (id) {
  return await this.findById(id).populate("actor").exec();
};

EventLogSchema.statics.createEventLog = async function (params) {
  const newDoc = await this.create(params);
  return await this.findById(newDoc._id).populate("actor").exec();
};

EventLogSchema.statics.deleteEventLog = async function (params) {
  await this.deleteOne(params);
  return params._id || null;
};

EventLogSchema.statics.updateEventLog = async function (id, params) {
  return await this.findOneAndUpdate({ _id: id }, params, { new: true })
    .populate("actor")
    .exec();
};

module.exports = mongoose.model("EventLog", EventLogSchema);
