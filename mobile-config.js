// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.hackillinois.helpq.alpha',
  name: 'Hackillinois Helpq',
  description: 'Get help on your hacks during Hackillinois',
  author: 'Hackillinois',
  email: 'software@hackillinois.org',
  website: 'https://hackillinois.com'
});

// // Set up resources such as icons and launch screens.
App.icons({
  'iphone': 'ios_icns/ios.png',
  'iphone_3x': 'ios_icns/ios@2x.png',
  'iphone_3x': 'ios_icns/ios@3x.png',
  //'android_xhdpi':: 'andr_icns/icon_xxxhdpi.png'
  // ... more screen sizes and platforms ...
 });
//
App.launchScreens({
   'iphone': 'ios_splash/Default-Portrait.png',
   'iphone_2x': 'ios_splash/Default@2x.png',
//   // ... more screen sizes and platforms ...
});
//
// // Set PhoneGap/Cordova preferences
// App.setPreference('BackgroundColor', '0xff0000ff');
// App.setPreference('HideKeyboardFormAccessoryBar', true);

// Pass preferences for a particular PhoneGap/Cordova plugin
// App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//   APP_ID: '1234567890',
//   API_KEY: 'supersecretapikey'
// });

App.setPreference('BackupWebStorage', 'local');
App.accessRule("*");

if (this.process.env.NODE_ENV === 'production') {

}
else {

}
