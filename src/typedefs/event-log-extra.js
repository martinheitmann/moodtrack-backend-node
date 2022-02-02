const { gql } = require("apollo-server-express");

module.exports.EventLogExtraType = gql`
  type EventLogExtraType {
    key: String!
    value: String!
  }
`;

module.exports.EventLogExtraInput = gql`
  input EventLogExtraInput {
    key: String!
    value: String!
  }
`;
