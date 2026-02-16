pipeline {
    agent any 

    tools {
        nodejs 'nodejs-24-13-0'
    }

    environment {
        // IDs must match what you create in Jenkins -> Credentials
        MONGO_HOST = 'localhost:27017' 
        //MONGO_DB   = 'deepsea'
        MONGO_DB_CREDS = credentials('mongo-db-credentials')
        MONGO_USER = credentials('mongo-db-username')
        MONGO_PASS = credentials('mongo-db-password')
        SONAR_SCANNER_HOME = tool 'sonarqube-scanner-801';
    }


    options {
        disableResume()
        disableConcurrentBuilds abortPrevious: true 
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

        stage('Dependency Scanning') {
            parallel {

                stage('NPM Dependency Audit') {
                    steps {
                        sh 'npm audit --audit-level=high'
                    }
                }

                stage('OWASP Dependency Check') {
                    steps {
                        withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_KEY')]) {
                            sh """
                                ${tool 'OWASP-DepCheck-12'}/bin/dependency-check.sh \
                                    --scan . \
                                    --format ALL \
                                    --project "Jenkins-Application" \
                                    --nvdApiKey \$NVD_KEY \\
                                    --disableYarnAudit \
                                    --failOnCVSS 7 \
                                    --suppression dependency-check-suppressions.xml \
                                    --out ./dependency-check-report
                            """
                        }
                    }

                    post {
                        always {
                            dependencyCheckPublisher(
                                pattern: 'dependency-check-report/dependency-check-report.xml',
                                
                            )

                            junit allowEmptyResults: true, keepProperties: true, testResults: 'dependency-check-report/dependency-check-junit.xml'
                            publishHTML([
                                allowMissing: true, 
                                alwaysLinkToLastBuild: true, 
                                icon: '', 
                                keepAll: true, 
                                reportDir: 'dependency-check-report', 
                                reportFiles: 'dependency-check-report.html', 
                                reportName: 'Dependency Check HTML Report'
                            ])
                        }
                    }
                }
            }
        }

        stage('Unit Testing') {
            steps {
                sh 'npm test'
            }

            post {
                always {
                    junit allowEmptyResults: true, keepProperties: true, testResults: 'dependency-check-report/test-results.xml'
                }
            }
        }

        stage('Code Coverage') {
            steps {
                catchError(buildResult: 'SUCCESS', message: 'It will be fixed in future releases', stageResult: 'UNSTABLE') {
                    sh 'npm run coverage'
                }
            }

            post {
                always {
                    publishHTML([
                        allowMissing: true, 
                        alwaysLinkToLastBuild: true, 
                        icon: '', 
                        keepAll: true, 
                        reportDir: 'coverage/lcov-report', 
                        reportFiles: 'index.html', 
                        reportName: 'Code Coverage HTML Report'
                    ])
                }
            }
        }


        stage('SAST - SonarQube') {
            steps {
                sh 'echo $SONAR_SCANNER_HOME'
                sh '''
                    $SONAR_SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectKey=Jenkins-Application-Project \
                        -Dsonar.sources=app.js \
                        -Dsonar.host.url=http://localhost:9000 \
                        -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info \
                        -Dsonar.token=sqp_da195eae3aafa6e850e347ed90f21a9743e1923e
                '''

                //AS WEBHOOK IS NOT CONFIGURED DUE TTO LOCALHOST COMMENTING BELOW LINE
                //waitForQualityGate abortPipeline: true

            }
        }

        stage('Docker Build Image') {
            steps {
                sh 'printenv'
                sh 'docker build -t saikiran8050/jenkins-application:$GIT_COMMIT .'
            }
        }
    }
}