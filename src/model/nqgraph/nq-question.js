const mongoose = require("mongoose");

const NQQuestionSchema = new mongoose.Schema({
  /*
    Describes the hour/minute values which symbols the 
    trigger time during the day. Uses a 24h format.
  */
  timeOfDay: {
    minute: { type: Number },
    hour: { type: Number },
  },
  /* 
    Describes whether or not it should be possible to sum the
    response data. False tells the client that this value doesn't
    make sense to insert into e.g. a graph or similar aggregations.
  */
  visible: {
    type: Boolean,
    default: false,
  },
  questionText: { type: String },
  questionChoices: [
    {
      choiceIconMd5: { type: String },
      choiceIconId: { type: mongoose.Types.ObjectId },
      choiceIcon: { type: String },
      choiceValueType: {
        type: String,
        enum: ["number", "text", "boolean"],
      },
      choiceValue: { type: String },
    },
  ],
});

module.exports = NQQuestionSchema;
