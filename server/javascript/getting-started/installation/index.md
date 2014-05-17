Appacitive Javascript SDK is built mostly in the way models and collections work in <a href="http://backbonejs.org/" target="_blank">Backbone.js <i class="glyphicon glyphicon-share-alt"></i></a>, with changes to accomodate Appacitive's API  convention. Thus integrating SDK with backbone apps becomes more easy.

#Include SDK

The SDK itself has no dependencies on any libraries. The SDK doesn't include backbone.js, so if you're developing a backbone app you'll need to include backbone.js and its dependencies.

##Include the SDK in your app using CDN

It is recommended to serve the sdk directly from our Content Delivery Network. Add the following line of code after loading Backbone.js and its dependencies.

```html
<script src="//cdn.appacitive.com/sdk/js/appacitive-js-sdk-v1.0.min.js"></script>
```
Using a protocol relative URI means the sdk will be served using the same protocol (HTTP or HTTPS) as your index.html.

This will include the sdk in your project.
##Download and Include the sdk 

Incase you do not want to use CDN, you can always <a href="/javascript/downloads" target="_blank">download <i class="glyphicon glyphicon-share-alt"></i></a> the SDK.

The source code for the Javascript sdk for Appacitive is open source and
is available on github under the [Apache License](https://github.com/chiragsanghvi/JavascriptSDK/blob/master/License).

From the source code, you just need to download the `AppacitiveSDK.min.js` or `AppacitiveSDK.js` file, and include it in your app.

<a title="View on Github" class="btn btn-success <%- github %>" target="_blank" href="https://github.com/chiragsanghvi/JavascriptSDK">Github <i class="glyphicon glyphicon-share-alt"></i></a>

## Include SDK in your phonegap App

Including the SDK in a <a href="http://phonegap.com/" target="_blank">Phonegap <i class="glyphicon glyphicon-share-alt"></i></a> app and Web app is same. You can simply follow above steps to include the SDK. You can refer this <a  target="_blank" href="">tutorial <i class="glyphicon glyphicon-share-alt"></i></a> for using the SDK in your phonegap app. 

##Include SDK in your Titanium App

For Titanium download <a href="/javascript/downloads" target="_blank">Ti.AppacitiveSDK.js <i class="glyphicon glyphicon-share-alt"></i></a> and include it in your app. For more info on including Titanium SDK please refer this <a  target="_blank" href="">blog <i class="glyphicon glyphicon-share-alt"></i></a>.

##Include SDK in your Node.js App

You should add the SDK as npm dependency. Run the command below to install the module, and update your apps package.json.

```javascript
npm install appacitive -s
```

In your app, import the library using require.

```
var Appacitive = require('appacitive');
```

## Initializing the sdk for your app.

To start using the SDK inside your app, you need to initialize it with your `apikey`, `appId` and `environment`. You can initialize the SDK any where in your app, but we suggest to do it at the starting point of your app. To initialize the SDK insert following code.

```javscript
Appacitive.initialize({ 
  apikey: "{apikey}",    // The master or client api key for your app on appacitive.
  env: "sandbox", 		 // The environment that you are targetting (sandbox or live).
  appId: "{appId}}		 // The app id for your app on appacitive. 
});
```

**Retrieving API Key and Application Id**

You will need to replace {appId} by your application's id and {apikey} by API Key. To get these details, open your app on Appacitive Portal. API key for the app is available on your app's home page at the bottom. To get the App Id, open application details, by clicking on edit icon near your app's name.

**Note**: We suggest using the client key as API key to maintain security and controlled access on your data.

## User Session and Current User

Your app will be used by a real-life human being; this person is represented by the Current User. It would be bothersome if the user had to log in every time they open your app. 

Thus, whenever you initialize your app, the sdk will set the user session and current user if available by default. For more info on current user you can refer this <a  target="_blank" href="/javascript/users/guides.html#current-user">guide <i class="glyphicon glyphicon-share-alt"></i></a>.