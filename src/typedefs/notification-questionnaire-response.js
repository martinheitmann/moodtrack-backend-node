const { gql } = require("apollo-server-express");

module.exports.NotificationQuestionnaireResponseType = gql`
  type NotificationQuestionnaireResponseType {
    _id: ID
    messageId: ID
    message: NotificationLogType
    user: UserType
    notificationQuestionnaire: NotificationQuestionnaireType
    timestamp: Date
    previous: ID
    next: ID
    nodeId: ID
    responseData: NotificationQuestionnaireResponseDataType
  }
`;

module.exports.NotificationQuestionnaireResponseInput = gql`
  input NotificationQuestionnaireResponseInput {
    user: ID
    messageId: ID
    message: ID
    notificationQuestionnaire: ID
    timestamp: Date
    previous: ID
    next: ID
    nodeId: ID
    responseData: NotificationQuestionnaireResponseDataInput
  }
`;
