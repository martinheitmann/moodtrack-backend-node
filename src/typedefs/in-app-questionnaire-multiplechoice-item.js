const { gql } = require("apollo-server-express");

module.exports.InAppQuestionnaireMultipleChoiceItemType = gql`
  type InAppQuestionnaireMultipleChoiceItemType {
    display: String
    value: String!
    type: String
  }
`;

module.exports.InAppQuestionnaireMultipleChoiceItemInput = gql`
  input InAppQuestionnaireMultipleChoiceItemInput {
    display: String
    value: String!
    type: String
  }
`;
