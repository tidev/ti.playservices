
exports.execute = (finished) => {
	// Check if Google Play Services validation is enabled on startup. (Enabled by default.)
	// Can be disabled via "tiapp.xml" entry:
	// <ti:app>
	//   <property name="ti.playservices.validate.on.startup" type="bool">false</property>
	// </ti:app>
	const isEnabled = Ti.App.Properties.getBool('ti.playservices.validate.on.startup', true);
	if (!isEnabled) {
		finished();
		return;
	}

	// Check if Google Play Services is available (ie: installed/updated) on devices that support it.
	// If not available, will display Google's standard dialog asking end-user to install/update it.
	try {
		const PlayServices = require('ti.playservices');
		PlayServices.makeGooglePlayServicesAvailable((e) => {
			if (e.success) {
				// Play Services is installed/updated. Proceed to load "app.js".
				finished();
			} else if (e.code === PlayServices.RESULT_SERVICE_INVALID) {
				// Device does not support Google Play (such as an Amazon device) or it's a hacked version.
				// Proceed to load "app.js". (It's impossible to install on device anyways.)
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
};
