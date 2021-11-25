const { gql } = require("apollo-server-express");

module.exports.InAppQuestionnaireResponseType = gql`
  type InAppQuestionnaireResponseType {
    _id: ID
    messageId: ID
    message: NotificationLogType
    precedingNotificationQuestion: NotificationQuestionnaireResponseType
    timestamp: Date
    name: String
    user: UserType
    questionnaire: InAppQuestionnaireType
    questionnaireContent: InAppQuestionnaireContentType
    multipleChoiceItems: [InAppQuestionnaireMultipleChoiceResponseType]
    freeTextItems: [InAppQuestionnaireFreeTextResponseType]
  }
`;

module.exports.InAppQuestionnaireResponseInput = gql`
  input InAppQuestionnaireResponseInput {
    timestamp: Date
    messageId: ID
    message: ID
    precedingNotificationQuestion: ID
    name: String!
    user: ID!
    questionnaire: ID!
    questionnaireContent: ID!
    multipleChoiceItems: [InAppQuestionnaireMultipleChoiceResponseInput]!
    freeTextItems: [InAppQuestionnaireFreeTextResponseInput]!
  }
`;
