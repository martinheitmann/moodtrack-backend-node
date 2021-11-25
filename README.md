# Moodtrack Backend

MoodTrack Backend is the server-side component which enables the delivery of notifications and collection of data from the front-end client. The project is based off of Apollo Server and Express using GraphQL, and uses MongoDB as the database.

## Installation
Before starting the server, a [Firebase](https://firebase.google.com/) project is required for Firebase Cloud Messaging functionality as well as Firebase Authentication features. Credentials should be provided in a ```.env``` file:
````
ENABLE_TICK=false
TICKER_TIMEZONE=
DATABASE_NAME=
DEFAULT_ADMIN_PASS=
DEFAULT_ADMIN_USERNAME=

DEV_TYPE=
DEV_PROJECT_ID=
DEV_PRIVATE_KEY_ID=
DEV_PRIVATE_KEY=
DEV_CLIENT_EMAIL=
DEV_CLIENT_ID=
DEV_AUTH_URI=
DEV_TOKEN_URI=
DEV_AUTH_PROVIDER_X509_CERT_URL=
DEV_CLIENT_X509_CERT_URL=
````

In order to start the server in development mode, run the ```nodemon``` command in the project root. The server will then start in ```development``` mode at ```http://localhost:4000``` by default. In development mode, GraphiQL is available at ```/graphql```. 

## Manual Deployment
The server can be manually deployed by providing a ```.env``` file containing the deployment credentials which will be used in ```production``` mode: 
````
DEPLOYMENT_TYPE=
DEPLOYMENT_PROJECT_ID=
DEPLOYMENT_PRIVATE_KEY_ID=
DEPLOYMENT_PRIVATE_KEY=
DEPLOYMENT_CLIENT_EMAIL=
DEPLOYMENT_CLIENT_ID=
DEPLOYMENT_AUTH_URI=
DEPLOYMENT_TOKEN_URI=
DEPLOYMENT_AUTH_PROVIDER_X509_CERT_URL=
DEPLOYMENT_CLIENT_X509_CERT_URL=
````

## CD With Jenkins
Deployment can be done via Jenkins using a [PM2 ecosystem file](https://pm2.keymetrics.io/docs/usage/application-declaration/) with the provided Jenkinsfile. Ensure that the credentials are availbale within the ecosystem file and copy it into the working directory.
