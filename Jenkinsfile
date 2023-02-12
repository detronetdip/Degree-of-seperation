pipeline{
  agent any
  stages{
    stage("permission"){
      steps{
        sh "chmod +x test.sh"
        sh "ls"
      }
    }
    stage("build"){
      steps{
        sh 'test.sh'
      }
    }
    stage("test"){
      steps{
        echo "running test"
      }
    }
  }
}
