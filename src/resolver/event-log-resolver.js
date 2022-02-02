const EventLog = require("../model/event-log/event-log");
const Auth = require("../middleware/auth");

module.exports.eventLogResolvers = {
  Query: {
    eventLog(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveEventLog);
    },
    eventLogs(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveEventLogs);
    },
  },
  Mutation: {
    createEventLog(parent, args, context, info) {
      return Auth.requireOwnership(
        args._id || undefined,
        parent,
        args,
        context,
        info,
        resolveCreateEventLog
      );
    },
    modifyEventLog(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveModifyEventLog
      );
    },
    deleteEventLog(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveDeleteEventLog
      );
    },
  },
};

const resolveEventLog = async function (parent, args, context, info) {
  try {
    return await EventLog.findEventLogById(args._id || undefined);
  } catch (error) {
    return error;
  }
};

const resolveEventLogs = async function (parent, args, context, info) {
  try {
    return await EventLog.findEventLogs(args);
  } catch (error) {
    return error;
  }
};

const resolveCreateEventLog = async function (parent, args, context, info) {
  try {
    return await EventLog.createEventLog(args.eventLog);
  } catch (error) {
    return error;
  }
};

const resolveModifyEventLog = async function (parent, args, context, info) {
  try {
    return await EventLog.updateEventLog(args._id, args.eventLog);
  } catch (error) {
    return error;
  }
};

const resolveDeleteEventLog = async function (parent, args, context, info) {
  try {
    return await EventLog.deleteEventLog(args);
  } catch (error) {
    return error;
  }
};
