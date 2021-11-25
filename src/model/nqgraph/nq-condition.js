const mongoose = require("mongoose");

const NQConditionSchema = new mongoose.Schema({
  condition: {
    type: String,
    enum: [
      "equal",
      "not_equal",
      "less_than",
      "less_than_or_equal",
      "greater_than",
      "greater_than_or_equal",
    ],
    required: true,
  },
  conditionValue: { type: String, required: true },
  conditionType: {
    type: String,
    enum: ["text", "integer", "boolean"],
  },
});

module.exports = NQConditionSchema;
