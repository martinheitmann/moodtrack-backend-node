const { gql } = require("apollo-server-express");

module.exports.InAppQuestionnaireFreeTextQuestionType = gql`
  type InAppQuestionnaireFreeTextQuestionType {
    index: Int!
    question: String!
  }
`;

module.exports.InAppQuestionnaireFreeTextQuestionInput = gql`
  input InAppQuestionnaireFreeTextQuestionInput {
    index: Int!
    question: String!
  }
`;
