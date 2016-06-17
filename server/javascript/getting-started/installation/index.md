Appacitive Javascript SDK is built mostly in the way models and collections work in <a href="http://backbonejs.org/" target="_blank">Backbone.js</a>, with changes to accomodate Appacitive's API  convention. Thus integrating SDK with backbone apps becomes more easy.

# Include SDK

The SDK itself has no dependencies on any libraries. The SDK doesn't include backbone.js, so if you're developing a backbone app you'll need to include backbone.js and its dependencies.

## Include the SDK in your app using CDN

It is recommended to serve the sdk directly from our Content Delivery Network. Add the following line of code after loading Backbone.js and its dependencies.

This will include the sdk in your project.

```html
<script src="//cdn.appacitive.com/sdk/js/appacitive-js-sdk-v1.0.9.min.js"></script>
```
Using a protocol relative URI means the sdk will be served using the same protocol (HTTP or HTTPS) as your index.html.

<a title="Download blank Javascript/HTML5 project" class="btn btn-success" href="http://cdn.appacitive.com/devcenter/javascript/js_appacitive_empty_project_v1.0.9.zip"><i class="glyphicon glyphicon-download-alt"></i>  Download blank Javascript/HTML5 project</a>

## Download and Include the sdk 

Incase you don't want to use CDN, you can always <a href="/javascript/downloads" target="_blank">download</a> the SDK.

The source code for the Javascript sdk for Appacitive is open source and is available on Github under the [Apache License](https://github.com/chiragsanghvi/JavascriptSDK/blob/master/License).

From the source code, you just need to download the `AppacitiveSDK.min.js` or `AppacitiveSDK.js` file, and include it in your app.

<a title="View on Github" class="btn btn-success <%- github %>" target="_blank" href="https://github.com/chiragsanghvi/JavascriptSDK">Github <i class="glyphicon glyphicon-share-alt"></i></a>

## Include SDK in your Phonegap App

Including the SDK in a <a href="http://phonegap.com/" target="_blank">Phonegap</a> app and Web app is same. 

## Include SDK in your Titanium App

For Titanium download <a href="https://raw.githubusercontent.com/chiragsanghvi/JavascriptSDK/master/Ti.AppacitiveSDK.js" target="_blank">Ti.AppacitiveSDK.js </a> and include it in your app. 

## Include SDK in your Node.js App

You should add the SDK as npm dependency. Run the command below to install the module, and update your apps package.json.

```javascript
npm install appacitive -g
```

In your app, import the library using require.

```
var Appacitive = require('appacitive');
```

## Include SDK in your React Native App

You should add the SDK as npm dependency. Run the command below to install the module, and update your apps package.json.

```javascript
npm install appacitive
```

In your app, import the library using require.

```
var Appacitive = require('appacitive/react-native');
```

## Initializing the sdk for your app.

To start using the SDK inside your app, you need to initialize it with your `apikey`, `appId` and `environment`. You can initialize the SDK any where in your app, before using any Appacitive classes. The returned promise fulfills with current user.

```javscript
var promise = Appacitive.initialize({ 
  apikey: "{apikey}",// The master or client api key for your app on appacitive.
  env: "sandbox", 	 // The environment that you are targetting (sandbox or live).
  appId: "{appId}"	 // The app id for your app on appacitive. 
});

promise.then(function(current) {
    ...
});
```

**Retrieving API Key and Application Id**

You will need to replace `{appId}` by your application's id and `{apikey}` by API Key. To get these details, open your app on Appacitive Portal. API key for the app is available on your app's home page at the bottom. To get the App Id, open application details, by clicking on edit icon near your app's name.

**Note**: We suggest using the client key as API key to maintain security and controlled access on your data in client environments. 

!["Getting your apikey"](http://cdn.appacitive.com/devcenter/root/dashboard.png)

Consider you need to use master key for some operations, then you'll need to ask the sdk to start using it as:

```javascript
// Set master key in this way
Appacitive.Session.setMasterKey(masterKey);

// Ask the sdk to use master key
Appacitive.Session.useMasterKey = true;

// You can change the environment of your app programmatically as
Appacitive.Session.environment('live');

// To reset all keys, environment and user sessions in the sdk
// After invoking this method, you'll need to
// Reinitiailize the sdk to start using it again
Appacitive.Session.reset();
```

## Verify Set Up

Your app is now connected to Appacitive. The `ping` method, as shown below, will contact the backend and verify that the SDK can communicate with your app.

```javascript
Appacitive.ping({
	success: function(response) {
	    console.log('Appacitive Ping Successful. Your app is up and running.');
	}, error: function(error) {
	    console.log('Appacitive Ping Failed. Response: ' + error.message);
	}
});
```

## User Session and Current User

Your app will be used by a real-life human being; this person is represented by the Current User. It would be bothersome if the user had to log in every time they open your app. 

Thus, whenever you initialize your app, the sdk will set the user session and current user if available by default. For more info on current user you can refer this <a  target="_blank" href="/javascript/users/guides.html#current-user">guide</a>.