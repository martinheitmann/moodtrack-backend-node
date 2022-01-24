const { gql } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const _ = require("lodash");
const { GraphQLUpload } = require("graphql-upload");

// Typedefs
const { UserType, UserInput } = require("./user.js");
const { FileType } = require("./file.js");
const {
  NotificationQuestionnaireType,
  NotificationQuestionnaireInput,
} = require("./notification-questionnaire.js");
const { NQGraphType, NQGraphInput } = require("./nq-graph.js");
const { NQConditionType, NQConditionInput } = require("./nq-condition");
const { NQTODType, NQTODInput } = require("./nq-time-of-day");
const { NQDataType, NQDataInput } = require("./nq-data");
const { NQNodeType, NQNodeInput } = require("./nq-node");
const { NQEdgeType, NQEdgeInput } = require("./nq-edge");
const { NQQuestionType, NQQuestionInput } = require("./nq-question");
const {
  NQQuestionChoiceType,
  NQQuestionChoiceInput,
} = require("./nq-question-choice");
const { UploadResultType } = require("./upload-result");
const {
  NQAppQuestionnaireType,
  NQAppQuestionnaireInput,
} = require("./nq-app-questionnaire");
const { IconType } = require("./icon");
const dateScalar = require("../scalars/date");
const {
  InAppQuestionnaireMultipleChoiceQuestionInput,
  InAppQuestionnaireMultipleChoiceQuestionType,
} = require("./in-app-questionnaire-multiplechoice-question");
const {
  InAppQuestionnaireMultipleChoiceItemType,
  InAppQuestionnaireMultipleChoiceItemInput,
} = require("./in-app-questionnaire-multiplechoice-item");
const {
  InAppQuestionnaireFreeTextQuestionInput,
  InAppQuestionnaireFreeTextQuestionType,
} = require("./in-app-questionnaire-freetext-question");
const {
  InAppQuestionnaireInput,
  InAppQuestionnaireType,
} = require("./in-app-questionnaire");
const {
  InAppQuestionnaireResponseType,
  InAppQuestionnaireResponseInput,
} = require("./in-app-questionnaire-response");
const {
  InAppQuestionnaireFreeTextResponseInput,
  InAppQuestionnaireFreeTextResponseType,
} = require("./in-app-questionnaire-freetext-response");
const {
  InAppQuestionnaireMultipleChoiceResponseInput,
  InAppQuestionnaireMultipleChoiceResponseType,
} = require("./in-app-questionnaire-multiplechoice-response");
const {
  NotificationQuestionnaireResponseType,
  NotificationQuestionnaireResponseInput,
} = require("./notification-questionnaire-response");
const {
  NotificationQuestionnaireResponseDataInput,
  NotificationQuestionnaireResponseDataType,
} = require("./notification-questionnaire-response-data");
const {
  NotificationMessageInput,
  NotificationMessageType,
} = require("./notification-message");
const {
  NotificationTextMessageInput,
  NotificationTextMessageType,
} = require("./notification-text-message");
const {
  NotificationQuestionnaireByTimeOfDayType,
} = require("./notification-questionnaire-by-time-of-day");
const { RoleType } = require("./role");
const { NodePositionInput, NodePositionType } = require("./node-position");
const {
  NotificationLogInput,
  NotificationLogType,
} = require("./notification-log");
const {
  InAppQuestionnaireContentInput,
  InAppQuestionnaireContentType,
} = require("./in-app-questionnaire-content");
const {
  InAppQuestionnaireContentEntryInput,
  InAppQuestionnaireContentEntryType,
} = require("./in-app-questionnaire-content-entry");
const { PostInput, PostType } = require("./post");

// Resolvers
const { nqNodeResolvers } = require("../resolver/nq-node-resolver");
const { nqEdgeResolvers } = require("../resolver/nq-edge-resolver");
const { userResolvers } = require("../resolver/user-resolver");
const { iconResolvers } = require("../resolver/icon-resolver");
const {
  notificationQuestionnaireResolvers,
} = require("../resolver/notification-questionnaire-resolver");
const {
  inAppQuestionnaireResolvers,
} = require("../resolver/in-app-questionnaire-resolver");
const {
  inAppQuestionnaireContentResolvers,
} = require("../resolver/in-app-questionnaire-content-resolver");
const {
  inAppQuestionnaireResponseResolvers,
} = require("../resolver/in-app-questionnaire-response-resolver");
const {
  notificationQuestionnaireResponseResolvers,
} = require("../resolver/notification-questionnaire-response-resolver");
const {
  notificationMessageResolvers,
} = require("../resolver/notification-message-resolver");
const {
  notificationQuestionnaireByTimeOfDayResolvers,
} = require("../resolver/notification-questionnaire-by-time-of-day-resolver");
const { rolesResolvers } = require("../resolver/roles-resolver");
const { postResolvers } = require("../resolver/postresolver");

