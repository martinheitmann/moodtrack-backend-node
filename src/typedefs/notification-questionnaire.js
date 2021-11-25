const { gql } = require("apollo-server-express");

module.exports.NotificationQuestionnaireType = gql`
  type NotificationQuestionnaireType {
    _id: ID
    name: String!
    description: String!
    created: Date
    lastModified: Date
    isActive: Boolean
    isArchived: Boolean
    enrolledUsers: [UserType]
  }
`;

module.exports.NotificationQuestionnaireInput = gql`
  input NotificationQuestionnaireInput {
    _id: ID
    name: String!
    description: String!
    created: Date
    lastModified: Date
    isActive: Boolean
    isArchived: Boolean
  }
`;
