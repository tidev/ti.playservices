import axwayRecommended from 'eslint-config-axway';
import axwayNode from 'eslint-config-axway/env-node';
import pluginJasmine from 'eslint-plugin-jasmine';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

// Globals provided by the Titanium JS runtime. These used to come from the
// "axway/env-titanium" config, which eslint-config-axway dropped in v11.
const titanium = {
	alert: 'readonly',
	clearInterval: 'readonly',
	clearTimeout: 'readonly',
	console: 'readonly',
	decodeURIComponent: 'readonly',
	encodeURIComponent: 'readonly',
	exports: 'writable',
	L: 'readonly',
	module: 'writable',
	require: 'readonly',
	setInterval: 'readonly',
	setTimeout: 'readonly',
	Ti: 'readonly',
	Titanium: 'readonly'
};

export default defineConfig([
	globalIgnores([
		'android/bin/',
		'android/build/',
		'android/dist/',
		'ios/build/',
		'ios/dist/',

		// These should eventually be linted as well
		'android/example/',
		'ios/example/'
	]),

	// Everything that runs inside the Titanium runtime.
	{
		name: 'ti.playservices/titanium',
		files: [ '**/*.js' ],
		extends: [ axwayRecommended ],
		languageOptions: {
			ecmaVersion: 2015,
			sourceType: 'commonjs',
			globals: titanium
		},
		rules: {
			'no-alert': 'off'
		}
	},

	// Build/CI tooling that runs under Node.js instead.
	{
		name: 'ti.playservices/node',
		files: [ 'dangerfile.js', 'eslint.config.mjs', 'test/unit/karma.unit.config.js' ],
		extends: [ axwayNode ],
		languageOptions: {
			ecmaVersion: 2017,
			sourceType: 'commonjs',
			globals: globals.node
		}
	},
	{
		name: 'ti.playservices/node-esm',
		files: [ 'eslint.config.mjs' ],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
		}
	},

	// Unit tests.
	{
		name: 'ti.playservices/specs',
		files: [ 'test/unit/specs/**/*.js' ],
		plugins: { jasmine: pluginJasmine },
		languageOptions: {
			globals: globals.jasmine
		},
		rules: pluginJasmine.configs.recommended.rules
	}
]);
