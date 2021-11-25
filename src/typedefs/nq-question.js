const { gql } = require("apollo-server-express");

module.exports.NQQuestionType = gql`
  type NQQuestionType {
    timeOfDay: NQTODType
    questionText: String!
    questionChoices: [NQQuestionChoiceType]
  }
`;

module.exports.NQQuestionInput = gql`
  input NQQuestionInput {
    timeOfDay: NQTODInput
    questionText: String!
    questionChoices: [NQQuestionChoiceInput]
  }
`;
