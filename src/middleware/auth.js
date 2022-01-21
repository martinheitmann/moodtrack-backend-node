const admin = require("firebase-admin");
const User = require("../model/user/user");
const logger = require("../util/logger");

// These emails may be used for admin accounts.
const forbiddenUserEmails = ["moodtrackadmin@moodtrack.com"];

/**
 * Validates the argument ID token.
 * @param {*} idToken
 * @returns An object containing the users uid and claims.
 * @throws Error if the token is missing a uid, claims, if token is revoked or invalid.
 */
module.exports.validateToken = async function (idToken) {
  try {
    let checkRevoked = true;
    const payload = await admin.auth().verifyIdToken(idToken, checkRevoked);
    const uid = payload.uid;
    const claims = { role: payload.role };
    if (!uid) {
      throw new Error("Couldn't fetch a uid from the decoded token.");
    }
    if (!claims) {
      throw new Error("Claims missing from decoded token.");
    }
    return { uid: uid, claims: claims };
  } catch (error) {
    if (error.code == "auth/id-token-revoked") {
      // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
      throw new Error("Invalid token, sign-in required.");
    } else {
      const mError = new Error(
        "Token validation error: " + error.code + ": " + error.message
      );
      throw mError;
    }
  }
};

/**
 * Grants admin role to the user with argument uid.
 * @param {*} uid
 * @throws Error if the role can't be granted.
 */
module.exports.grantAdminRole = async function (uid) {
  try {
    admin.auth().setCustomUserClaims(uid, { role: "admin" });
  } catch (error) {
    throw new Error(`Couldn't grant admin role for user ${uid}: ${error}`);
  }
};

/**
 * Grants user role to the user with argument uid.
 * @param {*} uid
 * @throws Error if the role can't be granted.
 */
module.exports.grantUserRole = async function (uid) {
  try {
    admin.auth().setCustomUserClaims(uid, { role: "user" });
  } catch (error) {
    throw new Error(`Couldn't grant user role for user ${uid}: ${error}`);
  }
};

/**
 * Fetches the role for the argument email.
 * @param {*} email
 * @returns The role belonging to the argument email,
 * or error if the operation fails.
 */
module.exports.getRole = async function (email) {
  try {
    const user = admin.auth().getUserByEmail(email);
    if (user) {
      const role = user.customClaims["role"];
      if (role) return role;
      return null;
    }
  } catch (error) {
    return error;
  }
};

/**
 * Checks if the current user has ownership of the resouce. Executes the next()
 * function if the user request a resource which belongs to their uid.
 * Otherwise returns an error if the user uid does not mach the requested
 * resource owner uid.
 * @param {*} parent
 * @param {*} args
 * @param {*} context
 * @param {*} info
 * @param {*} next
 * @returns The result of the argument next() function, error otherwise.
 */
module.exports.requireOwnership = async function (
  uid,
  parent,
  args,
  context,
  info,
  next
) {
  try {
    if (process.env.NODE_ENV == "production") {
      if (!context.credentials.claims || !context.credentials.claims.role)
        return new Error(
          "Access to resource denied, no role attached to context."
        );
      if (context.credentials.claims.role === "admin") {
        return await next(parent, args, context, info);
      } else {
        if (!context.credentials.uid)
          return new Error(
            "Access to resource denied, no uid attached to context."
          );
        if (context.credentials.uid === uid) {
          return await next(parent, args, context, info);
        } else
          return new Error(
            "Access to resource denied, uid does not match the requested resource."
          );
      }
    }
    if (process.env.NODE_ENV == "development") {
      return next(parent, args, context, info);
    }
    return new Error(
      "An error occured during authentication and ownership verification."
    );
  } catch (error) {
    return error;
  }
};

/**
 * Checks if the current user is admin. Executes the next()
 * function if user is admin. Otherwise returns an error if the
 * user is not admin.
 * @param {*} parent
 * @param {*} args
 * @param {*} context
 * @param {*} info
 * @param {*} next
 * @returns The result of the argument next() function, error otherwise.
 */
module.exports.requireAdmin = async function (
  parent,
  args,
  context,
  info,
  next
) {
  try {
    if (process.env.NODE_ENV == "production") {
      console.log(JSON.stringify(context));
      if (!context.credentials.claims || !context.credentials.claims.role)
        return new Error(
          "Access to resource denied, no role attached to context."
        );
      if (context.credentials.claims.role === "admin")
        return await next(parent, args, context, info);
      return new Error("Access to resource denied, admin role required.");
    } else return await next(parent, args, context, info);
  } catch (error) {
    logger.log({ level: "error", message: error });
    return error;
  }
};

/**
 * Checks if the current user is authenticated. Executes the next()
 * function if authenticated. Otherwise returns an error if the
 * user is not authenticated.
 * @param {*} parent
 * @param {*} args
 * @param {*} context
 * @param {*} info
 * @param {*} next
 * @returns The result of the argument next() function, error otherwise.
 */
module.exports.requireAuthentication = async function (
  parent,
  args,
  context,
  info,
  next
) {
  try {
    if (process.env.NODE_ENV == "production") {
      if (!context.credentials.claims || !context.credentials.claims.role)
        return new Error("Access to resource denied, no role attached.");
      if (
        context.credentials.claims.role === "user" ||
        context.credentials.claims.role === "admin"
      )
        return await next(parent, args, context, info);
      return new Error("Access to resource denied, admin role required.");
    } else {
      return await next(parent, args, context, info);
    }
  } catch (error) {
    logger.log({ level: "error", message: error });
    return error;
  }
};

