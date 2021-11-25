const { gql } = require("apollo-server-express");

module.exports.IconType = gql`
  type IconType {
    filename: String!
    mimetype: String!
    encoding: String!
    data: String!
  }
`;
