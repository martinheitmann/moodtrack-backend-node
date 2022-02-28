const { gql } = require("apollo-server-express");

module.exports.DocumentFileType = gql`
  type DocumentFileType {
    _id: ID!
    ownerId: String!
    filename: String!
    length: Int
    uploadDate: Date
    md5: String
    data: String!
  }
`;
