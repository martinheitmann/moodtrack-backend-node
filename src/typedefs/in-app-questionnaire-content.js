const { gql } = require("apollo-server-express");

/* InAppQuestionnaireType schema type definition. */
module.exports.InAppQuestionnaireContentType = gql`
  type InAppQuestionnaireContentType {
    _id: ID
    creationDate: Date
    questionnaireId: ID!
    multipleChoiceItems: [InAppQuestionnaireMultipleChoiceQuestionType]
    freeTextItems: [InAppQuestionnaireFreeTextQuestionType]
  }
`;

/* InAppQuestionnaireInput schema type definition. */
module.exports.InAppQuestionnaireContentInput = gql`
  input InAppQuestionnaireContentInput {
    creationDate: Date!
    questionnaireId: ID!
    multipleChoiceItems: [InAppQuestionnaireMultipleChoiceQuestionInput]!
    freeTextItems: [InAppQuestionnaireFreeTextQuestionInput]!
  }
`;
