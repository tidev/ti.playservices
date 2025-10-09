var PlayServices = require('ti.playservices'),
	playServicesResult = PlayServices.isGooglePlayServicesAvailable(),
	playServicesVersion = PlayServices.GOOGLE_PLAY_SERVICES_VERSION_CODE;

if (playServicesResult == PlayServices.RESULT_SUCCESS) {
	alert('Google Play Services: ' + playServicesVersion);
} else {
	alert('Google Play Services: ' + PlayServices.getErrorString(playServicesResult));
}

PlayServices.addEventListener("ageVerification", function(e){
	console.log("success", e.success);
	if (e.success) {
		console.log("installId", e.installId);
		console.log("verified", e.verified);
	}
})

PlayServices.requestAge();
