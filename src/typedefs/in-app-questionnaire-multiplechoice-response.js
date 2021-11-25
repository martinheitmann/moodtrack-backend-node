const { gql } = require("apollo-server-express");

module.exports.InAppQuestionnaireMultipleChoiceResponseType = gql`
  type InAppQuestionnaireMultipleChoiceResponseType {
    index: Int!
    question: String!
    choices: [InAppQuestionnaireMultipleChoiceItemType!]
    selectedChoice: InAppQuestionnaireMultipleChoiceItemType!
  }
`;

module.exports.InAppQuestionnaireMultipleChoiceResponseInput = gql`
  input InAppQuestionnaireMultipleChoiceResponseInput {
    index: Int!
    question: String!
    choices: [InAppQuestionnaireMultipleChoiceItemInput!]
    selectedChoice: InAppQuestionnaireMultipleChoiceItemInput!
  }
`;
