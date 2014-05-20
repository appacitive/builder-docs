# SDK Conventions

Before we dive into using the SDK, we need to grok a couple of things. The Javascript sdk follows certain conventions for all operations. These are applied for all types through out the SDK.

## Appacitive platform and SDK mapping.
The following table shows the different sub systems in the Appacitive platform and their corresponding
SDK classes.

| Appacitive sub system | Corresponding SDK types |
|:------------- |:-------------|
| Objects | `Appacitive.Object` |
| Connections | `Appacitive.Connection` |
| Users | `Appacitive.User` |
| Devices | `Appacitive.Object` |
| Canned lists | `Appacitive.CannedList` |
| Search querying | `Appacitive.Query` |
| Graph apis | `Appacitive.Queries.GraphApi` |
| Graph query | `Appacitive.Queries.GraphQuery` |
| Authentication & user session | `Appacitive.Session` |
| File upload and download | `Appacitive.File` |
| Push notifications | `Appacitive.Push` |
| Emails | `Appacitive.Email` |
| Groups | `Appacitive.Group` |


### Static Object, Connection and User class

For types that encapsulate data (objects, connections, users and devices), the SDK provides instances of `Object`, `Connection` or `User` classes. These classes (e.g., `Appacitive.Object`) not only contains instance specific functionality
like create, update, fetch and destroy but also static methods which provide instance agnostic functionality for get, search, multiget and multidelete.

Lets consider an example:
```javascript

// Extend default object class 
var Player = Appacitive.Object.extend('player');

// Create an instance of Player class
var john = new Player({ name: 'John Doe' });

// Save the player
john.save();

// Fetch the player using get
// get is a static method defined on Object, which is inherited in Player
Player.get('{id}', {
	success: function(player) {
		console.log("Player " + player.get('name') + " fetched");
	}
});

// Search for all Players using Player class
// findAll is a static method defined on Object, which is inherited in Player
var query  = Player.findAll();
query.fetch({
	succcess: function(players) {
		// players is an array of Player objects
		console.log("Fetched " + player.length + " players");
	}
});
```

**Note**: User has its own static methods related to signup, login, link etc.

## Options and Callbacks

The javascript SDK is an async library and all data calls are async. Every call accepts an options argument similar to Backbone.js. 

`options`, conventionally, is a javascript object of key/value pairs that provide arguments/configuration or data/context to a method call. Think of it like named arguments, as opposed to ordered arguments.

For example:
```javascript
var Player = Appacitive.Object.extend('player');
var Players = Appacitive.Collection.extend();

// Create a PlayerCollection with 
// 'model', 'comparator' and 'query' options
var PlayerCollection = new Players([], {
  
  model: Player,  //Specifies the model for this colection

  // Specify the comparator
  comparator: function(player) { 
    return player.get('age');
  }, 

  // Specify the query
  query: new Player.FindAllQuery()
});

// Create a player object
var john = new Player({ name: 'john' });

// Add john to the collection 
// With options 'at' and 'silent'
PlayerCollection.add(john, {
	at: 0  // The index at which to add the model.
	silent: true // Set to true to avoid firing the `add` event for every new model.
});
```

Every API call looks for `success` and `error` callbacks in options object and calls respective function on completing the call. 

In addition to above specified options, you can also override the `apikey`, `environment` and `usertoken` to be sent for specific call. You can ask the sdk to avoid sending the usertoken in a call setting `ignoreUserToken` to true. 

If you've set the masterKey during initialize or using `Appacitive.Session.setMasterKey` method, you can just ask the sdk to use that key in a particular call setting `useMasterKey` to true. 

It is recommended to override these options in a server-side app only if required. 

```javascript
//callbacks
obj.save({ 
  success: function(obj) {
  		//... Called on success from API
  }, 
  error: function(err, obj){
  		//... Called on error from API
  },

  // Api call specific options

  apikey: '{apikey}',       // Use this apikey for this call
  environment: 'live'       // Use live environment for this call
  userToken: '{userToken}', // Use this token for this call
  ignoreUserToken: false,   // Send usertoken in this call
  useMasterKey: false       // Don't use masterKey in this call

  // backbone specific options
  wait: true, // wait for server to respond
  silent: true // Raise no change events on successful save
});
```

 1. Most data calls have a signature like `object::method({ success: onSuccess, error: onError })` where `onSuccess` and `onError` are functions that'll get executed in case of the call being a success or a failure respectively.
 2. Every data call also returns a promise.
 3. Every onSuccess callback for an object will get 1 argument viz. its own instance or an array of objects or connections.
 4. Every onError callback for an object will get 2 argument viz. error object and its own instance. Error object basically contains a code and message. We'll discuss this later in our error space guide.



