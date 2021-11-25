pipeline {
    agent any
    
    tools {nodejs "NodeJS 12.18.4"}
    
    environment {
        DEPLOYMENT_TYPE="${params.DEPLOYMENT_TYPE}"
        DEPLOYMENT_PROJECT_ID="${params.DEPLOYMENT_PROJECT_ID}"
        DEPLOYMENT_PRIVATE_KEY_ID="${params.DEPLOYMENT_PRIVATE_KEY_ID}"
        DEPLOYMENT_PRIVATE_KEY="${params.DEPLOYMENT_PRIVATE_KEY}"
        DEPLOYMENT_CLIENT_EMAIL="${params.DEPLOYMENT_CLIENT_EMAIL}"
        DEPLOYMENT_CLIENT_ID="${params.DEPLOYMENT_CLIENT_ID}"
        DEPLOYMENT_AUTH_URI="${params.DEPLOYMENT_AUTH_URI}"
        DEPLOYMENT_TOKEN_URI="${params.DEPLOYMENT_TOKEN_URI}"
        DEPLOYMENT_AUTH_PROVIDER_X509_CERT_URL="${params.DEPLOYMENT_AUTH_PROVIDER_X509_CERT_URL}"
        DEPLOYMENT_CLIENT_X509_CERT_URL="${params.DEPLOYMENT_CLIENT_X509_CERT_URL}"
    }

    stages {
        stage('Build') { 
            steps {
                sh "npm install --verbose" 
            }
        }
        stage('Deploy'){
           steps {
               sh "sudo rm -rf ecosystem.config.js"
               sh "sudo cp /var/www/pm2-config/ecosystem.config.js ."
               sh "sudo pm2 delete ecosystem.config.js || :"
               sh "sudo pm2 start ecosystem.config.js"
           }
        }
    }
}