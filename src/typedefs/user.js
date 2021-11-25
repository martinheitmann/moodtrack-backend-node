const { gql } = require("apollo-server-express");

module.exports.UserType = gql`
  type UserType {
    _id: ID
    firstName: String
    lastName: String
    age: Int
    fcmRegistrationToken: String
    notificationsEnabled: Boolean
    profileImage: String
    creationDate: Date
    email: String
  }
`;

module.exports.UserInput = gql`
  input UserInput {
    firstName: String
    lastName: String
    age: String
    fcmRegistrationToken: String
    notificationsEnabled: Boolean
    profileImage: String
    creationDate: Date
  }
`;
