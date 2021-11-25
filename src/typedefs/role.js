const { gql } = require("apollo-server-express");

module.exports.RoleType = gql`
  type RoleType {
    uid: String
    email: String
    role: String
  }
`;
