const cron = require("node-cron");
const Notification = require("./notification");
const NotificationQuestionnaire = require("../model/nqgraph/notification-questionnaire");
const NQnode = require("../model/nqgraph/nq-node");
const NotificationMessage = require("../model/notificationmessage/notification-message");
const moment = require("moment-timezone");
const logger = require("../util/logger");

const tag = "notification-job: ";

module.exports.startPushNotificationJob = function (cronJobPattern) {
  logger.log({
    level: "info",
    message: `Notification job starting (${new Date()})`,
  });
  cron.schedule(cronJobPattern, async () => {
    try {
      let notificationCount = 0;
      const timeZone = process.env.TICKER_TIMEZONE || "Europe/Oslo";
      const zoneObject = moment(new Date()).tz(timeZone);
      logger.log({
        level: "info",
        message: `Tick for timestamp ${zoneObject.format()}, server timestamp ${new Date()}`,
      });
      let currentHour = zoneObject.hour();
      let currentMinute = zoneObject.minute();
      const activeNotificationQuestionnaires =
        await getActiveNotificationQuestionnaires();
      if (
        activeNotificationQuestionnaires &&
        activeNotificationQuestionnaires.length > 0
      ) {
        for (let i = 0; i < activeNotificationQuestionnaires.length; i++) {
          const activeNotificationQuestionnaire =
            activeNotificationQuestionnaires[i];
          if (
            activeNotificationQuestionnaire.enrolledUsers &&
            activeNotificationQuestionnaire.enrolledUsers.length > 0
          ) {
            const rootNodesForNotificationQuestionnaire =
              await getRootNodesForNotificationQuestionnaire(
                activeNotificationQuestionnaire._id
              );
            if (
              rootNodesForNotificationQuestionnaire &&
              rootNodesForNotificationQuestionnaire.length > 0
            ) {
              const hasNodeForTime = rootNodeExistsForTime(
                currentMinute,
                currentHour,
                rootNodesForNotificationQuestionnaire
              );
              if (hasNodeForTime) {
                for (
                  let j = 0;
                  j < activeNotificationQuestionnaire.enrolledUsers.length;
                  j++
                ) {
                  const user = activeNotificationQuestionnaire.enrolledUsers[j];
                  const userToken = user.fcmRegistrationToken;
                  const acceptsNotifications = user.notificationsEnabled;
                  if (userToken && acceptsNotifications) {
                    const messageLog = await storeSentMessage(
                      user._id,
                      activeNotificationQuestionnaire._id
                    );
                    const notificationData = createNotificationData(
                      messageLog._id,
                      activeNotificationQuestionnaire._id,
                      currentMinute,
                      currentHour,
                      false
                    );
                    await Notification.sendDataNotification(
                      Notification.priorities.normal,
                      userToken,
                      notificationData
                    );
                    notificationCount++;
                  }
                }
              }
            }
          }
        }
      }
      if (notificationCount > 0) {
        logger.log({
          level: "info",
          message: `Sent ${notificationCount} notifications.`,
        });
      }
    } catch (error) {
      logger.log({ level: "error", message: tag + error });
    }
  });
};

function createNotificationData(
  messageId,
  notificationQuestionnaireId,
  minute,
  hour,
  isDryRun
) {
  const notificationData = {
    messageId: messageId,
    nqId: notificationQuestionnaireId,
    timeOfDay: {
      minute: minute,
      hour: hour,
    },
    isDryRun: isDryRun,
  };
  const dataString = JSON.stringify(notificationData);
  return dataString;
}

async function getActiveNotificationQuestionnaires() {
  return NotificationQuestionnaire.getNotificationQuestionnaires({
    isActive: true,
  });
}

async function getRootNodesForNotificationQuestionnaire(nqId) {
  try {
    return await NQnode.getNodes({
      nqId: nqId,
      isSourceNode: true,
      isArchived: false,
    });
  } catch (error) {
    return null;
  }
}

function rootNodeExistsForTime(minute, hour, nodes) {
  try {
    if (nodes && nodes.length) {
      for (const node of nodes) {
        if (node.data.type === "appquestionnaire") {
          if (
            node.data.appquestionnaire.timeOfDay.hour === hour &&
            node.data.appquestionnaire.timeOfDay.minute === minute
          ) {
            return true;
          }
        } else if (node.data.type === "question") {
          if (
            node.data.question.timeOfDay.hour === hour &&
            node.data.question.timeOfDay.minute === minute
          ) {
            return true;
          }
        } else {
          throw new Error(
            "node.data.type must have a value of either 'appquestionnaire' or 'question'."
          );
        }
      }
    }
    return false;
  } catch (error) {
    logger.log({ level: "error", message: tag + error });
    return false;
  }
}

const storeSentMessage = async function (userId, nqId) {
  const message = {
    timestamp: new Date(),
    userId: userId,
    nqId: nqId,
  };
  const messageDoc = await NotificationMessage.createNotificationMessage(
    message
  );
  return messageDoc;
};
