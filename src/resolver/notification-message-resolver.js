const Notification = require("../push/notification");
const NotificationMessage = require("../model/notificationmessage/notification-message");
const Auth = require("../middleware/auth");
const logger = require("../util/logger");

const tag = "notification-message-resolver: ";

module.exports.notificationMessageResolvers = {
  Query: {},
  Mutation: {
    sendNotificationMessage(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveSendNotificationQuestionnaire
      );
    },
    sendNotificationTextMessage(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveSendTextNotification
      );
    },
  },
};

const resolveSendTextNotification = async function (
  parent,
  args,
  context,
  info
) {
  try {
    const title = args.title;
    const body = args.body;
    const token = args.token;
    if (title & body && token) {
      const notificationData = {
        body: body,
        title: title,
      };
      const dataString = JSON.stringify(notificationData);
      const result = await Notification.sendDataNotification(
        Notification.priorities.normal,
        token,
        dataString
      );
    } else {
      return new Error("Error validating message parameters");
    }
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveSendNotificationQuestionnaire = async function (
  parent,
  args,
  context,
  info
) {
  try {
    const isDryRun = args.notificationMessage.isDryRun;
    const notificationMessage = args.notificationMessage;
    const notificationQuestionnaireId =
      notificationMessage.notificationQuestionnaireId;
    const timeOfDay = notificationMessage.timeOfDay;
    const fcmToken = notificationMessage.fcmToken;
    if (notificationQuestionnaireId && timeOfDay && fcmToken) {
      const messageRecord = await storeSentMessage(
        null,
        notificationQuestionnaireId
      );
      const notificationData = {
        messageId: messageRecord._id,
        nqId: notificationQuestionnaireId,
        timeOfDay: timeOfDay,
        isDryRun: isDryRun,
      };
      const dataString = JSON.stringify(notificationData);
      const result = await Notification.sendDataNotification(
        Notification.priorities.normal,
        fcmToken,
        dataString
      );
      return result;
    } else {
      throw new Error("Error validating message parameters");
    }
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const storeSentMessage = async function (userId, nqId) {
  try {
    const message = {
      timestamp: new Date(),
      userId: userId,
      nqId: nqId,
    };
    const messageId = await NotificationMessage.createNotificationMessage(
      message
    );
    return messageId;
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const storeSentTextMessage = async function (userId, title, body) {
  try {
    const message = {
      timestamp: new Date(),
      userId: userId,
      title: title,
      body: body,
    };
    const messageId = await NotificationMessage.createNotificationMessage(
      message
    );
    return messageId;
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};
