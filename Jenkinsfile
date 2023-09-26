pipeline {
  agent any
  stages {
    stage('Checkout commit') {
      steps {
        git(url: 'https://github.com/PaulUno777/grpc-intouch.git', branch: 'master', credentialsId: 'paulin_github')
      }
    }

  }
}