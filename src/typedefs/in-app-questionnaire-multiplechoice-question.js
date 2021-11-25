const { gql } = require("apollo-server-express");

module.exports.InAppQuestionnaireMultipleChoiceQuestionType = gql`
  type InAppQuestionnaireMultipleChoiceQuestionType {
    _id: ID!
    index: Int!
    question: String!
    choices: [InAppQuestionnaireMultipleChoiceItemType]
  }
`;

module.exports.InAppQuestionnaireMultipleChoiceQuestionInput = gql`
  input InAppQuestionnaireMultipleChoiceQuestionInput {
    index: Int!
    question: String!
    choices: [InAppQuestionnaireMultipleChoiceItemInput]
  }
`;
