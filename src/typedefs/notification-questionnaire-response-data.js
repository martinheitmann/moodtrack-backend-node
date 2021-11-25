const { gql } = require("apollo-server-express");

module.exports.NotificationQuestionnaireResponseDataType = gql`
  type NotificationQuestionnaireResponseDataType {
    questionText: String
    choices: [NQQuestionChoiceType]
    selectedChoice: NQQuestionChoiceType
  }
`;

module.exports.NotificationQuestionnaireResponseDataInput = gql`
  input NotificationQuestionnaireResponseDataInput {
    questionText: String
    choices: [NQQuestionChoiceInput]
    selectedChoice: NQQuestionChoiceInput
  }
`;
