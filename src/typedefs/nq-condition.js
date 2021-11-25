const { gql } = require("apollo-server-express");

module.exports.NQConditionType = gql`
  type NQConditionType {
    condition: String!
    conditionValue: String!
    conditionType: String
  }
`;

module.exports.NQConditionInput = gql`
  input NQConditionInput {
    condition: String!
    conditionValue: String!
    conditionType: String
  }
`;
