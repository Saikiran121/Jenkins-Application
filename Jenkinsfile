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
                                    --out ./dependency-check-report
                            """
                        }
                    }

                    post {
                        always {
                            dependencyCheckPublisher(
                                pattern: 'dependency-check-report/dependency-check-report.xml',
                                
                            )
                        }
                    }
                }
            }
        }
    }
}