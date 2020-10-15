#!groovy
library 'pipeline-library'

def isMaster = env.BRANCH_NAME.equals('master')

buildModule {
	sdkVersion = '9.3.0.v20201008042500' // TODO: Change to 9.3.0.GA once released
	npmPublish = isMaster
}
