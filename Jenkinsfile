pipeline {
  agent any
  stages {
    stage('Checkout commit') {
      steps {
        git(url: 'https://github.com/PaulUno777/grpc-intouch.git', branch: 'master', credentialsId: 'paulin_github')
      }
    }

    stage('Copy environment file'){
      steps {
        withCredentials([file(credentialsId: 'grpc_intouch', variable: 'env-file')]) {
            sh "cp \$env-file ./.env"
        }
      }
    }

    stage('Log projet contain') {
      steps {
        sh ''' ls -la'''
      }
    }

    stage('Build app') {
      parallel {
        stage('Build app') {
          steps {
            sh 'docker build -t unoteck/kmx-compliance-service .'
          }
        }

        stage('Log into Dockerhub') {
          environment {
            docker_credentials = credentials('paulin_docker')
            DOCKER_USER = docker_credentials.username
            DOCKER_PASSWORD = docker_credentials.password
          }
          steps {
            sh 'docker login -u $DOCKER_USER -p $DOCKER_PASSWORD'
          }
        }

      }
    }

    stage('Deploy app') {
      steps {
        sh 'docker push unoteck/kmx-intouch-grpc:latest'
      }
    }

    stage('start app') {
      steps {
        sh 'docker rm --force --volumes kmx-intouch-grpc'
        sh '''docker compose up --wait
'''
      }
    }

    stage('Get app Log') {
      steps {
        sh 'docker container logs kmx-compliance-service'
      }
    }

  }
}