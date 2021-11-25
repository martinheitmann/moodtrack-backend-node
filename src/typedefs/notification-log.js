const { gql } = require("apollo-server-express");

module.exports.NotificationLogType = gql`
  type NotificationLogType {
    timestamp: Date
    userId: String
    nqId: ID
  }
`;

module.exports.NotificationLogInput = gql`
  type NotificationLogInput {
    timestamp: Date
    userId: String
    nqId: ID
  }
`;
