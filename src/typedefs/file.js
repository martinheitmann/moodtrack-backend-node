const { gql } = require("apollo-server-express");

module.exports.FileType = gql`
  type FileType {
    _id: ID
    filename: String
    length: Int
    uploadDate: Date
    md5: String
    data: String
  }
`;
