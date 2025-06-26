@Library('jenkins-shared-library@main') _

singleImageBuild(
    repo: 'https://github.com/petedillo/ollama-chat-api',
    registry: 'diolab:5000',
    host: 'serverpi',
    sshCreds: 'jenkins-petedillo',
    composePath: '/home/pete/services/ollama/compose.yaml',
    imageName: 'ollama-backend',
    branch: 'main',
    contextPath: '.',
    platform: 'linux/arm64',
    push: true
)