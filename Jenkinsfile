pipeline {
    agent any

    environment {
        REGISTRY = 'ghcr.io'
        // Change to your GitHub repository owner and name
        IMAGE_NAME = 'ralliyahrushdahep/devops/omni-backend'
        AWS_REGION = 'us-west-2'
        EKS_CLUSTER_NAME = 'omni-civilization-cluster'
    }

    stages {
        stage('Git Pull') {
            steps {
                // Updates from local repository pull
                checkout scm
            }
        }

        stage('Login to GHCR') {
            steps {
                // Assumes a Jenkins Username/Password credential with ID 'github-token' exists
                // where the password is the GitHub Personal Access Token (PAT)
                withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
                    sh 'echo ${GH_TOKEN} | docker login ${REGISTRY} -u ${GH_USER} --password-stdin'
                }
            }
        }

        stage('Build & Push') {
            steps {
                // Build and tag image with both 'latest' and build number
                sh "docker build -t ${REGISTRY}/${IMAGE_NAME}:latest -t ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} -f backend/Dockerfile backend/"
                sh "docker push ${REGISTRY}/${IMAGE_NAME}:latest"
                sh "docker push ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"
            }
        }

        stage('Configure AWS & EKS') {
            steps {
                // Updates kubeconfig for EKS. Assumes Jenkins runner has AWS credentials configured
                sh "aws eks update-kubeconfig --name ${EKS_CLUSTER_NAME} --region ${AWS_REGION}"
            }
        }

        stage('Create Pull Secret') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
                    sh """
                    kubectl create secret docker-registry github-registry-secret \
                      --docker-server=${REGISTRY} \
                      --docker-username=${GH_USER} \
                      --docker-password=${GH_TOKEN} \
                      --namespace=omnicivilization \
                      --dry-run=client -o yaml | kubectl apply -f -
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                // Replace image placeholder with the built build-number tag and deploy
                sh "sed -i 's|image: ghcr.io/ralliyahrushdahep/devops/omni-backend:latest|image: ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}|g' kubernetes/deployment.yaml"
                sh 'kubectl apply -f kubernetes/'
            }
        }
    }
}
