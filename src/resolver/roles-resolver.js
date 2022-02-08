const Auth = require("../middleware/auth");
const logger = require("../util/logger");

const tag = "roles-resolver: ";

module.exports.rolesResolvers = {
  Query: {
    roles(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveRoles);
    },
    role(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveRole);
    },
    testAdmin(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveTestAdmin);
    },
    testUser(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveTestUser
      );
    },
  },
  Mutation: {
    grantRole(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveGrantRole);
    },
  },
};

const resolveRoles = async function (parent, args, context, info) {
  try {
    return await Auth.getAllUsers();
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveRole = async function (parent, args, context, info) {
  try {
    const uid = args.uid;
    return await Auth.getAuthUserByUid(uid);
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveGrantRole = async function (parent, args, context, info) {
  try {
    const role = args.role;
    const uid = args.uid;
    if (role !== "user" && role !== "admin") {
      return new Error("Cannot grant an invalid role.");
    } else {
      if (role === "user") {
        await Auth.grantUserRole(uid);
      } else if (role === "admin") {
        await Auth.grantAdminRole(uid);
      }
      return await Auth.getAuthUserByUid(uid);
    }
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveTestUser = async function (parent, args, context, info) {
  return "If you can read this, that means you're successfully authenticated as a user.";
};

const resolveTestAdmin = async function (parent, args, context, info) {
  return "If you can read this, that means you're successfully authenticated as an admin.";
};
