let Playservices;

describe('ti.playservices', function () {

	it('can be required', () => {
		Playservices = require('ti.playservices');
		expect(Playservices).toBeDefined();
	});

	it('.apiName', () => {
		expect(Playservices.apiName).toBe('Ti.Playservices');
	});

	describe('constants', () => {
		describe('RESULT_*', () => {
			it('RESULT_SUCCESS', () => {
				expect(Playservices.RESULT_SUCCESS).toEqual(jasmine.any(Number));
			});
			it('RESULT_SERVICE_MISSING', () => {
				expect(Playservices.RESULT_SERVICE_MISSING).toEqual(jasmine.any(Number));
			});
			it('RESULT_SERVICE_UPDATING', () => {
				expect(Playservices.RESULT_SERVICE_UPDATING).toEqual(jasmine.any(Number));
			});
			it('RESULT_SERVICE_VERSION_UPDATE_REQUIRED', () => {
				expect(Playservices.RESULT_SERVICE_VERSION_UPDATE_REQUIRED).toEqual(jasmine.any(Number));
			});
			it('RESULT_SERVICE_INVALID', () => {
				expect(Playservices.RESULT_SERVICE_INVALID).toEqual(jasmine.any(Number));
			});
		});

		describe('GOOGLE_PLAY_SERVICES_*', () => {
			it('GOOGLE_PLAY_SERVICES_PACKAGE', () => {
				expect(Playservices.GOOGLE_PLAY_SERVICES_PACKAGE).toEqual('com.google.android.gms');
			});
			it('GOOGLE_PLAY_SERVICES_VERSION_CODE', () => {
				expect(Playservices.GOOGLE_PLAY_SERVICES_VERSION_CODE).toEqual(jasmine.any(Number));
			});
		});
	});
});
