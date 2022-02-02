const InAppQuestionnnaireContent = require("../model/inappquestionnaire/in-app-questionnaire-content");
const Auth = require("../middleware/auth");
const logger = require("../util/logger");

const tag = "in-app-questionnaire-content-resolvers: ";

module.exports.inAppQuestionnaireContentResolvers = {
  Query: {
    inAppQuestionnaireContent(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveInAppQuestionnaireContent
      );
    },
    latestInAppQuestionnaireContent(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveLatestInAppQuestionnaireContent
      );
    },
    inAppQuestionnaireContents(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveInAppQuestionnaireContents
      );
    },
  },
  Mutation: {
    createInAppQuestionnaireContent(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveCreateInAppQuestionnaireContent
      );
    },
    modifyInAppQuestionnaireContent(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveModifyInAppQuestionnaireContent
      );
    },
    deleteInAppQuestionnaireContent(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveDeleteInAppQuestionnaireContent
      );
    },
  },
};

const resolveInAppQuestionnaireContent = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await InAppQuestionnnaireContent.getInAppQuestionnaireContent({
      _id: args,
    });
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveInAppQuestionnaireContents = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await InAppQuestionnnaireContent.getInAppQuestionnaireContents(args);
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveCreateInAppQuestionnaireContent = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await InAppQuestionnnaireContent.createInAppQuestionnaireContent(
      args.inAppQuestionnaireContent
    );
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveModifyInAppQuestionnaireContent = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await InAppQuestionnnaireContent.updateInAppQuestionnaireContent(
      args._id,
      args.questionnaire
    );
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveDeleteInAppQuestionnaireContent = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await InAppQuestionnnaireContent.deleteInAppQuestionnaireContent(
      args
    );
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveLatestInAppQuestionnaireContent = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await InAppQuestionnnaireContent.getLatestInAppQuestionnaireContent(
      args
    );
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};
