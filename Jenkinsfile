pipeline{
  agent any
  stages{
    stage("build"){
      steps{
        sh './test.sh'
      }
    }
    stage("test"){
      steps{
        echo "running test"
      }
    }
  }
}
