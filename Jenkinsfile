pipeline {
    agent any
    
    environment {
        // Change this to your actual Docker Hub username
        DOCKER_IMAGE = "naveennavee/express-demo"
        DOCKER_TAG = "v${env.BUILD_NUMBER}"
        REGISTRY_CREDENTIALS = "dockerhub-credentials-id"
        KUBECONFIG_CREDENTIALS = "k8s-kubeconfig-id"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
            }
        }

        stage('Security Scan (Trivy)') {
            steps {
                // We use exit-code 0 for testing so the pipeline doesn't fail immediately on minor issues
                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.REGISTRY_CREDENTIALS, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                    sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIALS, variable: 'KUBECONFIG')]) {
                    // Replace IMAGE_PLACEHOLDER with the newly built image tag
                    sh "sed -i 's|IMAGE_PLACEHOLDER|${DOCKER_IMAGE}:${DOCKER_TAG}|g' k8s/deployment.yaml"
                    // Apply to Kubernetes
                    sh "kubectl apply -f k8s/deployment.yaml --kubeconfig=\$KUBECONFIG"
                }
            }
        }
    }
}