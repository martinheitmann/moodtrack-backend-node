const mongoose = require("mongoose");

const NQQuestionSchema = new mongoose.Schema({
  timeOfDay: {
    minute: { type: Number },
    hour: { type: Number },
  },
  questionText: { type: String },
  questionChoices: [
    {
      choiceIconMd5: { type: String },
      choiceIconId: { type: mongoose.Types.ObjectId },
      choiceIcon: { type: String },
      choiceValueType: {
        type: String,
        enum: ["number", "text", "bolean"],
      },
      choiceValue: { type: String },
    },
  ],
});

module.exports = NQQuestionSchema;
