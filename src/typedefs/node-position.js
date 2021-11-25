const { gql } = require("apollo-server-express");

module.exports.NodePositionType = gql`
  type NodePositionType {
    xPos: Int
    yPos: Int
  }
`;

module.exports.NodePositionInput = gql`
  input NodePositionInput {
    xPos: Int
    yPos: Int
  }
`;
