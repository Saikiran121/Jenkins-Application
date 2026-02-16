pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm packages...'
                sh 'npm install'
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo 'Running tests with Mocha...'
                sh 'npm test'
            }
            post {
                always {
                    junit 'test-results.xml'
                }
            }
        }

        stage('Code Coverage') {
            steps {
                echo 'Generating coverage reports...'
                sh 'npm run coverage'
            }
            post {
                success {
                    publishHTML([
                        allowMissing: false, 
                        alwaysLinkToLastBuild: true, 
                        keepAll: true, 
                        reportDir: 'coverage', 
                        reportFiles: 'index.html', 
                        reportName: 'Code Coverage Report'
                    ])
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'package.json, app.js, public/**', fingerprint: true
            }
        }
    }

    post {
        success {
            emailext (
                attachLog: true, 
                body: '$DEFAULT_CONTENT', 
                replyTo: 'saikiranbiradar76642@gmail.com', 
                subject: '✅ Node Build Success: ${env.JOB_NAME} [${env.BUILD_NUMBER}]', 
                to: '$DEFAULT_RECIPIENTS'
            )
        }
        failure {
            emailext (
                attachLog: true, 
                body: '$DEFAULT_CONTENT', 
                replyTo: 'saikiranbiradar76642@gmail.com', 
                subject: '❌ Node Build Failed: ${env.JOB_NAME} [${env.BUILD_NUMBER}]', 
                to: '$DEFAULT_RECIPIENTS'
            )
        }
    }
}
