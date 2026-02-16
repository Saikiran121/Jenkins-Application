pipeline {
    agent any 

    tools {
        nodejs 'nodejs-24-13-0'
    }

    stages {
        stage('Check Node version') {
            steps {
                echo 'Checking the node version....'
                sh 'node --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install --no-audit'
            }
        }
    }
}