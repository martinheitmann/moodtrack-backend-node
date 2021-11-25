const { gql } = require("apollo-server-express");

module.exports.NotificationMessageType = gql`
  type NotificationMessageType {
    notificationQuestionnaireId: ID
    timeOfDay: NQTODType
    fcmToken: String
    messageBody: String
    isDryRun: String
  }
`;

module.exports.NotificationMessageInput = gql`
  input NotificationMessageInput {
    notificationQuestionnaireId: ID!
    timeOfDay: NQTODInput!
    fcmToken: String!
    isDryRun: Boolean
  }
`;
