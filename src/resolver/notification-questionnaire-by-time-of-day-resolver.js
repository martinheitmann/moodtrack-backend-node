const { async } = require("regenerator-runtime");
const NotificationQuestionnare = require("../model/nqgraph/notification-questionnaire");
const NQNode = require("../model/nqgraph/nq-node");
const NQEdge = require("../model/nqgraph/nq-edge");
const GraphUtils = require("../util/graph-utils");
const Auth = require("../middleware/auth");
const logger = require("../util/logger");

const tag = "notification-questionaire-btod-resolver: ";

module.exports.notificationQuestionnaireByTimeOfDayResolvers = {
  Query: {
    notificationQuestionnaireByTimeOfDay(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        getNotificationQuestionnaireGraph
      );
    },
  },
  Mutation: {},
};

const getNotificationQuestionnaireGraph = async function (
  parent,
  args,
  context,
  info
) {
  const notificationQuestionnaireId = args.notificationQuestionnaireId;
  const timeOfDay = args.timeOfDay;

  const notificationQuestionnaire =
    await NotificationQuestionnare.findNotificationQuestionnaireById(
      notificationQuestionnaireId
    );
  if (notificationQuestionnaire) {
    /*
      Since some nodes/edges may not contain the 'isArchived' property,
      (e.g. due to migrations), also query for 'undefined'.
    */
    const notificationQuestionnaireNodes = await NQNode.getNodes({
      nqId: notificationQuestionnaire._id,
      isArchived: [false, undefined],
    });
    const notificationQuestionnaireEdges = await NQEdge.getEdges({
      nqId: notificationQuestionnaire._id,
      isArchived: [false, undefined],
    });

    const rootNode = notificationQuestionnaireNodes.find(function (n) {
      if (n.data.type === "appquestionnaire") {
        return (
          n.isSourceNode &&
          n.data.appquestionnaire.timeOfDay.hour === timeOfDay.hour &&
          n.data.appquestionnaire.timeOfDay.minute === timeOfDay.minute
        );
      } else if (n.data.type === "question") {
        return (
          n.isSourceNode &&
          n.data.question.timeOfDay.hour === timeOfDay.hour &&
          n.data.question.timeOfDay.minute === timeOfDay.minute
        );
      } else return false;
    });
    if (rootNode) {
      /* If the graph contains a cycle we shouldn't 
        perform a dfs search.
        TODO: Allow for notification loop structures without throwing?
      */
      if (
        GraphUtils.hasCycleObjectId(
          rootNode,
          notificationQuestionnaireNodes,
          notificationQuestionnaireEdges
        )
      ) {
        const error = new Error(
          "Cannot proceed with a graph which contains a cycle."
        );
        logger.log({
          level: "error",
          message: tag + error,
        });
        return error;
      }
      // Find the connected components only.
      const connectedNodes = GraphUtils.depthFirstSearchObjectId(
        rootNode,
        notificationQuestionnaireNodes,
        notificationQuestionnaireEdges
      );
      // Fetch the edges belonging to only the connected components.
      const connectedEdges = GraphUtils.getEdgesForNodesObjectId(
        connectedNodes,
        notificationQuestionnaireEdges
      );

      return {
        nqId: notificationQuestionnaire._id,
        nodes: connectedNodes,
        edges: connectedEdges,
      };
    } else {
      const error = new Error(
        `No root node found for questionnaire ${notificationQuestionnaireId}.`
      );
      logger.log({
        level: "error",
        message: tag + error,
      });
      return error;
    }
  } else {
    const error = new Error(
      `Could not find the notification questionnaire for ${notificationQuestionnaireId}.`
    );
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};
