const MAX_RETRY = 1;

function makeGooglePlayServicesAvailable (callback, _retry = 0) {
    let result = {
        success: false,
        message: undefined
    };

    // Attempt to load ti.playservices module if available.
    try {
        const PlayServices = require('ti.playservices');
        const playServicesResult = PlayServices.isGooglePlayServicesAvailable();
        const playServicesVersion = PlayServices.GOOGLE_PLAY_SERVICES_VERSION_CODE;

        // Listener callback to determin when the user has returned to the app
        function playServicesResume () {
            Ti.App.removeEventListener('resume', playServicesResume);
            makeGooglePlayServicesAvailable(callback, ++_retry);
        };

        // Google Play Services is available.
        if (playServicesResult === PlayServices.RESULT_SUCCESS) {
            result.success = true;
            result.message = `Google Play Services is available. (version: ${playServicesVersion})`;
        } else {
            result.success = false;
            result.message = `Google Play Services is unavailable. (${PlayServices.getErrorString(playServicesResult)})`;

            switch (playServicesResult) {

                // Google Play Services is missing or outdated.
                // Attempt to open Google Play store so user can install latest.
                case PlayServices.RESULT_SERVICE_MISSING:
                case PlayServices.RESULT_SERVICE_VERSION_UPDATE_REQUIRED:
                case PlayServices.RESULT_SERVICE_UPDATING:
                    if (_retry < MAX_RETRY) {
                        const installPlayServicesIntent = Ti.Android.createIntent({
                            action: Ti.Android.ACTION_VIEW,
                            data: 'market://details?id=com.google.android.gms'
                        });
                        Ti.Android.currentActivity.startActivity(installPlayServicesIntent);
    
                        setTimeout(() => {
                            Ti.App.addEventListener('resume', playServicesResume);
                        }, 1000);
                        return;
                    }
                    break;
                
                // Google Play Services has been disabled.
                // Attempt to open Google Play Services app info so user can re-enable.
                case PlayServices.RESULT_SERVICE_DISABLED:
                    if (_retry < MAX_RETRY) {
                        const detailPlayServicesIntent = Ti.Android.createIntent({
                            action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
                            flags: Ti.Android.FLAG_ACTIVITY_NEW_TASK,
                            data: 'package:com.google.android.gms'
                        });
                        Ti.Android.currentActivity.startActivity(detailPlayServicesIntent);

                        setTimeout(() => {
                            Ti.App.addEventListener('resume', playServicesResume);
                        }, 1000);
                        return;
                    }
                    break;

                // Google Play Services is invalid.
                // This could be running on an unsupported device.
                case PlayServices.RESULT_SERVICE_INVALID:
                    result.message += `\nThis could be an unsupported device.`;
                    break;
            }
        }

    // Google Play Services is not available...
    } catch (e) {
        result.success = false;
        result.message = `Could not load 'ti.playservices' module.`;
    }

    Ti.API.info(`ti.playservices: ${result.message}`);
    callback(result);
}

module.exports = {
    makeGooglePlayServicesAvailable
};
