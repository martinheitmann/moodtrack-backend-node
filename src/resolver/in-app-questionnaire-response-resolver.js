const { async } = require("regenerator-runtime");
const InAppQuestionnnaireResponse = require("../model/inappquestionnaireresponse/in-app-questionnaire-response");
const Auth = require("../middleware/auth");

module.exports.inAppQuestionnaireResponseResolvers = {
  Query: {
    inAppQuestionnaireResponse(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveInAppQuestionnaireResponse
      );
    },
    inAppQuestionnaireResponses(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveInAppQuestionnaireResponses
      );
    },
  },
  Mutation: {
    createInAppQuestionnaireResponse(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveCreateInAppQuestionnaireResponse
      );
    },
    modifyInAppQuestionnaireResponse(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveModifyInAppQuestionnaireResponse
      );
    },
    deleteInAppQuestionnaireResponse(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveDeleteInAppQuestionnaireResponse
      );
    },
  },
};

const resolveInAppQuestionnaireResponse = async function (
  parent,
  args,
  context,
  info
) {
  try {
    const id = args._id;
    return await InAppQuestionnnaireResponse.getInAppQuestionnaireResponse({
      _id: id,
    });
  } catch (error) {
    return error;
  }
};

const resolveInAppQuestionnaireResponses = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await InAppQuestionnnaireResponse.getInAppQuestionnaireResponses(
      args
    );
  } catch (error) {
    return error;
  }
};

const resolveCreateInAppQuestionnaireResponse = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await InAppQuestionnnaireResponse.createInAppQuestionnaireResponse(
      args.questionnaireResponse
    );
  } catch (error) {
    return error;
  }
};

const resolveModifyInAppQuestionnaireResponse = async function (
  parent,
  args,
  context,
  info
) {
  try {
    return await InAppQuestionnnaireResponse.updateInAppQuestionnaireResponse(
      args._id,
      args.questionnaire
    );
  } catch (error) {
    return error;
  }
};

const resolveDeleteInAppQuestionnaireResponse = async function (
  parent,
  args,
  context,
  info
) {
  try {
    const id = args._id;
    return await InAppQuestionnnaire.deleteInAppQuestionnaireResponse(id);
  } catch (error) {
    return error;
  }
};
