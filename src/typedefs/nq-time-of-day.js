const { gql } = require("apollo-server-express");

module.exports.NQTODType = gql`
  type NQTODType {
    minute: Int
    hour: Int
  }
`;

module.exports.NQTODInput = gql`
  input NQTODInput {
    minute: Int
    hour: Int
  }
`;
