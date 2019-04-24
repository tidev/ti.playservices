/**
 * Axway Appcelerator Titanium - ti.playservices
 * Copyright (c) 2017 by Axway. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
package ti.playservices;

import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.kroll.KrollModule;
import org.appcelerator.titanium.TiApplication;

import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.ConnectionResult;

@Kroll.module(name="PlayServices", id="ti.playservices")
public class PlayServicesModule extends KrollModule
{
	private static final String TAG = "TiPlayServices";

	private GoogleApiAvailability api;

	@Kroll.constant public static final String GOOGLE_PLAY_SERVICES_PACKAGE = GoogleApiAvailability.GOOGLE_PLAY_SERVICES_PACKAGE;
	@Kroll.constant public static final int GOOGLE_PLAY_SERVICES_VERSION_CODE = GoogleApiAvailability.GOOGLE_PLAY_SERVICES_VERSION_CODE;

	@Kroll.constant public static final int RESULT_SUCCESS = ConnectionResult.SUCCESS;
	@Kroll.constant public static final int RESULT_SERVICE_MISSING = ConnectionResult.SERVICE_MISSING;
	@Kroll.constant public static final int RESULT_SERVICE_UPDATING = ConnectionResult.SERVICE_UPDATING;
	@Kroll.constant public static final int RESULT_SERVICE_VERSION_UPDATE_REQUIRED = ConnectionResult.SERVICE_VERSION_UPDATE_REQUIRED;
	@Kroll.constant public static final int RESULT_SERVICE_DISABLED = ConnectionResult.SERVICE_DISABLED;
	@Kroll.constant public static final int RESULT_SERVICE_INVALID = ConnectionResult.SERVICE_INVALID;

	public PlayServicesModule() {
		super();

		this.api = GoogleApiAvailability.getInstance();
	}

	@Kroll.method
	public int isGooglePlayServicesAvailable() {
		return this.api.isGooglePlayServicesAvailable(TiApplication.getAppRootOrCurrentActivity());
	}

	@Kroll.method
	public boolean isUserResolvableError(int code) {
		return this.api.isUserResolvableError(code);
	}

	@Kroll.method
	public String getErrorString(int code) {
		return this.api.getErrorString(code);
	}

	@Override
	public String getApiName()
	{
		return "Ti.Playservices";
	}
}
