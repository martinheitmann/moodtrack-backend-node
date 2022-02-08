const admin = require("firebase-admin");
const logger = require("../util/logger");
const User = require("../model/user/user");

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
    handleFcmError(err, token);
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
    handleFcmError(err, token);
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
      handleFcmError(err, token);
      throw err;
    }
  } else {
    throw new Error("Priority must be either HIGH or NORMAL");
  }
};

function handleFcmError(error, token) {
  errorLogger(error);
  if (error.code) {
    // Should probably also handle other FCM errors, but other errors may have multiple causes.
    // Probably safe to remove the token for this error code.
    if (error.code === "messaging/registration-token-not-registered") {
      removeFCMTokens(token);
    }
  }
}

async function removeFCMTokens(fcmToken) {
  // In theory fine to just look for one user, but if multiple of the same
  // token exists we can might as well clear those too.
  const users = await User.findUsers({ fcmRegistrationToken: fcmToken });
  if (users && users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userId = user._id;
      if (userId) {
        const updatedUser = await User.updateUser(userId, {
          fcmRegistrationToken: null,
        });
        if (updatedUser) {
          logger.log({
            level: "info",
            message: tag + "removed invalid fcm token for " + updatedUser._id,
          });
        }
      }
    }
  }
}
