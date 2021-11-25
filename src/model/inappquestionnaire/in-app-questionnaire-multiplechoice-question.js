const mongoose = require("mongoose");

const InAppQuestionnaireMultipleChoiceQuestionSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  question: { type: String, required: true },
  choices: [
    {
      display: { type: String },
      value: { type: String, required: true },
      type: { type: String },
    },
  ],
});

module.exports = InAppQuestionnaireMultipleChoiceQuestionSchema;
