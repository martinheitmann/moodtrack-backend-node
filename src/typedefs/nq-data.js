const { gql } = require("apollo-server-express");

module.exports.NQDataType = gql`
  type NQDataType {
    nqId: ID
    type: String!
    question: NQQuestionType
    appquestionnaire: NQAppQuestionnaireType
  }
`;

module.exports.NQDataInput = gql`
  input NQDataInput {
    nqId: ID
    type: String!
    question: NQQuestionInput
    appquestionnaire: NQAppQuestionnaireInput
  }
`;
