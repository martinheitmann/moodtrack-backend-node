const { gql } = require("apollo-server-express");

module.exports.NQGraphType = gql`
  type NQGraphType {
    timeOfDay: NQTODType
    nodes: [NQNodeType]
    edges: [NQEdgeType]
  }
`;

module.exports.NQGraphInput = gql`
  input NQGraphInput {
    timeOfDay: NQTODInput
    nodes: [NQNodeInput]
    edges: [NQEdgeInput]
  }
`;
