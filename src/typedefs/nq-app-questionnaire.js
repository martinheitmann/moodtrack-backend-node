const { gql } = require("apollo-server-express");

module.exports.NQAppQuestionnaireType = gql`
  type NQAppQuestionnaireType {
    qid: ID
    customTitle: String
    customBody: String
    timeOfDay: NQTODType
  }
`;

module.exports.NQAppQuestionnaireInput = gql`
  input NQAppQuestionnaireInput {
    qid: ID
    customTitle: String
    customBody: String
    timeOfDay: NQTODInput
  }
`;
