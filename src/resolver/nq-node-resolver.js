const NQNode = require("../model/nqgraph/nq-node");
const NQEdge = require("../model/nqgraph/nq-edge");
const Auth = require("../middleware/auth");

/**
 * Resolver functions for notification questionnaire nodes.
 * Simple functions which pass through the input received
 * from the GraphQL request. All params (parent, args, context, info)
 * are passed through in order to make callbacks look the same
 * to auth functions. In order to extend these resolvers,
 * deconstruct (e.g '{ parent, args }') the arguments passed to the
 * callback or define all parameters for your function.
 */
module.exports.nqNodeResolvers = {
  Query: {
    node(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveGetNqNode);
    },
    nodes(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveGetNqNodes);
    },
  },
  Mutation: {
    createNode(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveCreateNqNode
      );
    },
    editNode(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveEditNqNode);
    },
    deleteNode(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveDeleteNqNode
      );
    },
    archiveNode(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveArchiveNqNode
      );
    },
  },
};

const resolveCreateNqNode = async function (parent, args, context, info) {
  try {
    return await NQNode.createNode(args.node);
  } catch (error) {
    return error;
  }
};

const resolveEditNqNode = async function (parent, args, context, info) {
  try {
    const id = args._id;
    const node = args.node;
    return await NQNode.updateNode(id, node);
  } catch (error) {
    return error;
  }
};

const resolveGetNqNode = async function (parent, args, context, info) {
  try {
    return await NQNode.findNode(args);
  } catch (error) {
    return error;
  }
};

const resolveGetNqNodes = async function (parent, args, context, info) {
  try {
    return await NQNode.getNodes(args);
  } catch (error) {
    return error;
  }
};

/**
 * Deletes a node. Also deletes all outgoing and incoming edges
 * related to the deleted node.
 * @param {*} parent
 * @param {*} args
 * @param {*} context
 * @param {*} info
 * @returns _id of the deleted node or null.
 */
const resolveDeleteNqNode = async function (parent, args, context, info) {
  try {
    const nodeId = args._id;
    // Find incoming/outgoing edges.
    const edgesToNode = await NQEdge.getEdges({ target: nodeId });
    const edgesFromNode = await NQEdge.getEdges({ source: nodeId });
    // Delete all incoming edges.
    if (edgesToNode && edgesToNode.length > 0) {
      for (const edge of edgesToNode) {
        await NQEdge.deleteEdge({ _id: edge._id });
      }
    }
    // Delete all outgoing edges.
    if (edgesFromNode && edgesFromNode.length > 0) {
      for (const edge of edgesFromNode) {
        await NQEdge.deleteEdge({ _id: edge._id });
      }
    }
    // Delete the node
    await NQNode.deleteNode(args);
    return args._id || null;
  } catch (error) {
    return error;
  }
};

/**
 * Archives a node by setting its isArchived property to true.
 * Simultaneously archives connected edges in order to preserve
 * graph invariants.
 * @param {*} parent
 * @param {*} args
 * @param {*} context
 * @param {*} info
 * @returns _id of the archived node.
 */
const resolveArchiveNqNode = async function (parent, args, context, info) {
  try {
    console.log("resolveArchiveNqNode", args._id);
    const nodeId = args._id;
    // Find incoming/outgoing edges.
    const edgesToNode = await NQEdge.getEdges({ target: nodeId });
    const edgesFromNode = await NQEdge.getEdges({ source: nodeId });
    // Archive all incoming edges.
    if (edgesToNode && edgesToNode.length > 0) {
      for (const edge of edgesToNode) {
        await NQEdge.updateEdge(edge._id, { isArchived: true });
      }
    }
    // Archive all outgoing edges.
    if (edgesFromNode && edgesFromNode.length > 0) {
      for (const edge of edgesFromNode) {
        await NQEdge.updateEdge(edge._id, { isArchived: true });
      }
    }
    // Archive the node itself.
    await NQNode.updateNode(nodeId, { isArchived: true });
    return args._id || null;
  } catch (error) {
    return error;
  }
};
