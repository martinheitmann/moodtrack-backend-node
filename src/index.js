require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress } = require("graphql-upload");
const logger = require("./util/logger");
const moment = require("moment-timezone");

const app = express();

const mongoose = require("mongoose");
const admin = require("firebase-admin");
const auth = require("./middleware/auth");
const seed = require("./seed");
const notif = require("./push/notification-job");

const schema = require("./typedefs/schema");

let credentialsToUse;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  logger.log({
    level: "info",
    message: "Server is in development mode, using dev credentials.",
  });
  credentialsToUse = {
    type: process.env.DEV_TYPE,
    project_id: process.env.DEV_PROJECT_ID,
    private_key_id: process.env.DEV_PRIVATE_KEY_ID,
    private_key: process.env.DEV_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.DEV_CLIENT_EMAIL,
    client_id: process.env.DEV_CLIENT_ID,
    auth_uri: process.env.DEV_AUTH_URI,
    token_uri: process.env.DEV_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.DEV_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.DEV_CLIENT_X509_CERT_URL,
  };
} else if (process.env.NODE_ENV === "production") {
  logger.log({
    level: "info",
    message: "Server is in deployment mode, using production credentials.",
  });
  credentialsToUse = {
    type: process.env.DEPLOYMENT_TYPE,
    project_id: process.env.DEPLOYMENT_PROJECT_ID,
    private_key_id: process.env.DEPLOYMENT_PRIVATE_KEY_ID,
    private_key: process.env.DEPLOYMENT_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.DEPLOYMENT_CLIENT_EMAIL,
    client_id: process.env.DEPLOYMENT_CLIENT_ID,
    auth_uri: process.env.DEPLOYMENT_AUTH_URI,
    token_uri: process.env.DEPLOYMENT_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.DEPLOYMENT_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.DEPLOYMENT_CLIENT_X509_CERT_URL,
  };
}
admin.initializeApp({
  credential: admin.credential.cert(credentialsToUse),
});

const server = new ApolloServer({
  uploads: false,
  schema: schema,
  context: async ({ req }) => {
    if (process.env.NODE_ENV == "production") {
      try {
        // Get the user token from the headers.
        const token = req.headers.authorization || "";

        // try to validate the token and extract uid and claims
        const requestCredentials = await auth.validateToken(token);

        // add the user to the context
        return { credentials: requestCredentials };
      } catch (error) {
        console.log(error);
        return { credentials: null };
      }
    }
  },
});

app.use(graphqlUploadExpress());
server.applyMiddleware({ app });

const replicaConnection = "?replicaSet=rs0";
const databaseConnection = `mongodb://localhost:27017/${process.env.DATABASE_NAME}${replicaConnection}`;
const port = 4000;

app.listen({ port: port }, () => {
  const timeZone = process.env.TICKER_TIMEZONE || "Europe/Oslo";
  const zoneObject = moment(new Date()).tz(timeZone);
  logger.log({
    level: "info",
    message: `🚀 Server starting in ${process.env.NODE_ENV} mode at http://localhost:4000${server.graphqlPath}.`,
  });
  logger.log({
    level: "info",
    message: `🕒 Ticker time is ${zoneObject.format()}(${timeZone}) with a offset of ${zoneObject.utcOffset()} minutes.`,
  });
  mongoose
    .connect(databaseConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      logger.log({
        level: "info",
        message: `💾 Mongoose connected to ${databaseConnection}`,
      });
      seed.seedDatabase();
      if (process.env.ENABLE_TICK === "true") {
        logger.log({ level: "info", message: "Server ticks are enabled." });
        notif.startPushNotificationJob("* * * * *");
      } else {
        logger.log({ level: "info", message: "Server ticks are disabled." });
      }
    })
    .catch((error) => {
      logger.log({ level: "error", message: error });
    });
});
