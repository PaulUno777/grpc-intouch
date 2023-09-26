pipeline {
  agent any
  stages {
    stage('Checkout commit') {
      steps {
        git(url: 'https://github.com/PaulUno777/grpc-intouch.git', branch: 'main', credentialsId: 'paulin_github')
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

          steps {
            withCredentials([usernamePassword(credentialsId: 'paulin_docker', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]){
              sh 'docker login -u $USERNAME -p $PASSWORD'
            }
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