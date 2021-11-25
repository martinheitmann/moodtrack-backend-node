const { gql } = require("apollo-server-express");

module.exports.NQQuestionChoiceType = gql`
  type NQQuestionChoiceType {
    choiceIconMd5: String
    choiceIconId: ID
    choiceIcon: String!
    choiceValueType: String
    choiceValue: String!
  }
`;

module.exports.NQQuestionChoiceInput = gql`
  input NQQuestionChoiceInput {
    choiceIconMd5: String
    choiceIconId: ID!
    choiceIcon: String!
    choiceValueType: String
    choiceValue: String!
  }
`;
