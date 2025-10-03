pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/YOUR-USERNAME/jenkins-sample-app.git'
            }
        }
        stage('Build') {
            steps {
                echo "Building project..."
            }
        }
        stage('Test') {
            steps {
                echo "Running tests (placeholder, since this is static HTML)"
            }
        }
        stage('Deploy to Staging') {
            steps {
                sh 'mkdir -p /var/www/staging'
                sh 'cp -r * /var/www/staging/'
                echo "App deployed to Staging!"
            }
        }
    }
}
