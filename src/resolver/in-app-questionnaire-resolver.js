const InAppQuestionnnaire = require("../model/inappquestionnaire/in-app-questionnaire");
const Auth = require("../middleware/auth");
const logger = require("../util/logger");

const tag = "in-app-questionnaire-resolvers: ";

/***
 * Resolver functions for in-app questionnaires.
 * Simple functions which pass through the input received
 * from the GraphQL request. All params (parent, args, context, info)
 * are passed through in order to make callbacks look the same
 * to auth functions. In order to extend these resolvers,
 * deconstruct (e.g '{ parent, args }') the arguments passed to the
 * callback or define all parameters for your function.
 */
module.exports.inAppQuestionnaireResolvers = {
  Query: {
    inAppQuestionnaire(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveInAppQuestionnaire
      );
    },
    inAppQuestionnaires(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveInAppQuestionnaires
      );
    },
  },
  Mutation: {
    createInAppQuestionnaire(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveCreateInAppQuestionnaire
      );
    },
    modifyInAppQuestionnaire(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveModifyInAppQuestionnaire
      );
    },
    deleteInAppQuestionnaire(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveDeleteInAppQuestionnaire
      );
    },
    archiveInAppQuestionnaire(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveArchiveInAppQuestionnaire
      );
    },
    restoreInAppQuestionnaire(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveRestoreInAppQuestionnaire
      );
    },
  },
};

const resolveInAppQuestionnaire = async function (parent, args, context, info) {
  try {
    return await InAppQuestionnnaire.getInAppQuestionnaire(args);
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveInAppQuestionnaires = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await InAppQuestionnnaire.getInAppQuestionnaires(args);
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveCreateInAppQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await InAppQuestionnnaire.createInAppQuestionnaire(
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

const resolveModifyInAppQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await InAppQuestionnnaire.updateInAppQuestionnaire(
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

const resolveDeleteInAppQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await InAppQuestionnnaire.deleteInAppQuestionnaire(args);
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveArchiveInAppQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    await InAppQuestionnnaire.updateInAppQuestionnaire(args._id, {
      isArchived: true,
    });
    return args._id;
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveRestoreInAppQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    await InAppQuestionnnaire.updateInAppQuestionnaire(args._id, {
      isArchived: false,
    });
    return args._id;
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};
