const { gql } = require("apollo-server-express");

/* InAppQuestionnaireType schema type definition. */
module.exports.InAppQuestionnaireType = gql`
  type InAppQuestionnaireType {
    _id: ID
    name: String
    isArchived: Boolean
    creationDate: Date
    description: String
    contents: [InAppQuestionnaireContentEntryType]
  }
`;

/* InAppQuestionnaireInput schema type definition. */
module.exports.InAppQuestionnaireInput = gql`
  input InAppQuestionnaireInput {
    _id: ID
    name: String
    isArchived: Boolean
    creationDate: Date
    description: String
    contents: [InAppQuestionnaireContentEntryInput]
  }
`;
