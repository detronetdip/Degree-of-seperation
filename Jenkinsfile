pipeline{
  agent any
  stages{
    stage("build"){
      steps{
        sh 'npm install'
        sh 'npm run build'
      }
    }
    stage("test"){
      steps{
        echo "running test"
      }
    }
  }
}
