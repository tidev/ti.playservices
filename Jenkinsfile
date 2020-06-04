#!groovy
library 'pipeline-library'

def isMaster = env.BRANCH_NAME.equals('master')

buildModule {
	sdkVersion = '9.1.0.v20200603062635' // TODO: Change to 9.1.0.GA once released
	npmPublish = isMaster
}
