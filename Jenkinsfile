pipeline {
    agent any
    tools {
        jdk 'jdk17'
        nodejs 'node16'
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }
    stages {
        stage('Clean workspace') { steps { cleanWs() } }
        stage('Checkout') { steps { git branch: 'main', url: 'https://github.com/sarika-03/TaskFlow.git' } }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh '''$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=StreamHub -Dsonar.projectKey=StreamHub'''
                }
            }
        }
        stage('Quality Gate') {
            steps { script { waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token' } }
        }
        stage('Install Dependencies') { steps { sh 'npm install' } }
        stage('OWASP Dependency-Check') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage('Trivy FS Scan') { steps { sh 'trivy fs . > trivyfs.txt || true' } }
        stage('Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', url: '') {
                        sh 'docker build -t taskflow .'
                        sh 'docker tag taskflow sarika1731/taskflow:latest'
                        sh 'docker push sarika1731/taskflow:latest'
                    }
                }
            }
        }
        stage('Trivy Image Scan') { steps { sh 'trivy image sarika1731/taskflow:latest > trivyimage.txt || true' } }
        stage('Deploy Container') { steps { sh "docker run -d --name streamhub -p 3000:3000 sarika1731/taskflow:latest || true" } }
    }
    post {
        always {
            emailext attachLog: true,
                subject: "'${currentBuild.result}'",
                body: "Project: ${env.JOB_NAME}<br/>Build Number: ${env.BUILD_NUMBER}<br/>URL: ${env.BUILD_URL}<br/>",
                to: 'sarikasharma9711@gmail.com',
                attachmentsPattern: 'trivyfs.txt,trivyimage.txt'
        }
    }
}
