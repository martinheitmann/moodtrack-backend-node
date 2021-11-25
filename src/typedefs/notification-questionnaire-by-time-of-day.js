const { gql } = require("apollo-server-express");

module.exports.NotificationQuestionnaireByTimeOfDayType = gql`
  type NotificationQuestionnaireByTimeOfDayType {
    nqId: ID
    nodes: [NQNodeType]
    edges: [NQEdgeType]
  }
`;