const Query = gql`
  scalar Date
  type Query {
    users(
      _id: ID
      firstName: String
      lastName: String
      age: Int
      fcmRegistrationToken: String
      notificationsEnabled: Boolean
      profileImage: String
      creationDate: Date
    ): [UserType]
    user(_id: ID): UserType
    icons: [FileType]
    icon(_id: ID): FileType
    iconByName(filename: String): FileType
    iconsByName(filenames: [String]): [FileType]
    iconsById(fileIds: [String]): [FileType]
    notificationQuestionnaires(
      _id: ID
      name: String
      description: String
      created: Date
      lastModified: Date
    ): [NotificationQuestionnaireType]
    notificationQuestionnaire(_id: ID): NotificationQuestionnaireType
    edge(_id: ID): NQEdgeType
    edges(_id: ID, nqId: ID, source: ID, target: ID): [NQEdgeType]
    node(_id: ID, isArchived: Boolean): NQNodeType
    nodes(_id: ID, nqId: ID, isArchived: Boolean): [NQNodeType]
    inAppQuestionnaire(_id: ID): InAppQuestionnaireType
    inAppQuestionnaires: [InAppQuestionnaireType]
    inAppQuestionnaireContent(
      _id: ID
      questionnaireId: ID
    ): InAppQuestionnaireContentType
    latestInAppQuestionnaireContent(
      _id: ID
      questionnaireId: ID
    ): InAppQuestionnaireContentType
    inAppQuestionnaireContents(
      questionnaireId: ID
    ): [InAppQuestionnaireContentType]
    inAppQuestionnaireResponse(_id: ID): InAppQuestionnaireResponseType
    inAppQuestionnaireResponses(user: ID): [InAppQuestionnaireResponseType]
    notificationQuestionnaireResponses(
      user: ID
    ): [NotificationQuestionnaireResponseType]
    notificationQuestionnaireResponsesBetween(
      _id: ID
      gte: Date
      lte: Date
    ): [NotificationQuestionnaireResponseType]
    notificationQuestionnaireResponse(
      _id: ID
      nodeId: ID
      messageId: ID
    ): NotificationQuestionnaireResponseType
    notificationQuestionnaireByTimeOfDay(
      notificationQuestionnaireId: ID
      timeOfDay: NQTODInput
    ): NotificationQuestionnaireByTimeOfDayType
    numberOfResponsesForEachDay(startDate: Date, endDate: Date): String
    roles: [RoleType]
    role(uid: ID!): RoleType
    testAdmin: String
    testUser: String
    post(_id: ID): PostType
    posts: [PostType]
  }
`;

const Mutation = gql`
  scalar Upload
  type Mutation {
    # ----------------- User -----------------
    registerUser(email: String, password: String): UserType
    modifyUser(_id: ID, user: UserInput): UserType
    createUser(user: UserInput): UserType
    unregisterUser(_id: ID!): Boolean
    recreateUsers: Int
    # ----------------- Icon -----------------
    uploadIcon(file: Upload!): UploadResultType
    deleteIcon(_id: ID): ID
    # ----------------- Notification Questionnaire -----------------
    createNotificationQuestionnaire(
      notificationQuestionnaire: NotificationQuestionnaireInput
    ): NotificationQuestionnaireType
    modifyNotificationQuestionnaire(
      _id: ID
      notificationQuestionnaire: NotificationQuestionnaireInput
    ): NotificationQuestionnaireType
    deleteNotificationQuestionnaire(_id: ID): ID
    archiveNotificationQuestionnaire(_id: ID): ID
    restoreNotificationQuestionnaire(_id: ID): ID
    enrollUserInNotificationQuestionnaire(
      _id: ID
      userId: ID
    ): NotificationQuestionnaireType
    removeUserFromNotificationQuestionnaire(
      _id: ID
      userId: ID
    ): NotificationQuestionnaireType
    # ----------------- Node -----------------
    createNode(node: NQNodeInput): NQNodeType
    editNode(_id: ID, node: NQNodeInput): NQNodeType
    deleteNode(_id: ID): ID
    archiveNode(_id: ID): ID
    # ----------------- Edge -----------------
    createEdge(edge: NQEdgeInput): NQEdgeType
    editEdge(_id: ID, edge: NQEdgeInput): NQEdgeType
    deleteEdge(_id: ID): ID
    # ----------------- In-app Questionnaire -----------------
    createInAppQuestionnaire(
      questionnaire: InAppQuestionnaireInput
    ): InAppQuestionnaireType
    modifyInAppQuestionnaire(
      _id: ID!
      questionnaire: InAppQuestionnaireInput!
    ): InAppQuestionnaireType
    deleteInAppQuestionnaire(_id: ID): ID
    archiveInAppQuestionnaire(_id: ID!): ID
    restoreInAppQuestionnaire(_id: ID!): ID
    # ----------------- In-app Questionnaire Contents -----------------
    createInAppQuestionnaireContent(
      inAppQuestionnaireContent: InAppQuestionnaireContentInput
    ): InAppQuestionnaireContentType
    modifyInAppQuestionnaireContent(
      inAppQuestionnaireContent: InAppQuestionnaireContentInput
    ): InAppQuestionnaireContentType
    deleteInAppQuestionnaireContent(_id: ID): ID
    # ----------------- In-app Questionnaire Response -----------------
    createInAppQuestionnaireResponse(
      questionnaireResponse: InAppQuestionnaireResponseInput
    ): InAppQuestionnaireResponseType
    modifyInAppQuestionnaireResponse(
      _id: ID
      questionnaireResponse: InAppQuestionnaireResponseInput
    ): InAppQuestionnaireResponseType
    deleteInAppQuestionnaireResponse(_id: ID): ID
    #  -----------------Notification Questionnaire Response -----------------
    createNotificationQuestionnaireResponse(
      notificationQuestionnaireResponse: NotificationQuestionnaireResponseInput
    ): NotificationQuestionnaireResponseType
    modifyNotificationQuestionnaireResponse(
      _id: ID
      notificationQuestionnaireResponse: NotificationQuestionnaireResponseInput
    ): NotificationQuestionnaireResponseType
    deleteNotificationQuestionnaireResponse(_id: ID): ID
    #  ----------------- Messaging -----------------
    sendNotificationMessage(
      notificationMessage: NotificationMessageInput
    ): String
    sendNotificationTextMessage(
      notificationTextMessage: NotificationTextMessageInput
    ): String
    # ----------------- Role -----------------
    grantRole(role: String, uid: ID): RoleType
    # ----------------- Post -----------------
    createPost(post: PostInput): PostType
    modifyPost(_id: ID, post: PostInput): PostType
    deletePost(_id: ID): ID
  }
`;

