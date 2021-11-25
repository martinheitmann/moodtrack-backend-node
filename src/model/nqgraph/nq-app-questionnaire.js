const mongoose = require("mongoose");

const NQAppQuestionnaireSchema = new mongoose.Schema({
  qid: { type: mongoose.Types.ObjectId },
  customTitle: { type: String },
  customBody: { type: String },
  timeOfDay: {
    minute: { type: Number },
    hour: { type: Number },
  },
});

module.exports = NQAppQuestionnaireSchema;
