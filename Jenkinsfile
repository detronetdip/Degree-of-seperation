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
        sh 'bash test.sh'
      }
    }
    stage("test"){
      steps{
        echo "running test"
      }
    }
  }
}
