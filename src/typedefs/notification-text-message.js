const { gql } = require("apollo-server-express");

module.exports.NotificationTextMessageType = gql`
  type NotificationTextMessageType {
    fcmToken: String!
    title: String!
    body: String!
  }
`;

module.exports.NotificationTextMessageInput = gql`
  input NotificationTextMessageInput {
    fcmToken: String!
    title: String!
    body: String!
  }
`;
