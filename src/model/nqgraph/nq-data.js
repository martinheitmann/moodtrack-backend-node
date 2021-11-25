const mongoose = require("mongoose");
const NQQuestion = require("./nq-question");
const NQAppQuestionnaire = require("./nq-app-questionnaire");

const NQDataSchema = new mongoose.Schema({
  nqId: mongoose.Types.ObjectId,
  type: {
    type: String,
    enum: ["question", "appquestionnaire"],
  },
  question: NQQuestion,
  appquestionnaire: NQAppQuestionnaire,
});

module.exports = NQDataSchema;
