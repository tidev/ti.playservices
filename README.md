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
    const PlayServices = require('ti.playservices');
```

The `PlayServices` variable is a reference to the module. Make API calls using this reference:
```JS
    const playServicesAvailable = PlayServices.isGooglePlayServicesAvailable();
```

As of version 17.1.0 (only supported by Titanium Mobile SDK 9.0.0 and above), the `ti.playservices` module will automatically check if
Google Play Services is installed and up-to-date on the device upon app startup. If not, the module will prompt the
end-user to install/update it. The main app script (ie: `app.js` or `alloy.js`) will not be executed until the end-user has
successfully installed/updated Google Play Services or if it is already up-to-date.

If you do not want `ti.playservices` to check Google Play Services on app startup, then you can disable the above mentioned behavior
by setting the below property in the `tiapp.xml` file.

```xml
<ti:app xmlns:ti="http://ti.appcelerator.org">
	<property name="ti.playservices.validate.on.startup" type="bool">false</property>
</ti:app>
```

If you disable the above behavior, then it is highly recommended to detect availability issues yourself as shown below.
```JS
const PlayServices = require('ti.playservices');

const win = Ti.UI.createWindow({ backgroundColor: 'gray' });
const btn = Ti.UI.createButton({ title: 'CHECK PLAY SERVICES' });

btn.addEventListener('click', () => {
    PlayServices.makeGooglePlayServicesAvailable((e) => {
        if (e.success) {
            alert(`Play Services: ${PlayServices.GOOGLE_PLAY_SERVICES_VERSION_CODE}`);
            // Use Play Services
        } else {
            alert(`Play Services is not available.`);
        }
    });
});

win.add(btn);
win.open();
```

To include Play Services libraries with your native module include the module as a dependency by adding a `<module>` item to the `<modules>` element of your `timodule.xml` file:
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
1. Create a `lib` folder in the `android` directory
2. Run `npm install node .` from the `updater` directory
3. Run `npm install && node .` from the `updater` directory
4. Run `appc run -p android --build-only` from the `android` directory

## Author
Axway

## License
Apache 2.0

Contributing
---------------
Code contributions are greatly appreciated, please submit a new [pull request](https://github.com/appcelerator-modules/ti.playservices/pull/new/master)!
