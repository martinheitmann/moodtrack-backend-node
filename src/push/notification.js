const admin = require("firebase-admin");
const logger = require("../util/logger");

const tag = "notification: ";

function successLogger(result) {
  logger.log({
    level: "verbose",
    message: tag + "Successfully sent message with id " + result,
  });
}

function errorLogger(error) {
  logger.log({ level: "error", message: tag + error });
}

/*
  Subset of valid FCM priorities.
*/
module.exports.priorities = {
  high: "HIGH",
  normal: "NORMAL",
};

/**
 * Sends a notification with the priority set to normal.
 * @param {string} token
 * @param {string} data
 * @returns {Promise} null or the messaging result.
 */
module.exports.sendNormalPriorityNotification = async function (token, data) {
  try {
    const message = {
      data: { item: data },
      token: token,
      android: {
        priority: "NORMAL",
      },
    };
    const result = await admin.messaging().send(message);
    if (result) {
      successLogger(result);
      return result;
    }
    return null;
  } catch (err) {
    errorLogger(err);
    throw err;
  }
};

/**
 * Sends a notification with the priority set to high.
 * @param {string} token
 * @param {string} data
 * @returns {Promise} null or the messaging result.
 */
module.exports.sendHighPriorityNotification = async function (token, data) {
  try {
    const message = {
      data: { item: data },
      token: token,
      android: {
        priority: "HIGH",
      },
    };
    const result = await admin.messaging().send(message);
    if (result) {
      successLogger(result);
      return result;
    }
    return null;
  } catch (err) {
    errorLogger(err);
    throw err;
  }
};

/**
 * Sends a notification with the specified priority.
 * @param {string} priority
 * @param {string} token
 * @param {string} data
 * @returns {Promise} The messaging result.
 */
module.exports.sendDataNotification = async function (priority, token, data) {
  if (priority == "HIGH" || priority == "NORMAL") {
    try {
      const message = {
        data: { item: data },
        token: token,
        android: {
          priority: priority,
        },
      };
      const result = await admin.messaging().send(message);
      if (result) {
        successLogger(result);
        return result;
      } else {
        throw new Error("Invalid result from fcm messaging.");
      }
    } catch (err) {
      errorLogger(err);
      throw err;
    }
  } else {
    throw new Error("Priority must be either HIGH or NORMAL");
  }
};
