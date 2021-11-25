const Auth = require("./middleware/auth");
const logger = require("./util/logger");

/**
 * Seeds the database with an admin user for
 * the front-end control panel.
 */
module.exports.seedDatabase = async function () {
  const amdinPass = process.env.DEFAULT_ADMIN_PASS;
  const adminEmail = process.env.DEFAULT_ADMIN_USERNAME;

  if (amdinPass && adminEmail) {
    const email = adminEmail;
    const password = amdinPass;
    Auth.getAuthUserByEmail(email)
      .then((userRecord) => {
        // User exists
        logger.log({
          level: "verbose",
          message: "Admin user found, checking admin privileges.",
        });
        const claims = userRecord.customClaims;
        if (claims && claims.role) {
          if (claims.role !== "admin") {
            logger.log({
              level: "verbose",
              message: "Fetched user was not admin.",
            });
            // If for some reason the user isn't admin.
            Auth.grantAdminRole(userRecord.uid)
              .then(() => {
                logger.log({
                  level: "verbose",
                  message: "Admin role was granted.",
                });
              })
              .catch((error) => {
                logger.log({
                  level: "verbose",
                  message: "Admin role grant failed with error: " + error,
                });
              });
          } else if (claims.role === "admin") {
            logger.log({
              level: "verbose",
              message: "Fetched admin user has admin role, resuming.",
            });
          } else {
            logger.log({
              level: "verbose",
              message: "Error checking admin user claims.",
            });
          }
        } else {
          logger.log({
            level: "verbose",
            message: "Admin user claims were not found, setting admin role.",
          });
          Auth.grantAdminRole(userRecord.uid)
            .then(() => {
              logger.log({
                level: "verbose",
                message: "Admin role was granted.",
              });
            })
            .catch((error) => {
              logger.log({
                level: "verbose",
                message: "Admin role grant failed with error: " + error,
              });
            });
        }
      })
      .catch((error) => {
        if (error.code && error.code === "auth/user-not-found") {
          Auth.createAuthUser({ email: email, password: password })
            .then((user) => {
              logger.log({
                level: "verbose",
                message: "Admin user created.",
              });
              return user;
            })
            .then((user) => {
              Auth.grantAdminRole(user.uid)
                .then(() => {
                  logger.log({
                    level: "verbose",
                    message: "Admin role was granted.",
                  });
                })
                .catch((error) => {
                  logger.log({
                    level: "verbose",
                    message: "Admin role grant failed with error: " + error,
                  });
                });
            })
            .catch((error) => {
              logger.log({
                level: "verbose",
                message: "Admin user creation failed: " + error,
              });
            });
        } else {
          logger.log({
            level: "verbose",
            message: "Firebase auth error: " + error.code,
          });
        }
      });
  }
};
