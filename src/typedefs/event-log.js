const { gql } = require("apollo-server-express");

module.exports.EventLogType = gql`
  type EventLogType {
    _id: ID!
    timestamp: Date!
    actor: UserType!
    action: String!
    eventObject: String!
    extras: [EventLogExtraType]
  }
`;

module.exports.EventLogInput = gql`
  input EventLogInput {
    timestamp: Date!
    actor: ID!
    action: String!
    eventObject: String!
    extras: [EventLogExtraInput]
  }
`;
