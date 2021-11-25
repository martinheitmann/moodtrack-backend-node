const mongoose = require("mongoose");

const InAppQuestionnaireFreeTextQuestionSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  question: { type: String, required: true },
});

module.exports = InAppQuestionnaireFreeTextQuestionSchema;
