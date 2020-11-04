/**
 * Checks if Google Play Services is available (ie: installed/updated) on devices that support it.
 * If not available, will display Google's standard dialog asking end-user to install/update it.
 * @param {Function} finished Callback to be invoked when this check has finished.
 */
function showUI(finished) {
	try {
		const PlayServices = require('ti.playservices');

		// Check if Play Services needs to be installed, updated, or enabled.
		let isUpdateNeeded = false;
		const resultCode = PlayServices.isGooglePlayServicesAvailable();
		if (resultCode === PlayServices.RESULT_SUCCESS) {
			// Play Services is installed/updated.
			const versionString = PlayServices.GOOGLE_PLAY_SERVICES_VERSION_CODE;
			Ti.API.info(`ti.playservices: Google Play Services is available. (version: ${versionString})`);
			isUpdateNeeded = false;
		} else {
			// Play Services needs to be installed, updated, or enabled.
			// If invalid, then device does not support Google Play (such as Amazon devices) or it's a hacked version.
			const errorString = PlayServices.getErrorString(resultCode);
			Ti.API.info(`ti.playservices: Google Play Services is unavailable. (${errorString})`);
			isUpdateNeeded = (resultCode !== PlayServices.RESULT_SERVICE_INVALID);
		}

		// Stop here if update is not required.
		if (!isUpdateNeeded) {
			finished();
			return;
		}

		// Display Google's update dialog.
		PlayServices.makeGooglePlayServicesAvailable((e) => {
			if (e.success) {
				// Play Services is installed/updated.
				finished();
			} else if (e.code === PlayServices.RESULT_SERVICE_INVALID) {
				// Device does not support Google Play (such as an Amazon device) or it's a hacked version.
				finished();
			} else {
				// Exit the app, because the end-user refused to install/update Play Services when prompted.
				const activity = Ti.Android.currentActivity;
				if (activity) {
					activity.finish();
				}
			}
		});
	} catch (err) {
		Ti.API.error(err);
		finished();
	}
}

// Only inject this bootstrap's UI on startup if Google Play Services validation is enabled.
// Can be disabled via "tiapp.xml" entry:
// <ti:app>
//   <property name="ti.playservices.validate.on.startup" type="bool">false</property>
// </ti:app>
if (Ti.App.Properties.getBool('ti.playservices.validate.on.startup', true)) {
	if (Ti.UI.hasSession !== undefined) {
		// Titanium supports backgrounding and showing multiple UI sessions with a single JS runtime instance.
		// Show bootstrap's UI every time a new UI session has been created.
		exports.showUI = showUI;
	} else {
		// Older Titanium versions will only run this bootstrap once per JS runtime instance.
		exports.execute = showUI;
	}
}
