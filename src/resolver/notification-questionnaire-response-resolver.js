const { async } = require("regenerator-runtime");
const NotificationQuestionnaireResponse = require("../model/notificationresponse/notification-questionnaire-response");
const Auth = require("../middleware/auth");
const logger = require("../util/logger");

const tag = "notification-questionaire-response-resolver: ";

module.exports.notificationQuestionnaireResponseResolvers = {
  Query: {
    notificationQuestionnaireResponse(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveNotificationQuestionnaireResponse
      );
    },
    notificationQuestionnaireResponses(parent, args, context, info) {
      return Auth.requireOwnership(
        args.user || null,
        parent,
        args,
        context,
        info,
        resolveNotificationQuestionnaireResponses
      );
    },
    numberOfResponsesForEachDay(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveGetNumberOfResponsesForEachDay
      );
    },
    notificationQuestionnaireResponsesBetween(parent, args, context, info) {
      return Auth.requireOwnership(
        args._id || null,
        parent,
        args,
        context,
        info,
        resolveNotificationQuestionnaireResponsesBetween
      );
    },
  },
  Mutation: {
    createNotificationQuestionnaireResponse(parent, args, context, info) {
      return Auth.requireOwnership(
        args.notificationQuestionnaireResponse.user || null,
        parent,
        args,
        context,
        info,
        resolveCreateNotificationQuestionnaireResponse
      );
    },
    modifyNotificationQuestionnaireResponse(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveModifyNotificationQuestionnaireResponse
      );
    },
    deleteNotificationQuestionnaireResponse(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveDeleteNotificationQuestionnaireResponse
      );
    },
  },
};

const resolveNotificationQuestionnaireResponse = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await NotificationQuestionnaireResponse.getNotificationQuestionnaireResponse(
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

const resolveNotificationQuestionnaireResponses = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await NotificationQuestionnaireResponse.getNotificationQuestionnaireResponses(
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

const resolveCreateNotificationQuestionnaireResponse = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await NotificationQuestionnaireResponse.createNotificationQuestionnaireResponse(
      args.notificationQuestionnaireResponse
    );
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveModifyNotificationQuestionnaireResponse = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await NotificationQuestionnaireResponse.updateNotificationQuestionnaireResponse(
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

const resolveDeleteNotificationQuestionnaireResponse = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await NotificationQuestionnaireResponse.deleteNotificationQuestionnaireResponse(
      args._id
    );
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveGetNumberOfResponsesForEachDay = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await NotificationQuestionnaireResponse.aggregateNumberOfResponsesEachDay(
      args.startDate,
      args.endDate
    );
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveNotificationQuestionnaireResponsesBetween = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await NotificationQuestionnaireResponse.getNotificationQuestionnaireResponsesBetween(
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
