pipeline{

    agent any
    tools {
        nodejs 'node'
    }

    environment{
        gitCredentials = credentials('svc_hudson')
        CI=true
    }

    stages{
        stage('checkout'){
            steps{
                slackSend (color: '#FFFF00', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
                checkout scm
            }
        }

        stage('Install'){
            steps {
                sh 'npm install'
            }
        }

        stage('Test'){
            steps {
                sh 'npm test -- --coverage'
                
                sonar("tori_validator", "Tori Validator")
            }
        }

        stage("Make Release Tag"){
            when{
                expression {env.BRANCH_NAME == 'master'}
            }
            steps{
                sh 'git remote set-url origin ssh://git@bitbucket.tomtomgroup.com:7999/fusion/tori-validator.git'
                sh 'npm version patch'
                sh 'git add package.json'
                sh 'git add package-lock.json'
                sh 'git push --follow-tags origin HEAD:master'
            }
        }

        stage('Build'){
            steps{
                sh 'npm run-script build:prod'
            }
        }

        stage("Docker configuration") {
            steps{
                sh 'aws ecr get-login --no-include-email --region eu-west-1  | xargs xargs'
            }
        }
        
        stage ("Get Version Number"){
            steps{
                script{
                    version = sh(
                        returnStdout: true,
                        script : "npm run version --silent"
                    )
                    version = sh(
                        returnStdout: true,
                        script: "echo '${version}' | tr -d '\n'"
                    )
                }
            }
        }

       stage("Build Image"){
            steps{
                sh "docker build --no-cache . -t  tori-validator:$version"
            }
       }


        stage("Push Image"){
            when{
                expression {env.BRANCH_NAME == 'master'}
            }
             steps{
                 script{
                    sh "docker tag tori-validator:$version 765752621842.dkr.ecr.eu-west-1.amazonaws.com/tori-validator:$version"
                    sh "docker push 765752621842.dkr.ecr.eu-west-1.amazonaws.com/tori-validator:$version"
                 }
            }
        }
    }
    post{
        always{
            script{
                currentBuild.result = currentBuild.result?: 'SUCCESS'
            }
        }
        success{
            slackSend (color: '#00FF00', message: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
        failure{
            slackSend (color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
    }
}

def sonar(projectKey, projectName) {
    script {
        if (env.CHANGE_BRANCH) {
            sh """#!/bin/bash
                sonar-scanner -Dsonar.host.url=http://qteam-sonar.maps-pu-core-dev.amiefarm.com \
                    -Dsonar.exclusions=src/__tests__/** \
                    -Dsonar.sources=src \
                    -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info \
                    -Dsonar.projectKey=${projectKey} -Dsonar.projectName="${projectName}" -Dsonar.branch=${CHANGE_BRANCH}
            sh """
        } else if (env.BRANCH_NAME == "master") {
            sh """#!/bin/bash
                sonar-scanner -Dsonar.host.url=http://qteam-sonar.maps-pu-core-dev.amiefarm.com \
                    -Dsonar.exclusions=src/__tests__/** \
                    -Dsonar.sources=src \
                    -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info \
                    -Dsonar.projectKey=${projectKey} -Dsonar.projectName="${projectName}"
            sh """
        } else {
            sh """#!/bin/bash
                sonar-scanner -Dsonar.host.url=http://qteam-sonar.maps-pu-core-dev.amiefarm.com \
                    -Dsonar.exclusions=src/__tests__/** \
                    -Dsonar.sources=src \
                    -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info \
                    -Dsonar.projectKey=${projectKey} -Dsonar.projectName="${projectName}" -Dsonar.branch=${BRANCH_NAME}
            """
        }
    }
}