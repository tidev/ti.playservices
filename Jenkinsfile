library 'pipeline-library@sdkURL'

buildModule {
	// Right now just point at a build of the SDK from the PR. I had to manually upload it to S3 to be able to point at it.
	// How can we better solve this chicken and egg problem in the future? Use a long-running feature branch of the SDK and publish the zips to s3?
	sdkVersion = '8.0.0.v20180425074403'
	sdkURL = 'https://s3.amazonaws.com/builds.appcelerator.com/mobile/custom/mobilesdk-8.0.0.v20180425074403-osx.zip'
	androidNDK = 'r16b'
}
