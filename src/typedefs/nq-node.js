const { gql } = require("apollo-server-express");

/* NQNodeType schema type definiion */
module.exports.NQNodeType = gql`
  type NQNodeType {
    _id: ID
    nqId: ID
    nodeLabel: String
    isSourceNode: Boolean
    isArchived: Boolean
    data: NQDataType
    position: NodePositionType
  }
`;

/* NQNodeInput schema type definiion */
module.exports.NQNodeInput = gql`
  input NQNodeInput {
    _id: ID
    nqId: ID
    nodeLabel: String
    isSourceNode: Boolean
    isArchived: Boolean
    data: NQDataInput
    position: NodePositionInput
  }
`;
