const { gql } = require("apollo-server-express");

module.exports.UploadResultType = gql`
  type UploadResultType {
    filename: String
    mimetype: String
    encoding: String
  }
`;

module.exports.UploadResultInput = gql`
  input UploadResultInput {
    filename: String
    mimetype: String
    encoding: String
  }
`;
