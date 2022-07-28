const logger = require("../util/logger");
const { parseAsync } = require("json2csv");
const Auth = require("../middleware/auth");
const dateUtils = require("../util/date-utils");
const InAppQuestionnnaireResponse = require("../model/inappquestionnaireresponse/in-app-questionnaire-response");
const NotificationQuestionnaireResponse = require("../model/notificationresponse/notification-questionnaire-response");

const tag = "csv-resolvers: ";

module.exports.csvResolvers = {
  Query: {
    userNotificationQuestionnaireResponsesCsv(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveCreateUserNotificationQuestionnaireResponseCsv
      );
    },
    userInAppQuestionnaireResponsesCsv(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveCreateUserInAppQuestionnaireResponseCsv
      );
    },
  },
  Mutation: {},
};

const resolveCreateUserInAppQuestionnaireResponseCsv = async function (
  parent,
  { userId },
  context,
  info
) {
  try {
    if (userId) {
      const userResponses =
        await InAppQuestionnnaireResponse.getInAppQuestionnaireResponses({
          user: userId,
        });
      if (userResponses && userResponses.length > 0) {
        const mappedResponses = mapInAppResponses(userResponses);
        const csv = await parseCsv(mappedResponses);
        const buff = new Buffer.from(csv);
        const base64csv = buff.toString("base64");
        return {
          _id: "generated-object-no-id",
          ownerId: userId,
          filename: userId + "-in-app-responses.csv",
          data: base64csv,
        };
      }
      return null;
    }
    return new Error("A userId must be defined");
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveCreateUserNotificationQuestionnaireResponseCsv = async function (
  parent,
  { userId },
  context,
  info
) {
  try {
    if (userId) {
      const userResponses =
        await NotificationQuestionnaireResponse.getNotificationQuestionnaireResponses(
          {
            user: userId,
          }
        );
      if (userResponses && userResponses.length > 0) {
        const mappedResponses = mapNqResponses(userResponses);
        const csv = await parseCsv(mappedResponses);
        const buff = new Buffer.from(csv);
        const base64csv = buff.toString("base64");
        return {
          _id: "generated-object-no-id",
          ownerId: userId,
          filename: userId + "-nq-responses.csv",
          data: base64csv,
        };
      }
      return null;
    }
    return new Error("A userId must be defined");
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

function mapNqResponses(responses) {
  let mapped = [];
  if (responses && responses.length > 0) {
    mapped = responses.map((r) => {
      return {
        user_id: r.user._id,
        user_email: r.user.email,
        question_text: r.responseData.questionText,
        selected_choice: r.responseData.selectedChoice.choiceValue,
        selected_icon: r.responseData.selectedChoice.choiceIcon,
        timestamp: dateUtils.formatMoment(dateUtils.getZonedDate(r.timestamp)),
        message_identifier: r.messageId || null,
      };
    });
  }
  return mapped;
}

function mapInAppResponses(responses) {
  let all = [];
  for (let i = 0; i < responses.length; i++) {
    const mapped = inAppResponseToListElements(responses[i]);
    all = all.concat(mapped);
  }
  console.log("-------------------------");
  console.log(all);
  return all;
}

function inAppResponseToListElements(response) {
  console.log(response);
  console.log("-------------------------");
  const ft = response.freeTextItems;
  const mc = response.multipleChoiceItems;
  const ftMapped = ft.map((f) => {
    return {
      response_id: response._id,
      question: f.question,
      response: f.response,
      index: f.index,
      message_id: response.messageId,
      user_id: response.user._id,
      user_email: response.user.email,
      name: response.questionnaire.name,
      timestamp: dateUtils.formatMoment(
        dateUtils.getZonedDate(response.timestamp)
      ),
    };
  });
  const mcMapped = mc.map((m) => {
    return {
      response_id: response._id,
      question: m.question,
      response: m.selectedChoice.value,
      index: m.index,
      message_id: response.messageId,
      user_id: response.user._id,
      user_email: response.user.email,
      name: response.questionnaire.name,
      timestamp: dateUtils.formatMoment(
        dateUtils.getZonedDate(response.timestamp)
      ),
    };
  });
  const ret = ftMapped.concat(mcMapped).sort((a, b) => {
    return a.index - b.index;
  });
  console.log(ret);
  return ret;
}

async function parseCsv(obj) {
  return await parseAsync(obj);
}
