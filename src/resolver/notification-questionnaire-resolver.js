const NotificationQuestionnaire = require("../model/nqgraph/notification-questionnaire");
const Auth = require("../middleware/auth");
const logger = require("../util/logger");

module.exports.notificationQuestionnaireResolvers = {
  Query: {
    notificationQuestionnaire(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveNotificationQuestionnaire
      );
    },
    notificationQuestionnaires(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveNotificationQuestionnaires
      );
    },
  },
  Mutation: {
    createNotificationQuestionnaire(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveCreateNotificationQuestionnaire
      );
    },
    modifyNotificationQuestionnaire(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveModifyNotificationQuestionnaire
      );
    },
    deleteNotificationQuestionnaire(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveDeleteNotificationQuestionnaire
      );
    },
    enrollUserInNotificationQuestionnaire(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveEnrollUserInNotificationQuestionnaire
      );
    },
    removeUserFromNotificationQuestionnaire(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveRemoveUserFromNotificationQuestionnaire
      );
    },
    archiveNotificationQuestionnaire(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveArchiveNotificationQuestionnaire
      );
    },
    restoreNotificationQuestionnaire(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveRestoreNotificationQuestionnaire
      );
    },
  },
};

const resolveRestoreNotificationQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    const id = args._id;
    const result = NotificationQuestionnaire.updateNotificationQuestionnaire(
      id,
      { isArchived: false }
    );
    return result._id;
  } catch (error) {
    logger.log({ level: "error", message: error });
    return error;
  }
};

const resolveArchiveNotificationQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    const id = args._id;
    const result = NotificationQuestionnaire.updateNotificationQuestionnaire(
      id,
      { isArchived: true, isActive: false }
    );
    return result._id;
  } catch (error) {
    logger.log({ level: "error", message: error });
    return error;
  }
};

const resolveRemoveUserFromNotificationQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    const nqId = args._id;
    const userId = args.userId;
    return NotificationQuestionnaire.removeUser(nqId, userId);
  } catch (error) {
    logger.log({ level: "error", message: error });
    return error;
  }
};

const resolveEnrollUserInNotificationQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    const nqId = args._id;
    const userId = args.userId;
    return NotificationQuestionnaire.addUser(nqId, userId);
  } catch (error) {
    logger.log({ level: "error", message: error });
    return error;
  }
};

const resolveNotificationQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    const id = args._id;
    return NotificationQuestionnaire.findNotificationQuestionnaireById(id);
  } catch (error) {
    logger.log({ level: "error", message: error });
    return error;
  }
};

const resolveNotificationQuestionnaires = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return NotificationQuestionnaire.getNotificationQuestionnaires(args);
  } catch (error) {
    logger.log({ level: "error", message: error });
    return error;
  }
};

const resolveCreateNotificationQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    const notificationQuestionnaire = args.notificationQuestionnaire;
    return await NotificationQuestionnaire.createNotificationQuestionnaire(
      notificationQuestionnaire
    );
  } catch (error) {
    logger.log({ level: "error", message: error });
    return error;
  }
};

const resolveModifyNotificationQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    const id = args._id;
    const notificationQuestionnaire = args.notificationQuestionnaire;
    return await NotificationQuestionnaire.updateNotificationQuestionnaire(
      id,
      notificationQuestionnaire
    );
  } catch (error) {
    logger.log({ level: "error", message: error });
    return error;
  }
};

const resolveDeleteNotificationQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return NotificationQuestionnaire.deleteOneNotificationQuestionnaire(args);
  } catch (error) {
    logger.log({ level: "error", message: error });
    return error;
  }
};