const typeDefs = [
  Query,
  Mutation,
  IconType,
  UserType,
  UserInput,
  FileType,
  UploadResultType,
  NotificationQuestionnaireType,
  NotificationQuestionnaireInput,
  NQGraphType,
  NQGraphInput,
  NQTODType,
  NQTODInput,
  NQEdgeType,
  NQEdgeInput,
  NQNodeType,
  NQNodeInput,
  NQConditionType,
  NQConditionInput,
  NQAppQuestionnaireType,
  NQAppQuestionnaireInput,
  NQDataType,
  NQDataInput,
  NQQuestionType,
  NQQuestionInput,
  NQQuestionChoiceType,
  NQQuestionChoiceInput,
  InAppQuestionnaireFreeTextQuestionInput,
  InAppQuestionnaireFreeTextQuestionType,
  InAppQuestionnaireMultipleChoiceItemInput,
  InAppQuestionnaireMultipleChoiceItemType,
  InAppQuestionnaireMultipleChoiceQuestionType,
  InAppQuestionnaireMultipleChoiceQuestionInput,
  InAppQuestionnaireInput,
  InAppQuestionnaireType,
  InAppQuestionnaireResponseType,
  InAppQuestionnaireResponseInput,
  InAppQuestionnaireFreeTextResponseInput,
  InAppQuestionnaireFreeTextResponseType,
  InAppQuestionnaireMultipleChoiceResponseInput,
  InAppQuestionnaireMultipleChoiceResponseType,
  NotificationQuestionnaireResponseType,
  NotificationQuestionnaireResponseInput,
  NotificationQuestionnaireResponseDataInput,
  NotificationQuestionnaireResponseDataType,
  NotificationQuestionnaireByTimeOfDayType,
  NotificationMessageInput,
  NotificationMessageType,
  NotificationTextMessageInput,
  NotificationTextMessageType,
  NodePositionInput,
  NodePositionType,
  NotificationLogInput,
  NotificationLogType,
  InAppQuestionnaireContentInput,
  InAppQuestionnaireContentType,
  InAppQuestionnaireContentEntryInput,
  InAppQuestionnaireContentEntryType,
  RoleType,
  PostInput,
  PostType,
];

module.exports = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: _.merge(
    {},
    { Date: dateScalar },
    { Upload: GraphQLUpload },
    userResolvers,
    iconResolvers,
    notificationQuestionnaireResolvers,
    nqNodeResolvers,
    nqEdgeResolvers,
    inAppQuestionnaireResolvers,
    inAppQuestionnaireResponseResolvers,
    notificationQuestionnaireResponseResolvers,
    notificationMessageResolvers,
    notificationQuestionnaireByTimeOfDayResolvers,
    rolesResolvers,
    inAppQuestionnaireContentResolvers,
    postResolvers
  ),
});
