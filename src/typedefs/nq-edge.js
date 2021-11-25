const { gql } = require("apollo-server-express");

module.exports.NQEdgeType = gql`
  type NQEdgeType {
    _id: ID
    nqId: ID!
    source: ID!
    target: ID!
    edgeLabel: String
    isArchived: Boolean
    condition: NQConditionType
  }
`;

module.exports.NQEdgeInput = gql`
  input NQEdgeInput {
    _id: ID
    nqId: ID!
    source: ID!
    target: ID!
    edgeLabel: String
    isArchived: Boolean
    condition: NQConditionInput
  }
`;
