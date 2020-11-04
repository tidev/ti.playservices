/**
 * Axway Appcelerator Titanium - ti.playservices
 * Copyright (c) 2017 by Axway. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
package ti.playservices;

import android.app.Activity;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.tasks.Task;
import java.util.concurrent.CancellationException;
import org.appcelerator.kroll.KrollDict;
import org.appcelerator.kroll.KrollFunction;
import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.titanium.TiApplication;
import org.appcelerator.titanium.TiC;

@Kroll.module(name = "PlayServices", id = "ti.playservices")
public class PlayServicesModule extends KrollModule
{
	private static final String TAG = "TiPlayServices";

	private GoogleApiAvailability api;

	@Kroll.constant
	public static final String GOOGLE_PLAY_SERVICES_PACKAGE = GoogleApiAvailability.GOOGLE_PLAY_SERVICES_PACKAGE;
	@Kroll.constant
	public static final int GOOGLE_PLAY_SERVICES_VERSION_CODE = GoogleApiAvailability.GOOGLE_PLAY_SERVICES_VERSION_CODE;

	@Kroll.constant
	public static final int RESULT_SUCCESS = ConnectionResult.SUCCESS;
	@Kroll.constant
	public static final int RESULT_SERVICE_MISSING = ConnectionResult.SERVICE_MISSING;
	@Kroll.constant
	public static final int RESULT_SERVICE_UPDATING = ConnectionResult.SERVICE_UPDATING;
	@Kroll.constant
	public static final int RESULT_SERVICE_VERSION_UPDATE_REQUIRED = ConnectionResult.SERVICE_VERSION_UPDATE_REQUIRED;
	@Kroll.constant
	public static final int RESULT_SERVICE_DISABLED = ConnectionResult.SERVICE_DISABLED;
	@Kroll.constant
	public static final int RESULT_SERVICE_INVALID = ConnectionResult.SERVICE_INVALID;

	public PlayServicesModule()
	{
		super();

		this.api = GoogleApiAvailability.getInstance();
	}

	@Kroll.method
	public int isGooglePlayServicesAvailable()
	{
		return this.api.isGooglePlayServicesAvailable(TiApplication.getInstance());
	}

	@Kroll.method
	public boolean isUserResolvableError(int code)
	{
		return this.api.isUserResolvableError(code);
	}

	@Kroll.method
	public void makeGooglePlayServicesAvailable(final KrollFunction callback)
	{
		// Validate argument.
		if (callback == null) {
			throw new IllegalArgumentException(
				"makeGooglePlayServicesAvailable() method must be given a 'callback' argument.");
		}

		// Do not continue if Play Services is installed and up-to-date. (This is an optimization.)
		int resultCode = isGooglePlayServicesAvailable();
		if (resultCode == ConnectionResult.SUCCESS) {
			callback.callAsync(getKrollObject(), createEventForMakeAvailable(resultCode));
			return;
		}

		// Fetch the top-most activity.
		Activity activity = TiApplication.getAppCurrentActivity();
		if (activity == null) {
			activity = TiApplication.getInstance().getRootActivity();
			if (activity == null) {
				callback.callAsync(getKrollObject(), createEventForMakeAvailable(resultCode));
				return;
			}
		}

		// Display Google's standard dialog asking end-user to update Google Play Services.
		Task<Void> task = this.api.makeGooglePlayServicesAvailable(activity);
		task.addOnCompleteListener((Task<Void> theTask) -> {
			int newResultCode = theTask.isSuccessful() ? ConnectionResult.SUCCESS : resultCode;
			callback.callAsync(getKrollObject(), createEventForMakeAvailable(newResultCode));
		});
	}

	private KrollDict createEventForMakeAvailable(int resultCode)
	{
		String message;
		if (resultCode == ConnectionResult.SUCCESS) {
			message = "Google Play Services is available. (version: " + GOOGLE_PLAY_SERVICES_VERSION_CODE + ")";
		} else {
			message = "Google Play Services is unavailable. (" + getErrorString(resultCode) + ")";
		}

		KrollDict event = new KrollDict();
		event.putCodeAndMessage(resultCode, message);
		event.put(TiC.PROPERTY_MESSAGE, message);
		return event;
	}

	@Kroll.method
	public String getErrorString(int code)
	{
		return this.api.getErrorString(code);
	}

	@Override
	public String getApiName()
	{
		return "Ti.Playservices";
	}
}