/**
 * Register a new user in the database and auth system.
 * @param {*} args argument for the newuser.
 * @param args.email email for the new user.
 * @param args.password password for the new user.
 * @returns the new user if successful, error otherwise.
 */
module.exports.registerNewUser = async function (args) {
  try {
    if (!args.email || !args.password)
      return new Error(
        "Both a valid email and password is required for registration."
      );

    if (forbiddenUserEmails.includes(args.email))
      return new Error("Cannot register a user with the provided email.");

    // Attempt to register a new user
    const userRecord = await admin.auth().createUser({
      email: args.email,
      password: args.password,
    });

    if (userRecord) {
      // Registration succeeded
      const customClaims = { role: "user" };
      await admin.auth().setCustomUserClaims(userRecord.uid, customClaims);

      const newUser = {
        _id: userRecord.uid,
        fcmRegistrationToken: null,
        creationDate: new Date(),
        notificationsEnabled: true,
        email: args.email,
      };
      const insertedUser = await User.createUser(newUser);
      return insertedUser;
    }
  } catch (error) {
    // Since either the database insertion or the admin SDK may fail,
    // we have to consider both cases. The most likely case is
    // successful registration with the admin SDK and a database failure,
    // meaning we should remove the firebase user in case of a failure
    console.log(error);
    if (error.code == "auth/email-already-exists") {
      return new Error("The provided e-mail already exists");
    } else if (error.code == "auth/invalid-email") {
      return new Error("The provided e-mail is invalid");
    } else return error;
  }
};

/**
 * Fetches all users for the current firebase project.
 * @returns A list of all available firebase auth user records for the project.
 */
module.exports.getAllUsers = async function () {
  try {
    let allUsers = [];
    let nextPageToken;
    let hasMore = true;
    while (hasMore) {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      const users = listUsersResult.users.map((user) => {
        let userRole = "none";
        if (user.customClaims) {
          if (user.customClaims.role) {
            userRole = user.customClaims.role;
          }
        }
        return {
          uid: user.uid,
          email: user.email,
          role: userRole,
        };
      });
      allUsers = allUsers.concat(users);
      nextPageToken = listUsersResult.pageToken;
      if (!listUsersResult.pageToken) {
        hasMore = false;
      }
    }
    return allUsers;
  } catch (error) {
    logger.log({ level: "error", message: error });
    return error;
  }
};

/**
 * Fetches the user record from firebase auth by email.
 * @param {*} email
 * @returns a user record representing the firebase auth user.
 */
module.exports.getAuthUserByEmail = async function (email) {
  const user = await admin.auth().getUserByEmail(email);
  if (user) return user;
  else
    throw new Error(
      "call to getUserByEmail in method getAuthUserByEmail returned null"
    );
};

/**
 * Fetches the user record from firebase auth by uid.
 * @param {*} email
 * @returns a user record representing the firebase auth user.
 */
module.exports.getAuthUserByUid = async function (uid) {
  let userRole = "none";
  const user = await admin.auth().getUser(uid);
  if (user) {
    if (user.customClaims) {
      if (user.customClaims.role) {
        userRole = user.customClaims.role;
      }
    }
    return {
      uid: user.uid,
      email: user.email,
      role: userRole,
    };
  }
  return null;
};

/**
 * Attempts to delete a user.
 * @param {*} uid
 */
module.exports.deleteAuthUser = async function (uid) {
  await admin.auth().deleteUser(uid);
};

/**
 * Creates a new user in the auth system.
 * @param args user args.
 * @param args.email user email.
 * @param args.password user password.
 * @returns nothing.
 * @throws error if user already exists or credentials are invalid.
 */
module.exports.createAuthUser = async function (args) {
  return await admin.auth().createUser({
    email: args.email,
    password: args.password,
  });
};

module.exports.deleteUserFromDbAndAuth = async function (uid) {
  try {
    console.log("deleteUserFromDbAndAuth uid: " + uid);
    const userFromDb = await User.findUserById(uid);
    const authUser = await admin.auth().getUser(uid);
    if (userFromDb && authUser) {
      await User.deleteUser({ _id: uid });
      await admin.auth().deleteUser(uid);
      return true;
    } else {
      throw new Error("Either database or FB Auth user could not be found.");
    }
  } catch (error) {
    logger.log({ level: "error", message: error });
    return error;
  }
};

module.exports.recreateUsersFromAuth = async function () {
  let userCreationCount = 0;
  const allUsers = await User.findUsers();
  const allAuthUsers = await module.exports.getAllUsers();
  for (const authUser of allAuthUsers) {
    if (
      !allUsers.find((user) => user._id === authUser.uid) &&
      authUser.email !== "moodtrackadmin@moodtrack.com"
    ) {
      const restoredUser = {
        _id: authUser.uid,
        fcmRegistrationToken: null,
        creationDate: new Date(),
        notificationsEnabled: true,
        email: authUser.email,
      };
      await User.createUser(restoredUser);
      userCreationCount++;
    }
  }
  return userCreationCount;
};
