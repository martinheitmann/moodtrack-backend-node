const Notification = require("../push/notification");
const NotificationMessage = require("../model/notificationmessage/notification-message");
const logger = require("../util/logger");

module.exports.notificationMessageResolvers = {
  Query: {},
  Mutation: {
    sendNotificationMessage(parent, args, context, info) {
      return resolveSendNotificationQuestionnaire(args);
    },
    sendNotificationTextMessage(parent, args, context, info) {
      return resolveSendNotificationQuestionnaire(args);
    },
  },
};

const resolveSendTextNotification = async function (args) {
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
  } catch (err) {
    logger.log({ level: "error", message: err });
    return err;
  }
};

const resolveSendNotificationQuestionnaire = async function (args) {
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
      return new Error("Error validating message parameters");
    }
  } catch (err) {
    logger.log({ level: "error", message: err });
    return err;
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
  } catch (err) {
    logger.log({ level: "error", message: err });
    return err;
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
  } catch (err) {
    logger.log({ level: "error", message: err });
    return err;
  }
};
