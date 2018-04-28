<p align="center">
	<img src="https://lh4.ggpht.com/fX0oncZTwPIETqwHYjYzW2o44N3NqsAB_X16KTJzTDFK4UdcGrtKaMxuVtCX-3Ovzqw=w300" height="128" width="128">
	<h1 align="center">ti.playservices</h1>
	<h5 align="center">To provide Google Play Services for Titanium modules and applications</h6>
	<div align="center">
		<img src="https://github.com/appcelerator-modules/ti.playservices/raw/master/apidoc/diagram.png" height="170" width="449">
	</div>
</p>

## Requirements
- Titanium Mobile SDK 7.0.0 or later (release 12/2017)

## Example
Add the module as a dependency to your application by adding a `<module>` item to the `<modules>` element of your `tiapp.xml` file:
```XML
<ti:app>
  ...
  <modules>
    <module platform="android">ti.playservices</module>
  </modules>
  ...
</ti:app>
```

Use `require()` to access the module from JavaScript:
```JS
    var PlayServices = require('ti.playservices');
```

The `PlayServices` variable is a reference to the module. Make API calls using this reference:
```JS
    var playServicesAvailable = PlayServices.isGooglePlayServicesAvailable();
```

Or include the module as a dependency to a native module by adding a `<module>` item to the `<modules>` element of your `timodule.xml` file:
```XML
<ti:module>
  ...
  <modules>
    <module platform="android">ti.playservices</module>
  </modules>
  ...
</ti:module>
```

For a detailed API example please see [android/example/app.js](https://github.com/appcelerator-modules/ti.playservices/blob/master/android/example/app.js)

## Build
`appc run -p android --build-only` from the `android` directory

## Author
Axway

## License
Apache 2.0

Contributing
---------------
Code contributions are greatly appreciated, please submit a new [pull request](https://github.com/appcelerator-modules/ti.playservices/pull/new/master)!
