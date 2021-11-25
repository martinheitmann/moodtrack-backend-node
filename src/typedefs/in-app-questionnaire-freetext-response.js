const { gql } = require("apollo-server-express");

module.exports.InAppQuestionnaireFreeTextResponseType = gql`
  type InAppQuestionnaireFreeTextResponseType {
    index: Int
    question: String
    response: String
  }
`;

module.exports.InAppQuestionnaireFreeTextResponseInput = gql`
  input InAppQuestionnaireFreeTextResponseInput {
    index: Int!
    question: String!
    response: String!
  }
`;
