const { gql } = require("apollo-server-express");

module.exports.NQQuestionType = gql`
  type NQQuestionType {
    timeOfDay: NQTODType
    visible: Boolean!
    questionText: String!
    questionChoices: [NQQuestionChoiceType]
  }
`;

module.exports.NQQuestionInput = gql`
  input NQQuestionInput {
    timeOfDay: NQTODInput
    visible: Boolean!
    questionText: String!
    questionChoices: [NQQuestionChoiceInput]
  }
`;
