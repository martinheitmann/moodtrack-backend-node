const { gql } = require("apollo-server-express");

/* InAppQuestionnaireType schema type definition. */
module.exports.InAppQuestionnaireContentEntryType = gql`
  type InAppQuestionnaireContentEntryType {
    creationDate: Date
    content: InAppQuestionnaireContentType
  }
`;

/* InAppQuestionnaireInput schema type definition. */
module.exports.InAppQuestionnaireContentEntryInput = gql`
  input InAppQuestionnaireContentEntryInput {
    creationDate: Date!
    content: InAppQuestionnaireContentInput!
  }
`;
