const mongoose = require("mongoose");

const EventLogExtraSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

module.exports = EventLogExtraSchema;
