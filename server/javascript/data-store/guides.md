# Objects

All data is represented as entities. This will become clearer as you read on. Lets assume that we are building a game and we need to store player data on the server.

## Creating Object
To create a player via the sdk, do the following
```javascript
var player = new Appacitive.Object('player');
```
Huh?

An `Appacitive.Object` comprises of an entity (referred to as 'object' in Appacitive jargon). To initialize an object, we need to provide it some options.

What is a `type`? In short, think of types as tables in a contemporary relational database. A type has properties which hold values just like columns in a table. A property has a data type and additional constraints are configured according to your application's need. 

Thus we are specifying that the player is supposed to contain an entity of the type 'player' (which should already be defined in your application).

The player object is an instance of `Appacitive.Object`. An `Appacitive.Object` is a class which encapsulates the data (the actual entity or the object) and methods that provide ways to update it, delete it etc. To see the raw entity that is stored within the `Appacitive.Object`, fire `player.toJSON()`.


### Extending Object

Each `Appacitive.Object` is an instance of a specific subclass of a particular `type` by default. To create a subclass of particular type of your own, you extend `Appacitive.Object` with `typename` and provide instance properties, as well as optional classProperties to be attached directly to the constructor function. 

```javascript
// create a new subclass of Appacitive.Object.
var Player = Appacitive.Object.extend('player');  //Name subclass using pascal casing

// create an instance of that class 
var tyson = new Player(); 

// Alternatively, you can use the typical Backbone syntax.
var Achievement = Appacitive.Object.extend({
  // Specify typeName
  typeName: 'player'
});
```

You can add additional methods and properties to your subclasses of `Appacitive.Object` as shown below

```javascript
// a subclass of Appacitive.Object
var Player = Appacitive.Object.extend('player', {
  
  // Specify defaults
  defaults: {
    firstname: '',
    lastname: ''
  },

  // Override constructor, which allows you to replace the actual constructor function
  constructor: function(attrs) { 

    if (attrs.name) {
        attrs.firstname = attrs.name.split(' ')[0];
        attrs.lastname = attrs.name.split(' ')[1];
    }

    //Invoke internal constructor
    this.base.call(this, atts); 
  },

  // Function called after object is created
  initialize: function() {
      //....
  },

  //instance method
  isAdult: function() {
    return this.tryGet('age', 0) >= 18 ? true: false;
  }

}, {
  // Class methods
  findAdultPlayers: function() {
    
    //create a query with filterring on age
    var query = this.findAllQuery({
      filter: Appacitive.Filter.Property('age').greaterThanEqualTo(18)
    });

    //call fetch and return promise 
    return query.fetch();  
  },

  create: function(name, age) {
    var player = return new Player();
    player.set('age', age);
    return player;
  }
});
```
When creating an instance of a subclass, you can pass in the initial values of the properties, which will be set on the `Appacitive.Object` instance.

```javascript
// // Create a new instance of player class
var john = new Player({ name 'John Doe', age: 24 });
alert(john.isAdult()); //displays true

// call class method create of person class
var john = Player.create('John Doe', 24);

// Fetch all players who're older than 18
Player.findAdultPlayers().then(function(res) { 
  console.log(res.length + ' players'); 
});
```

Above example depicts use of [queries](#queries), which we'll discuss in coming sections. By default whenever you extend `Appacitive.Object` class you also extend some of the static methods used for querying and fetching data viz. 

 * [get](#getting-object) 
 * [multiGet](#multiget-objects) 
 * [multiDelete](#multidelete-objects) 
 * [findAllQuery](#queries)

*Note :* For all these operations you won't need to pass the `type`, it'll be implicitly picked up from the extended class.

### Setting Values in Object

Now we need to name our player 'John Doe'. This can be done as follows
```javascript
 // values can be specified while creating the object
 var Player = Appacitive.Object.extend('player');
 var player = new Player({ name: 'John Doe' });

 // or we could use the setters
 player.set('name', 'John Doe');
```

### Saving Object
Saving a player to the server is easy.
```javascript
player.set('age','22');

//saving using promise
player.save().then(function() {
  alert('saved successfully!');
});

// or using callbacks
player.save({
  success : function() {
    alert('saved successfully!');
  },
  error: function(status) {
    alert("save failed due to " + status.message);
  }
});

```
When you call save, the entity is taken and stored on Appacitive's server. A unique identifier called `__id` is generated and is stored along with the player object. This identifier is also returned to the object on the client-side. You can access it directly using `id`.
This is what is available in the `player` object after a successful save.

```javascript

//isNew determines that an object is created or not
if (player.isNew()) console.log("Creating player");
if (!player.isNew()) console.log("Updating player");


player.save().then(function(obj) {
  console.log("ID : " + player.id);
  console.dir(player.toJSON());

  //created determines whether this object existed on server
  console.log(player.created);
});
// output
/* 
ID: 14696753262625025
{
    "__id": "14696753262625025",
    "__type": "player",
    "__typeid": "12709596281045355",
    "__revision": "1",
    "__createdby": "System",
    "__lastmodifiedby": "System",
    "__tags": [],
    "__utcdatecreated": "2014-01-10T05:18:36.0000000",
    "__utclastupdateddate": "2014-01-10T05:18:36.0000000",
    "name": "John Doe",
    "__attributes": {},
}
true
*/
```
You'll see a bunch of fields that were created automatically by the server. They are used for housekeeping and storing meta-information about the object. All system generated fields start with `__`, avoid changing their values. Your values will be different than the ones shown here.

`__utcdatecreated` and `__utclastupdateddate` represent the time that each object was created and last modified in the cloud. Each of these fields is filled in by Appacitive, so they don't exist on Appacitive.Object until a save operation has completed. They're accessible using `createdAt` and `updatedAt` properties in object.

```javascript
// after successful save

console.log(player.id) // returns id of obejct

console.log(player.createdAt); //returns a date object
console.log(player.updatedAt); //returns a date object

console.log(player.createdBy); //returns id of user who created it
console.log(player.updatedBy); //returns id of user who updated it
```

## Retrieving Object

Appacitive allows to retrieve single object using `Appacitive.Object.get` and multiple objects using `Appacitive.Object.multiGet` method.

### Getting Object

```javascript

// retrieve the player
Appacitive.Object.get({ 
  type: 'player', //mandatory
  id: '{{existing__id}}', //mandatory
  fields: ["name"] //optional
}).then(function(player) {
  // player obj is returned as argument to onsuccess
  alert('Fetched player with name: ' + player.get('name')); 
});

// or via extended class
var Player = Appacitive.Object.extend('player');
Player.get({ 
  id: '{{existing__id}}', //mandatory
  fields: ["name"] //optional
}).then(function(player) {
  // player obj is returned as argument to onsuccess
  alert('Fetched player with name: ' + player.get('name'));
});

//Without fields using callbacks
Player.get('{{existing_id}}', {
  success: function(player) {
    // player obj is returned as argument to success callback
    alert('Fetched player with name: ' + obj.get('name')); 
  }
})

```

If you need to refresh an object you already have with the latest data that is in the Appacitive Cloud, you can call the fetch method like so:
```javascript
// retrieve the player
player.fetch().then(function(obj) {
  alert('Fetched player with name: ' + player.get('name'));
});
```

**Note**:  You can mention exactly which all fields you want returned so as to reduce payload. By default all fields are returned. Fields `__id` and `__type` are the fields which will always be returned. Every create, save and fetch call will return only these fields, if they're specified in third argument to these calls.
```javascript
["name", "age", "__createby"] //will set fields to return __id, __type, name, age and __createdby
[] //will set fields to return only __id and __type
["*"] //will set fields to return all user-defined properties and __id and __type
```

#### Getting values in Object
Lets verify that our player is indeed called 'John Doe'
```javascript
// using the getters
alert(player.get('name'));  // John Doe

// direct access via attributes
alert(player.attributes.name); //John Doe

// using the raw object data
alert(player.toJSON().name);  // John Doe

//getting stringified respresentation of object
alert(player.toString());
```
To delete a single field from an object use the unset method
```javascript
player.unset('name');
```

#### Getting typed values in Object

Appacitive returns all properties as string with their datatype information viz. metadata. The SDK translates these strings into native types by default. Thus, there's no need to cast those properties.

But, if you've specified the datatype of a property as string and the data stored in it is not of string type, then you can simply cast those values.

SDK supports this, by allowing you to get values cast into a specific type on `get` and `tryGet` methods.

```javascript
// sets 'birth_date' as string
player.set('birth_date', '2014-05-10');
//get a 'date' object from 'birth_date' property
console.log(player.get('birth_date', 'date'));


// sets 'age' as string
player.set('age', '23');
//get an 'integer' value from  'age' property
console.log(player.get('age', 'integer'));


// sets 'isenabled' as string
player.set('isenabled', 'false');
//get a 'boolean' value from 'isenabled' property
console.log(player.get('isenabled', 'boolean'));


// sets 'location' as string
player.set('location', '10,20');
//get a 'geocode' object from 'location' property
console.log(player.get('location', 'geocode'));
```
Types supported are `date`, `datetime`, `time`, `integer`, `decimal`, `boolean`, `string` and `geocode`. `geocode` will return an instance of [Appacitive.GeoCoord](#geolocation) class.

#### Try-Get values in Object

There're scenarios, when a user might need to get a non-null value for a property, so that his code doesn't needs to do null check.
This can be accomplished using `tryget` method.
```javascript
//get players age, if it is null return `12` as value
alert(player.tryGet('age', 12))
```
By default these values are casted into native types as specified by your model. You can also type cast these values
```javascript
//get players age casted into integer type, if it is null return 12 as value 
alert(player.tryGet('age', 12, 'integer'))
```

### Multiget Objects

You can also retrieve multiple objects at a time, which will return an array of `Appacitive.Object` objects in its onSuccess callback. Here's an example

```javascript
Appacitive.Object.multiGet({ 
  type: 'players', //name of type : mandatory
  ids: ["14696753262625025", "14696753262625026"], //array of object ids to get : mandatory
  fields: ["name"] // fields to be returned object, to avoid increasing the payload : optional
}).then(function(objects) { 
  // objects is an array of player objects
});


//or via extended class 
var Player = Appacitive.Object.extend('player');
Player.multiGet({ 
  ids: ["14696753262625025", "14696753262625026"], //array of object ids to get : mandatory
  fields: ["name"]// fields to be returned, to avoid increasing the payload : optional
}).then(function(objects) { 
  // objects is an array of Player objects
});

```
## Updating Object

Updating is also done via the `save` method, just set some data on it. To illustrate: 
```javascript
// extend class
var Player = Appacitive.Object.extend('player');

// create a blank object
var player = new Player({ name: 'john Doe'});

// set hobbies as an array property
player.set('hobbies', ['swimming', 'trekking']);

// set score of player
player.set('score', 220);

// isNew determines that an object is created or not
// this'll be true for now
if (player.isNew()) console.log("Creating player");

// save it
player.save().then(function() {
  // player has been saved successfully

  // determines whether this object existed on Appacitive  
  // this will be true
  if (player.created) console.log("Player created");

  // this will be false
  if (!player.isNew()) console.log("Updating player");

  // now lets update the player's name
  player.set('name', 'Jane Doe');

  // add a new hobby
  player.add('hobbies', 'rappelling');

  // increment the score of player by 20
  player.increment('score', 20);

  // returns a promise
  return player.save();
}).then(function() {

  // this will be false
  if (player.created) console.log("Player updated");

  console.log(player.get('name')); // Jane Doe
  console.log(player.get('hobbies')) // ['swimming', 'trekking', 'rappelling'];
  console.log(player.get('score')) // 240
}, function(err, obj) {
  if (player.isNew())  alert('create failed');
  else alert('update failed');
});
```
As you might notice, update is done via the save method as well. The SDK combines the create operation and the update operation under the hood and provides a unified interface. This is done be detecting the presence of the property `__id` to decide whether the object has been created and needs updating or whether the object needs to be created. 
This also means that you should never delete/modify the `__id`/ id property on an entity.

Appacitive automatically figures out which data has changed so only "dirty" fields will be sent. Thus, you don't end up overriding data that you didn't intend to update.

### Counters

The above example contains a common use case. The "score" field is a counter that we'll need to continually update with the player's latest score. Using the above method works but it's tedious and can lead to problems if you have multiple clients trying to update the same counter.

Appacitive allows to atomically increment/decrement a number property which will be used as a counter. 

Calling increment method will ensure that the current value of the counter will be incremented by the value provided, even if another call updates the value before this call executed. Value will be updated once `save` is called.

The example below walks you through how to increment a field, and how to make sure that increment gets executed.

```javascript
//increment score by 1
player.increment('score') 
      //or 
//increment score by 10
player.increment('score', 10); 
```
You can also increment the amount by passing in a second argument to increment. When no amount is specified, 1 is used by default.

### Arrays

Appacitive allows to set `string`, `integer` and `decimal` type of properties as *multivalued* i.e. allow storing array data in them.

These operations allow you to atomically change the array value for a particular property :

*add* add the given value to the multivalued property.
*addUnique* add the given value to the multivalued property, only if it is unique.
*remove* remove all occurances of the given value from the multivalued property.

```javascript
//add items to multivalued property 'hobbies' of player
player.add('hobbies', 'hiking');
player.addUnique('hobbies', 'rappelling');

//remove item from 'hobbies'
player.remove('hobbies', 'swimming');

//call save to persist the changes
player.save();
```
Value will be updated after calling `save`.

## Deleting Object

Deleting is provided via the `destroy` method . Lets say we've had enough of John Doe and want to remove him from the server, here's what we'd do.
```javascript
player.destroy().then(function(obj) {
  alert('Deleted successfully');
});

//You can also delete object with its connections in a simple call.
//Setting the first argument to true will delete its connections if they exist
player.destroy(true).then(function(obj) {
  alert('Deleted successfully');
}); 
```

### Multidelete Objects

Multiple objects can also be deleted at a time. Here's an example

```javascript
Appacitive.Object.multiDelete({   
  type: 'players', //name of type
  ids: ["14696753262625025", "14696753262625026", "14696753262625027"] //array of object ids to delete
}).then(function() { 
  //successfully deleted all objects
}, function(err) {
  alert("code:" + err.code + "\nmessage:" + err.message);
});

// or via extended class
var Player = Appacitive.Object.extend('player');

Player.multiDelete({   
  ids: ["14696753262625025", "14696753262625026", "14696753262625027"] //array of object ids to delete
}).then(function() { 
  //successfully deleted all objects
}, function(err) {
  alert("code:" + err.code + "\nmessage:" + err.message);
});
```

# Connections

All data that resides in the Appacitive platform is relational, like in the real world. This means you can do operations like fetching all games that any particular player has played, adding a new player to a team or disbanding a team whilst still keeping the other teams and their `players` data perfectly intact.

Two entities can be connected via a relation, for example two entities of type `person` might be connected via a relation `friend` or `enemy` and so on. An entity of type `person` might be connected to an entity of type `house` via a relation `owns`. Still here? OK, lets carry on.

One more thing to grok is the concept of labels. Consider an entity of type `person`. This entity is connected to another `person` via relation `marriage`. Within the context of the relation `marriage`, one person is the `husband` and the other is the `wife`. Similarly the same entity can be connected to an entity of type `house` via the relation `owns_house`. In context of this relation, the entity of type `person` can be referred to as the `owner`. 

`Wife`, `husband` and `owner` from the previous example are `labels`. Labels are used within the scope of a relation to give contextual meaning to the entities involved in that relation. They have no meaning or impact outside of the relation.

Let's jump in!

## Creating Connection

In Appacitive terminology instance of Relation is referred as Connection. A Relation has Properties of its own which have data types and applicable constraints just like Objects.

You can define multiplicity on the relation, by doing so you can have one to one, one to many or many to many. For example you can control if a User can write one or more Review(s) for a Hotel.

### Extending Connection

Each `Appacitive.Connection` is an instance of a specific subclass of a particular `relation` by default. To create a subclass of particular relation of your own, you extend `Appacitive.Connection` with `relationName` and provide instance properties, as well as optional classProperties to be attached directly to the constructor function. 

```javascript
// create a new subclass of Appacitive.Connection.
var Friend = Appacitive.Connection.extend('friends');  //Name subclass using pascal casing

// create an instance of that class 
var frnd = new Friend({
  endpoints: [{
    label: 'me',
    object: jane //instance of Appacitive.Object person type
  }, {
    label: 'friend',
    object: joe   //instance of Appacitive.Object person type
  }]
}); 

// Alternatively, you can use the typical Backbone syntax.
var Friend = Appacitive.Connection.extend({
  // Specify relationName
  relationName: 'player'
});
```

You can add additional methods and properties to your subclass of `Appacitive.Connection` as shown below

```javascript
// a subclass of Appacitive.Connection
var Friend = Appacitive.Connection.extend('friends', {
  
  //override constructor, which allows you to replace the actual constructor function
  constructor: function(attrs) { 

    // set friend type in numbers
    switch(attrs.type) {
      case 'close'  : attrs.type = 0;
                      break;
      case 'mutual' : attrs.type = 1;
                      break;
      default : attrs.type = 3;
    }

    //Invoke internal constructor
    this.base.call(this, atts); 
  },

  // Function called after connection is created
  initialize: function() {
      //....
  },

  //instance method
  getFriendType: function() {
    switch (this.get('type')) {
      case '0': return 'close';
      case '1': return 'mutual';
      default : return 'known';
    }
  }

}, {
  // Class methods
  findAllCloseFriends: function() {
    
    //create a query with filterring on age
    var query = this.findAllQuery({
      filter: Appacitive.Filter.Property('type').equalTo(0)
    });

    //call fetch and return promise 
    return query.fetch();  
  },

  create: function(person1, person2, type) {
    return new Friend({ 
      endpoints: [{
          label: 'me',
          object: person1 //instance of Appacitive.Object person type
        }, {
          label: 'friend',
          object: person2   //instance of Appacitive.Object person type
        }],
      type: type 
    });
  }
});
```
When creating an instance of a subclass, you're required to pass the endpoints and you can also pass in the initial values of the properties, which will be set on the `Appacitive.Connection` instance.

```javascript
var frnd = new Friend({ 
  endpoints: [{
      label: 'me',
      endpoint: jane //instance of Appacitive.Object person type
    }, {
      label: 'friend',
      endpint: john   //instance of Appacitive.Object person type
    }],
  type: 'close'  
});

alert(frnd.getFriendType()); //displays close

// call class method create of friend class
var john = Friend.create(jane, john, 'close');

Friend.findAllCloseFriends().then(function(res) { 
  console.log(res.length + ' close friends'); 
});
```

Above example depicts use of [queries](#queries), which we'll discuss in coming sections. By default whenever you extend `Appacitive.Object` class you also extend some of the static methods used for querying and fetching data viz. 

 * [get](#get-by-id) 
 * [multiGet](#multiget-connections) 
 * [multiDelete](#multidelete-connections) 
 * [findAllQuery](#queries) 
 * [betweenObjectsForRelationQuery](#get-connection-by-endpoint-object-ids) 

*Note :* For all these operations you won't need to pass the `relation`, it'll be implicitly picked up from the extended class.

### New Connection between two existing Objects

Before we go about creating connections, we need two entities. Consider the following

```javascript
var Person = Appacitive.Object.extend('person');

var  tarzan = new Person({ name: 'Tarzan' })
    , jane =  new Person({ name: 'Jane' });

// save the entites tarzan and jane
// ...
// ...

// initialize and set up a connection
var Marriage = Appacitive.Connection.extend('marriage');

var marriage = new Marriage({ 
  endpoints: [{
      object: tarzan,  //mandatory
      label: 'husband'  //mandatory
  }, {
      object: jane,  //mandatory
      label: 'wife' //mandatory
  }],
  date: new Date('01-01-2010')
});

// call save
marriage.save().then(function(obj) {
    alert('saved successfully!');
});

```

If you've read the previous object guide, most of this should be familiar. What happens in the `Appacitive.Connection` class is that the relation is configured to actually connect the two entities. We initialize with the `__id`s of the two entities and specify which is which for example here, Tarzan is the husband and Jane is the wife. 

In case you are wondering why this is necessary then here is the answer, it allows you to structure queries like 'who is tarzan's wife?' or 'which houses does tarzan own?' and much more. [Queries](#queries) are covered in later guides.

`marriage` is an instance of an extended class `Marriage` of `Appacitive.Connection`. Similar to an entity, you may call `toJSON` on a connection to get to the underlying object.

### New Connection between two new Objects

There is another easier way to connect two new entities. You can pass the new entities themselves to the connection while creating it.

```javascript
var Person = Appacitive.Object.extend('person');

var  tarzan = new Person({ name: 'Tarzan' })
    , jane =  new Person({ name: 'Jane' });

// initialize and sets up a connection
// This is another way to initialize a connection object without collection
// You can pass same options in the previous way of creating connection as well

var Marriage = Appacitive.Connection.extend('marriage');

var marriage = new Marriage({ 
  endpoints: [{
      object: tarzan,  //mandatory
      label: 'husband'  //mandatory
  }, {
      object: jane,  //mandatory
      label: 'wife' //mandatory
  }],
  date: new Date('01-01-2010')
});

// call save
marriage.save().then(function(obj) {
    alert('saved successfully!');
});

```

This is the recommended way to do it. In this case, the marriage relation will create the entities tarzan and jane first and then connect them using the relation `marriage`.

Here's the kicker: it doesn't matter whether tarzan and jane have been saved to the server yet. If they've been saved, then they will get connected via the relation 'marriage'. And if both (or one) hasn't been saved yet, when you call `marriage.save()`, the required entities will get connected and stored on the server. So you could create the two entities and connect them via a single `.save()` call, and if you see the two entities will also get reflected with saved changes, so your object is synced.

### Setting Values

Similar to [setting values](#setting-values-in-object) in objects.

```javascript
//This works exactly the same as in case of your standard entities.
marriage.set('date', new Date('01-10-2010'));
```

### Getting values

Similar to [getting values](#getting-values-in-object) in objects.

```javascript
//Again, this is similar to the entities.
alert(marriage.get('date')) // returns date object with following value 01-01-2010

//and it also supports the tryget similar to standard entities
alert(marriage.get('date', new Date(), 'date'));
```

## Retrieving Connection

### Get by Id

```javascript
Appacitive.Connection.get({
  relation: 'marriage', //mandatory
  id: '{{existing__id}}', //mandatory
  fields: ["name"] //optional
}).then(function(obj) {
  alert('Fetched marriage which occured on: ' + obj.get('date'));
});

//or via extended class

var Marriage = Appacitive.Connection.extend('marriage');

Marriage.get({
  id: '{{existing__id}}', //mandatory
  fields: ["name"] //optional
}).then(function(obj) {
  alert('Fetched marriage which occured on: ' + obj.get('date'));
});
```
If you need to refresh a connection you already have with the latest data that is in the Appacitive Cloud, you can call the fetch method like so:

```javascript

// retrieve the marriage connection
marriage.fetch().then(function(obj) {
    alert('Fetched marriage which occured on: ' + marriage.get('date'));
});
```
The marriage object is similar to the object, except you get two new fields viz. endpointA and endpointB which contain the id and label of the two entities that this object connects.

```javascript
//marriage.endpointA
{ label: "husband", type: "person", objectid: "35097613532529604"}

//marriage.endpointB
{ label: "wife", type: "person", objectid: "435097612324235325"}

//marriage.enpoints()
[
  { label: "husband", type: "person", objectid: "35097613532529604"},
  { label: "wife", type: "person", objectid: "435097612324235325"}
]
```

### Multiget Connections

You can also retrieve multiple connection at a time, which will return an array of `Appacitive.Connection` objects in its onSuccess callback. Here's an example

```javascript
Appacitive.Connection.multiGet({ 
  type: 'marriage', //name of type : mandatory
  ids: ["14696753262625025", "14696753262625026"], //array of connection ids to get : mandatory
  fields: ["name"]// this denotes the fields to be returned in the object connection, to avoid increasing the payload : optional
}).then(function(objects) { 
  // connections is an array of connection objects
});


//or via extended class 

var Marriage = Appacitive.Connection.extend('marriage');

Marriage.multiGet({ 
  ids: ["14696753262625025", "14696753262625026"], //array of connection ids to get : mandatory
  fields: ["name"]// this denotes the fields to be returned in the object connection, to avoid increasing the payload : optional
}).then(function(objects) { 
  // connections is an array of connection objects
});
```

### Get Connected Objects

Consider `Jane` has a lot of friends whom she wants to invite to her `marriage`. We can simply get all her friends who're of type `person` connected through a relation `friends` with label for jane as `me` and friends as `friend` using this search

```javascript
//Get an instance of person Object for Jane 
var Person = new Appacitive.Object('person');

var jane = new Person({ id : '123345456');

//call getConnectedObjects with all options that're supported by queries syntax
// we'll cover queries in next section
var query = jane.getConnectedObjects({ 
  relation : 'friends', //mandatory
  returnEdge: true, // set to false to stop returning connection
  label: 'friend' //mandatory for a relation between same type and different labels
});

query.fetch().then(function(results) {
  console.log("Jane has " + results.count + " friends")
  console.log(jane.children["friends"]);
});

```
On success, `jane` object is populated with a friend property in its `children`. So, `jane.children.friends` will give you a list of all friends of `Appacitive.Object` type.
These objects also contain a connection property which consists of its link properties with `jane`.

```javascript
// list of all connected objects to jane
jane.children.friends

//connection connecting jane to each object
jane.children.friends[0].connection
```

In this query, you provide a relation type (name) and a label if both endpoints are of same type and what is returned is a list of all the objects connected to above object. 

Such queries come helpful in a situation where you want to know all the interactions of a specific kind for of a particular object in the system.

### Get Connections for an Object

Scenarios where you may need to just get all connections of a particular relation for an objectId, this query comes to rescue.

Consider `Jane` is connected to some objects of type `person` via `invite` relationship, that also contains a `bool` property viz. `attending`. This value is false by default and will be set to true if that person is attending marriage.

Now she wants to know who all are attending her marriage without actually fetching their connected `person` objects, this can be done as

```javascript
//set an instance of person Object for Jane 
var Person = new Appacitive.Object('person');

var jane = new Person({ __id : '123345456');

//call getConnections with all options that're supported by queries syntax
// we'll cover queries in dept in next section
var query = jane.getConnections({
  relation: 'invite', //mandatory
  label: 'invitee', //mandatory
  filter: Appacitive.Filter.Property('attending').equalTo(true)
});

query.fetch().then(function(invites) {
  //invites is an array of connections
  console.log(invites);
});
```

In this query, you provide a relation type (name) and a label of opposite side whose connection you want to fetch and what is returned is a list of all the connections for above object. 

### Get Connection between 2 Object Ids

Appacitive also provides a reverse way to fetch a connection  between two objects.

If you provide two object ids of same or different types, all connections between those two objects are returned.

Consider you want to check whether `Tarzan` and `Jane` are married, you can do it as
```javascript
//'marriage' is the relation between person type
//and 'husband' and 'wife' are the endpoint labels

var query = Appacitive.Connection.getBetweenObjectsForRelation({ 
    relation: "marriage",
    objectAId : "22322", //mandatory 
    objectBId : "33422", //mandatory
    label : "wife" //madatory for a relation between same type and differenct labels
});

//construct query by extending class
var Marriage = Appacitive.Connection.extend('marriage');
var query = Marriage.getBetweenObjectsForRelation({ 
    objectAId : "22322", //mandatory 
    objectBId : "33422", //mandatory
    label : "wife" //madatory for a relation between same type and differenct labels
});

//fire the query to fetch
query.fetch().then(function(marriage){
    if (marriage != null) {
      // connection obj is returned as argument to onsuccess
      alert('Tarzan and jane are married at location ', marriage.get('location'));
    } else {
      alert('Tarzan and jane are not married');
    }
});

//For a relation between same type type and differenct endpoint labels
//'label' parameter becomes mandatory for the get call

```

Conside you want to check that a particular `house` is owned by `Jane`, you can do it by fetching connection for relation `owns_house` between `person` and `house`:
```javascript
var Owns_house = Appacitive.Connection.extend('owns_house');

var query = Owns_house.getBetweenObjectsForRelation({ 
    objectAId : "22322", // person type entity id
    objectBId : "33422" //house type entity id
});

query.fetch().then(function(obj) {
    if(obj != null) {
      alert('Jane owns this house');
    } else {
      alert("Jane doesn't owns this house");
    }
});
```

### Get all connections between two Object Ids

Consider `jane` is connected to `tarzan` via a `marriage` and a `friend` relationship. If we want to fetch all connections between them we could do this as:

```javascript
var query = Appacitive.Connection.getBetweenObjects({
  objectAId : "22322", // id of jane
  objectBId : "33422" // id of tarzan
});

query.fetch().then(function(connections) {
  console.log(connections);
});
```
On success, we get a list of all connections that connects `jane` and `tarzan`.

### Get Interconnections between one and multiple Object Ids

Consider, `jane` wants to know what type of connections exists between her and a group of `persons` and `houses` , she could do this as:
```javascript
var query = Appacitive.Connection.getInterconnects({
  objectAId: '13432',
  objectBIds: ['32423423', '2342342', '63453425', '345345342']
});

query.fetch().then(function(connections) {
  console.log(connections);
}, function(err) {
  alert("code:" + err.code + "\nmessage:" + err.message);
});
```

This would return all connections with object id `13432` on one side and '32423423', '2342342', '63453425' or '345345342' on the other side, if they exist.

## Updating Connection

Updating is done exactly in the same way as [objects](#updating-object], i.e. via the `save()` method. 

*Important*: Updating the endpoints (the `__endpointa` and the `__endpointb` property) will not have any effect and will fail the call. In case you need to change the connected objects, you need to delete the connection and create a new one. 
```javascript
marriage.set('location', 'Las Vegas');

marriage.save().then(function(obj) {
    alert('saved successfully!');
});
```
As before, do not modify the `__id` property.
 
## Deleting Connection

Deleting is provided via the `destroy` method.
```javascript
marriage.destroy().then(function() {
  alert('Tarzan and Jane are no longer married.');
});
```

### Multidelete Connections

Multiple coonection can also be deleted at a time. Here's an example
```javascript
Appacitive.Connection.multiDelete({   
  relation: 'friends', //name of relation
  ids: ["14696753262625025", "14696753262625026", "14696753262625027"] //array of connection ids to delete
}).then(function() { 
  //successfully deleted all connections
});

//by extending class
var Friends = Appacitive.Connection.extend('friends');
Friends.multiDelete({   
  ids: ["14696753262625025", "14696753262625026", "14696753262625027"] //array of connection ids to delete
}).then(function() { 
  //successfully deleted all connections
});

```  

# Batch Request

The `Batch` class lets you combine multiple operations into a single batch and execute them inside a single transaction. This is useful when you need to create, update and delete a lot of objects and connections in a single operation. As mentioned Batch executes operations in a transaction, failure of any operation will result in a rollback to original state and will give an error.

## Create Objects

First have a look at object requests. In this example we will create objects of type `restaurant` and `hotel` in a single call.

```javascript
// Extend Appacitive.Object class
var Hotel = Appacitive.Object.extend('hotel');

// Create a Hotel object Westin
var westin = new Hotel({ name: 'Westin' });

// Extend Appacitive.Object class
var Restauant = Appacitive.Object.extend('restaurant');

// mixAt36 is a new object with name and type properties
var mixAt36 = new Restaurant({ name: 'Mix@36', type: 'Lounge' });

// Create Batch class Object
var batch = new Appacitive.Batch();

// Add the objects that you want to save or update
batch.add(westin);
batch.add(mixAt36);

// Call execute to fire the request
batch.execute().then(function() {
  console.log(westin.get('name'));  //Westin
  console.log(mixAt36.get('type')); //Lounge
  console.log(mixAt36.get('name')); //Mix@36
}, function(error) {
  console.log(error);
});
```

## Create & Update Objects

We can also update multiple objects in the same way as creating them. Just remember that any object that is already created is considered for an update operation. For example,

```javascript

// Extend Appacitive.Object class
var Hotel = Appacitive.Object.extend('hotel');

// Create a Hotel object Westin
var westin = new Hotel({ name: 'Westin' });

// Extend Appacitive.Object class
var Restauant = Appacitive.Object.extend('restaurant');

// kuebar is a new object
var kuebar = new Restaurant({ name: 'Kuebar', type: 'Bar' });

// mixAt36 is a new object with name and type properties
var mixAt36 = new Restaurant({ name: 'Mix@36', type: 'Lounge' });


// Save kueBar 
kuebar.save().then(function() {
 
  // kuebar is an existing object and we're updating the type
  kuebar.set('type', 'Restaurant & Bar');

  // Create Batch class Object
  var batch = new Appacitive.Batch();

  // Add the objects that you want to save or update
  batch.add(westin);
  batch.add(mixAt36);
  batch.add(kuebar);

  // Call execute to fire the request
  batch.execute().then(function() {
    console.log(westin.get('name'));  //Westin
    console.log(kuebar.get('type'));  //Restaurant & Bar'
    console.log(mixAt36.get('type')); //Lounge
    console.log(mixAt36.get('name')); //Mix@36
  });
}, function(error) {
    console.log(error);
});
```

In this way, you can batch multiple create and update object requests in a single call. Simply remember that any object which has it's `id` property set is considered as an update call and an object with it's id property not set is considered as a create request.

## Create & Update Objects and Connections

These same principles apply to connections as well. You can create connections and the objects they connect in the same call. 

```javascript
// Extend Appacitive.Object class
var Hotel = Appacitive.Object.extend('hotel');

// Create a Hotel object Westin
var westin = new Hotel({ name: 'Westin' });

// Extend Appacitive.Object class
var Restauant = Appacitive.Object.extend('restaurant');

// kuebar is an existing object and we're updating the type
var kuebar = new Restaurant({ name: 'Kuebar', type: 'Bar' });

// mixAt36 is a new object with name and type properties
var mixAt36 = new Restaurant({ name: 'Mix@36', type: 'Lounge' });

// Extend Appacitive.Connection class
var conRestaurant = Appacitive.Connection.extend('has_restaurant');

// Connect westin with mixAt36
var mixConn = new  conRestaurant({
    endpoints: [{
      label: 'hotel',
      object: westin //instance of Appacitive.Object hotel type
    }, {
      label: 'restaurant',
      object: mixAt36   //instance of Appacitive.Object restaurant type
    }]
});

// Connect westin with kuebar 
var kueConn = new  conRestaurant({
    endpoints: [{
      label: 'hotel',
      object: westin //instance of Appacitive.Object hotel type
    }, {
      label: 'restaurant',
      object: kuebar  //instance of Appacitive.Object restaurant type
    }]
});

// Save kueBar 
kuebar.save().then(function() {
  
  // kuebar is an existing object and we're updating the type
  kuebar.set('type', 'Restaurant & Bar');

  // Create Batch class Object
  var batch = new Appacitive.Batch();

  // Add the objects that you want to save or update
  batch.add(westin);
  batch.add(mixAt36);
  batch.add(kuebar);

  // Add connections to the batch
  batch.add([kueConn, mixConn]);

  // Call execute to fire the request
  batch.execute().then(function() {
    console.log(westin.get('name'));  //Westin
    console.log(kuebar.get('type'));  //Restaurant & Bar'
    console.log(mixAt36.get('type')); //Lounge
    console.log(mixAt36.get('name')); //Mix@36
  });
}, function(error) {
    console.log(error);
});
```

In creating connections via batched calls, you can always create connections between existing objects or use one existing object and a new object. 

You can also update multiple connections in a single call by passing connections into the batch request which have their id property set. You can mix and match object create and update and connection create and update requests in a single call.

## Delete Objects and Connections

Batch also supports deleting objects and connection in the same transaction. In the previous example, we created and updated restaurant and hotel objects. Now, we will delete some objects and connection created previously.


```javascript
var batch = new Appacitive.Batch();

// Change rating in existing westin object and add it to batch
westin.set('rating', 4);
batch.add(westin);

// Delete mixAt36 restaurant with its connections
batch.deleteObjects(mixAt36, true);
          OR
// Delete multiple restaurant with their connections
batch.deleteObjects(["214214214214", mixAt36], 'restaurant', true);


// Delete has_restaurant connection kuebarConn 
batch.deleteConnections(kuebarConn);
          OR
// Delete multiple has_restaurant connections
batch.deleteConnections([kuebarConn, "90723993297", mixConn], 'has_restaurant');

// Execute batch request 
batch.execute();
```

In above example, we can either pass a sinlge object/connection or pass an array of objects/connections to delete methods. In case of an array you a either pass the object itself or pass the ids. If you pass ids you need to expicitly pass the typeName/relationName of the objects/connection as second argument to the methods `deleteObjects` and `deleteConnections`.

For `deleteObjects` you can also pass a third/second argument `deleteConnections` depending on whether you pass ids or objects. This argument specifies whether you want to delete its connections if they exist.

# Queries

Searching in SDK is done via `Appacitive.Queries` object. You can retrieve objects at once, put conditions on the objects you wish to retrieve, and more.

```javascript

var filter = Appacitive.Filter.Property("firstname").equalTo("John");

var query = new Appacitive.Queries.FindAllQuery(
  type: 'player', //mandatory 
  //or relation: 'friends'
  fields: ['*'],      //optional: returns all user fields only
  filter: filter,   //optional  
  pageNumber: 1 ,   //optional: default is 1
  pageSize: 20,     //optional: default is 50
  orderBy: '__id',  //optional: default is by relevance
  isAscending: false  //optional: default is false
}); 

// success callback
var successHandler = function(players) {
  //`players` is `PagedList` of `Object`

  console.log(players.total); //total records for query
  console.log(players.pageNumber); //pageNumber for this set of records
  console.log(players.pageSize); //pageSize for this set of records

  // fetching other left players
  if (!players.isLastPage) {
    // if this is not the last page then fetch further records 
    query.fetchNext().then(successHandler);
  }
};

// make a call
query.fetch().then(successHandler);

```

You can also use these queries directly from your extended classes for relations and types, which also return a query.

```javascript
//for type
var Player = Appacitive.Object.extend('player');
var query = Player.findAllQuery(
  fields: ['*'],      //optional: returns all user fields only
  filter: filter,   //optional  
  pageNumber: 1 ,   //optional: default is 1
  pageSize: 20,     //optional: default is 50
  orderBy: '__id',  //optional: default is by relevance
  isAscending: false  //optional: default is false
}); 

// for relation
var Player = Appacitive.Connection.extend('friends');
var query = Player.findAllQuery(
  fields: ["*"],      //optional: returns all user fields only
  filter: filter,   //optional  
  pageNumber: 1 ,   //optional: default is 1
  pageSize: 20,     //optional: default is 50
  orderBy: '__id',  //optional: default is by relevance
  isAscending: false  //optional: default is false
}); 

```
Go ahead and explore the query returned. The query contains a private object which is an instance of the `Appacitive.HttpRequest` class which we'll disccus ahead . This request gets transformed into an actual ajax request and does the fetching. In case you are interested in the actual rest endpoints, fire the `toRequest` method on the query. This will return a representation of the http request.

## Modifiers

Notice the `pageSize`, `pageNumber`, `orderBy`, `isAscending`, `filter`, `fields`  and `freeText` in the query? These're the options that you can specify in a query. Lets get to those.

### Pagination

All queries on the Appacitive platform support pagination and sorting. To specify pagination and sorting on your queries, you need to access the query from within the collection and set these parameters. By default, the page size for results is 20. This is capped to a max value of 200 for performance reasons.

```javascript
var query = new Appacitive.Queries.FindAllQuery({ 
  type: 'person' // or relation: 'friends'
});

//set pageSize
query.pageSize(30);
//get pageSize
alert(query.pageSize()); // will print 30

//set pageNumber
query.pageNumber(2);
//get pageNumber
alert(query.pageNumber()); // will print 2

people.fetch().then(function() {
    // this is the 2nd page of results
    // where each page is 10 results long
});
```
**Note**: By default, pageNumber is 1 and pageSize is 50

### Sorting

Queries can be sorted similarly. Lets take the same example from above:
```javascript
var query = people.query();

//set orderBy to specify the field on which you want to sort
query.orderBy('name');
//get orderBy
alert(query.orderBy()); //will print name

//set whether sortOrder is ascending or not 
query.isAscending(true);
//get orderBy
alert(query.isAscending()); // will print true
```

### Fields

You can also mention exactly which all fields should be returned in query results. 

Fields `__id` and `__type`/`__relationtype`  are the fields which will always be returned. 
```javascript
//set fields
query.fields(["name", "age", "__createby"]); //will set fields to return __id, __type, name, age and __createdby

query.fields([]); //will set fields to return only __id and __type
query.fields(["*"]); //will set fields to return all user-defined properties and __id and __type
```
**Note**: By default fields is set as empty, so it returns all fields.

### Filter

Filters are useful for fine tuning the results of your search. Objects and connections inside Appacitive have 4 different types of data, namely - [properties](#properties), [attributes](#attributes), aggregates and [tags](#tags). Filters can be applied on each and every one of these. Combinations of these filters is also possible.

The `Appacitive.Filter` class provides a factory for creating filters for appacitive without having to learn the specialized query format used by the underlying REST api.
The typical format for the filter helper class is
```javascript
Appacitive.Filter.{Property|Attribute|Aggregate}("name").<Condition>(condition args);
```
Some sample examples of how it can be used are
```javascript
// To filter on a property called firstname
var propfilter = Appacitive.Filter.Property("firstname").equalTo("John");

// To query on an attribute called nickname
var propfilter = Appacitive.Filter.Attribute("nickname").equalTo("John");

// To query on an aggregate called avg_rating
var aggrFilter = Appacitive.Filter.Aggregate("avg_rating").greaterThan(4.5);
```

In response it returns you an expression object, which has all the conditional methods that can be applied for respective property/ attribute/aggregate. 

This expression object, can be directly assigned to a query as:

```javascript
query.filter(propfilter);

//you can also set it as
query.filter(new Appacitive.Filter.Property('firstname').equalTo('John'));

// format in underlying REST api.
console.log(propFilter.toString()); // *firstname == 'john'
```

### List of supported conditions

| Condition    | Sample usage |
| ------------- |:-----|
| isNull() | ```Appacitive.Filter.Property("name").isNull();``` |
| **Geography properties** ||
| withinPolygon() | ``` Appacitive.Filter.Property("loc").withinPolygon(geocodes); ```
| withinCircle() | ```Appacitive.Filter.Property("loc").withinCircle(geocode, radius, unit); ```|
| equalTo() | ```Appacitive.Filter.Property("location").equalTo(geocode);``` |
| **String properties** ||
| startsWith() | ```Appacitive.Filter.Property("name").startsWith("Ja"); ```|
| match()  | ```Appacitive.Filter.Property("description").match("roam~0.8"); ```|
| endsWith() | ```Appacitive.Filter.Property("name").endsWith("ne"); ``` |
| equalTo() | ```Appacitive.Filter.Property("name").equalTo("Jane"); ``` |
| notEqualTo() | ```Appacitive.Filter.Property("name").notEqualTo("Jane"); ``` |
| containedIn() | ```Appacitive.Filter.Property("name").containedIn([value1, value1]);``` |
| **Text properties** ||
| match()  |```Appacitive.Filter.Property("description").match("roam~0.8"); ```|
| **Datetime, int and decimal properties** ||
| equalTo() | ```Appacitive.Filter.Property("field").equalTo(value);``` |
| notEqualTo() | ```Appacitive.Filter.Property("field").notEqualTo(value);``` |
| lessThan() | ```Appacitive.Filter.Property("field").lessThan(value);``` |
| lessThanEqualTo() | ```Appacitive.Filter.Property("field").lessThanEqualTo(value);``` |
| greaterThan() | ```Appacitive.Filter.Property("field").greaterThan(value);``` |
| greaterThanEqualTo() | ```Appacitive.Filter.Property("field").greaterThanEqualTo(value);``` |
| between() | ```Appacitive.Filter.Property("field").between(start, end);``` |

** Supports [Lucene query parser syntax](http://lucene.apache.org/core/2_9_4/queryparsersyntax.html)
<br/>

```javascript
//First name like "oh"
var likeFilter = Appacitive.Filter.Property("firstname").match("oh");

//First name starts with "jo"
var startsWithFilter = Appacitive.Filter.Property("firstname").startsWith("jo");

//First name ends with "oe"
var endsWithFilter = Appacitive.Filter.Property("firstname").endsWith("oe");

//First name matching several different values
var containsFilter = Appacitive.Filter.Property("firstname").containedIn(["John", "Jane", "Tarzan"]);

//Between two datetimeobjects
var start = new Date("12 Dec 1975");
var end = new Date("12 Jun 1995");
var betweenDatesFilter = Appacitive.Filter.Property("birthdate").between(start, end);

//Between two datetime objects
var betweenDateTimeFilter = Appacitive.Filter.Property("__utclastupdateddate").between(start, end);

//Between some two numbers
var betweenFilter = Appacitive.Filter.Property("age").between(23, 70);

//Greater than a datetime
var greaterThanDateTimeFilter = Appacitive.Filter.Property("birthdate").greaterThan(start);

//greater then some number 
var greaterThanFilter = Appacitive.Filter.Property("age").greaterThan(25);

//Same works for greaterThanEqualTo
//and for lessThan
//and for lessThanEqualTo
//and for equalTo
```

### Compound Filters

Compound filters allow you to combine multiple filters into one single query. Multiple filters can be combined using `Appacitive.Filter.Or` and `Appacitive.Filter.And` operators. NOTE: All types of filters with the exception of free text filters can be combined into a compound query.

The example below demonstrates how to join two separate filters.

```javascript
//Use of `And` and `Or` operators
var center = new Appacitive.GeoCoord(36.1749687195, -115.1372222900);

//AND filter
var complexFilter = 
      Appacitive.Filter.And(
          //OR filter
          Appacitive.Filter.Or( 
             Appacitive.Filter.Property("firstname").startsWith("jo"),
             Appacitive.Filter.Property("lastname").like("oe")
          ),
          Appacitive.Filter.Property("location")
              .withinCircle(center, 
                      10, 
                      'mi') // can be set to 'km' or 'mi'
      );
```
Or you can do it as
```javascript
var complexFilter = Appacitive.Filter.Property("firstname").startsWith("jo")
          .Or(Appacitive.Filter.Property("lastname").match("oe"))
          .And(Appacitive.Filter.Property("location").withinCircle(center, 10, 'mi')) 
          
//create query object
var Player = Appacitive.Object.extend('player');
var query = Player.findAllQuery();

//or without extending
var query = new Appacitive.Queries.FindAllQuery({
  type: 'player'
});

//set filter in query
query.filter(complexFilter);

//add more filters
query.filter(query.filter.And( Appacitive.Filter.Property('gender').equalTo('male')));

//fire the query
query.fetch();
```

## Geolocation

Appacitive supports geolocations, allowing you to save and search geo data. You can specify a property type as a `geography` type for a given type or relation. 

### GeoPoint

`Appacitive.GeoCoord` is a simple wrapper around lat and lon coordinates. It's used in geolocation queries and in setting property values.

```javascript
var geopoint = new Appacitive.GeoCoord(lat, lon);
 
lat: the latitude coordinates. Range: -90, 90 
lon: the longitude coordinates. Range: -180, 180
```

Let's create a geography property and save it as `location` in type `hotel`. We'll use the `Appacitive.GeoCoord` object to help with creating the property. It's a helper object that will convert the geopoint data to the string format we need via toString.

```javascript
//for example

var Hotel = Appacitive.Object.extend('hotel'); 
  
var location = new Appacitive.GeoCoord(16.734, 80.3423); //lat, lon
// you can assign geocoord objects directly to properties
var hilton = new Hotel({ name: 'Hotel Hilton', location: location }); 

//or set it in object
hilton.set('location', location);

// or set it as raw in object
hilton.set('location', '16.734, 80.3423');

hilton.save().then(function(obj) {
    // will display 16.734, 80.3423
    alert(hilton.get('location').toString()); 

    // will return you an instance of Appacitive.GeoCoord type
    var loc = hilton.get('location'); 

    alert("Latitude: " + loc.lat() + ', longitude: ' + loc.lng());
});
  
location.toJSON();

Returns a JSON representation of the lat long coordinates:

{
  latitude: 16.734,
  longitude: 80.3423
}

```

These properties are essential latitude-longitude pairs. Such properties support geo queries based on a user defined radial or polygonal region on the map. These are extremely useful for making map based or location based searches. E.g., searching for a list of all restaurants within 20 miles of a given users locations.

### Radial Search

A radial search allows you to search for all records of a specific type which contain a geocode which lies within a predefined distance from a point on the map. A radial search requires the following parameters.

```javascript
//create Appacitive.GeoCoord object
var center = new Appacitive.GeoCoord(36.1749687195, -115.1372222900);

//create filter
var radialFilter = Appacitive.Filter.Property('location').withinCircle(center, 10, 'km');

//create query object
var Hotel = Appacitive.Object.extend('hotel');

var query = Hotel.findAllQuery({
  filter: radialFilter
});


// or without extending
var query = new Appacitive.Object.FindAllQuery({
  type: 'hotel',
  filter: radialFilter
});

//or set it in an existing query
query.filter(radialFilter);

query.fetch();
```

### Polygon Search

A polygon search is a more generic form of geographcal search. It allows you to specify a polygonal region on the map via a set of geocodes indicating the vertices of the polygon. The search will allow you to query for all data of a specific type that lies within the given polygon. This is typically useful when you want finer grained control on the shape of the region to search.

```javascript
//create Appacitive.GeoCoord objects
var pt1 = new Appacitive.GeoCoord(36.1749687195, -115.1372222900);
var pt2 = new Appacitive.GeoCoord(34.1749687195, -116.1372222900);
var pt3 = new Appacitive.GeoCoord(35.1749687195, -114.1372222900);
var pt4 = new Appacitive.GeoCoord(36.1749687195, -114.1372222900);
var geocodes = [ pt1, pt2, pt3, pt4 ];

//create polygon filter
var polygonFilter = Appacitive.Filter.Property("location")
                                         .withinPolygon(geocodes);


//create query object
var Hotel = Appacitive.Object.extend('hotel');
var query = Hotel.findAllQuery();

// or without extending
var query = new Appacitive.Object.FindAllQuery({
  type: 'hotel'
});

//or set it in an existing query
query.filter(polygonFilter);

//call fetch
query.fetch();
```

## Tag Based Searches

The Appacitive platform provides inbuilt support for tagging on all data (objects, connections, users and devices). You can use this tag information to query for a specific data set. The different options available for searching based on tags is detailed in the sections below.

### Query data tagged with one or more of the given tags

For data of a given type, you can query for all records that are tagged with one or more tags from a given list. For example - querying for all objects of type message that are tagged as personal or private.

```javascript
//create the filter 
//accepts an array of tags
var tagFilter = Appacitive.Filter
                      .taggedWithOneOrMore(["personal", "private"]);

//create the query
var Message = Appacitive.Object('message');
var query = Message.findAllQuery({
  filter: tagFilter
});

//or withour extending
var query = new Appacitvie.Filter.FindAllQuery({
  type: 'message',
  filter: tagFilter
});

//or set it in an existing query
query.filter(tagFilter);

//call fetch
query.fetch();
```

### Query data tagged with all of the given tags

An alternative variation of the above tag based search allows you to query for all records that are tagged with all the tags from a given list. For example, querying for all objects of type message that are tagged as personal AND private.

```javascript
//create the filter 
//accepts an array of tags
var tagFilter = Appacitive.Filter
                          .taggedWithAll(["personal", "test"]);

//create the query
var Message = Appacitive.Object('message');
var query = Message.findAllQuery({
  filter: tagFilter
});

//or withour extending
var query = new Appacitvie.Filter.FindAllQuery({
  type: 'message',
  filter: tagFilter
});

//or set it in an existing query
query.filter(tagFilter);

//call fetch
query.fetch();
```

## FreeText

There are situations when you would want the ability to search across all text content inside your data. Free text queries are ideal for implementing this kind of functionality. As an example, consider a free text lookup for users which searches across the username, firstname, lastname, profile description etc.You can pass multiple values inside a free text search. It also supports passing certain modifiers that allow you to control how each search term should be used. This is detailed below.

```javascript
//create the query
var Message = Appacitive.Object.extend('message');
var query = Message.findAllQuery({
  freeText: 'champs palais'
});

//or without extending
var query = new Appacitvie.Filter.FindAllQuery({
  type: 'message',
  freeText: 'champs palais'
});

//or set it in the query
query.freeText('champs palais');

//call fetch
query.fetch();
```

## Counts

You can always count the number of records for a search, instead of retreiving all records

```javascript
var query = new Appacitive.Filter.FindAllQuery({
  type: 'message',
  freeText: 'champs palais'
});

query.count().then(function(noOfRecords) {
  //There're noOfRecords for above query
});
```

# Data Types

Data is stored in the form of object in appacitive, they conform to their parent type and contain properties, attributes and tags. 

## Properties

The properties are key value pairs whose values should conform to the businesss validations defined on the parent type. 

So far we've stored and retrived all our data in properties of object using `set` and `get` methods. This data is more specific to what you've specified in your model. 

We've designed the Javascript SDK in such a way that you typically don't need to worry about how data is saved while using the sdk. Simply add data to the `Appacitive.Object`, and it'll be saved correctly.

Nevertheless, there are some cases where it's useful to be aware of how data is stored on the Appacitive platform.

Internally, Appacitive stores data as JSON, so any datatype that can be converted to JSON can be stored on Parse. Overall, the following types are allowed for each field in your object:

* string
* integer
* decimal
* boolean
* datetime
* text
* multivalued string (array of string values)
* multivalued integer (array of integer values)
* multivalued decimal (array of decimal values)

For example, for type player we had defined following properties:

* `firstname`: string
* `lastname`: string
* `age`: integer
* `score`: integer
* `hobbies`: multivalued string

Our SDK handles translating native javascript types to JSON. For example, if you save an `date` object, it will be translated into a Datetime type in our system.

Object Keys starting with the characters $ or __, for example __type/__id, are reserved for the framework to handle additional types, so don't use those yourself.

### Multivalued Properties

To help with storing array data, there are three operations that can be used to atomically change an array associated with a given key:

* `add`: append the given object to the end of an array field.
* `addUnique`: add the given object only if it isn't already contained in an array field. The position of the insert is not guaranteed.
* `remove`: remove all instances of the given object from an array field.

For more information on multivalued properties click <a href="#arrays">here</a>

## Data Type Constraints

Appacitive doesn't allow a user to create types and relation on the fly. Thus, you need to define your model and their properties on <a href="https://portal.appacitive.com">Appacitive Portal</a>.

When a property for a type or relation is defined, that property is constrained to the data-type that you specfied when it was saved. For example, if a User object is saved with field `name` of data-type `String`, that field will be restricted to the String type only (our SDK will return an error if you try to save anything else).

One special case is that any field can be set to null, no matter what type it is.

## Attributes

The basic distinction between Properties and Attributes is that Properties are defined by a type and respect the rules defined on them; whereas Attributes are just key value pairs of type string. This means you can have 'n' number of Attributes in an Object or Connection.

Now, consider we want to add some additional properties which we haven't defined in our model, you can set them in attributes

```javascript
// Set attribute level
player.attr('level', '2');

// Get attribute level
player.attr('level')

// Get all attributes
player.attr();

// Remove attribute level
player.attr('level', null);
```

## Tags

The Appacitive platform provides inbuilt support for tagging on all data (objects, connections, users and devices). You can use this tag information to query for a specific data set.

```javascript
// Add a tag to player
player.addTag('expert');

// Remove a tag from player
player.removeTag('beginner');

// Get all tags
player.tags();  // returns ['expert']
``` 

Tag values are of string data type

# Collections

`Appacitive.Collection` is an ordered set of Appacitive.Objects. It is compatible with [Backbone.Collection](http://backbonejs.org/#Collection), and has all the same functionality. You can create a new subclass using either a model class, or particular `Appacitive.Queries`.

## Extending Collection

To create a Collection class of your own, extend Appacitive.Collection, providing model, instance properties, as well as optional classProperties to be attached directly to the collection's constructor function.

It is mandatory to specify the model class that the collection contains. If defined, you can pass raw attributes objects (and arrays) to add, create, and reset, and the attributes will be converted into a model of the proper type.

The model property of Appacitive.Collection should be of `Appacitive.Object` or `Appacitive.Connection` type.

```javascript
// A Collection containing all instances of Player.
var Player = Appacitive.Object.extend('player');
var PlayerCollection = Appacitive.Collection.extend({
  model: Player
});
var collection = new PlayerCollection();
 
// A Collection of Players whose score is greater than 200
var HighScoreCollection = Appacitive.Collection.extend({
  model: Player,
  query: (new Appacitive.Query(Player)).filter(
          Appacitive.Filter.Property('score').greaterThan(200)
          )
});
var collection = new HighScoreCollection();
 
// The Collection of Players that match a complex query.
var query = Player.findAllQuery();
var scoreFilter = Appacitive.Filter.Property("score").greaterThan(200);
var levelFilter = Appacitive.Filter.Property("level").between(5, 10);
query.filter(Appacitive.Filter.And(scoreFilter, levelFilter));
var collection = query.collection();
```

## Fetching Collections

To fetch the default set of models for this collection from the server, setting them on the collection when they arrive. 

```javascript
var collection = new PlayerCollection();

// Using callbacks
collection.fetch({
  success: function(collection) {
    collection.each(function(object) {
      console.log(object);
    });
  },
  error: function(error, collection) {
    console.log(error.message);
  }
});

// using promises
var collection = new PlayerCollection();
collection.fetch().then(function(collection) {
                        collection.each(function(object) {
                          console.log(object);
                        });
                      }, function(error, collection) {
                        console.log(error.message);
                      });
```

You can also fetch paginated collections with the help  of `fetchNext` and `fetchPrev`.

```
var options = { 
  reset : false  //To add objects to the collection instead of resetting it
};  
collection.fetchNext(options);
collection.fetchPrev(options);
```

## Creating, Adding and Removing Items

You can create, add and remove objects/connection from a collection.

### Create

Provides convenience to create a new instance of a model within a collection. It is equivalent to instantiating a model with a hash of attributes, saving the model to the server, and adding the model to the set after being successfully created.

The create method can accept either an attributes hash or an existing, unsaved model object.

```javascript
var Player = Appacitive.Object.extend('player', {
  constructor: function(attrs) { 

    if (attrs.name) {
        attrs.firstname = attrs.name.split(' ')[0];
        attrs.lastname = attrs.name.split(' ')[1];
    }

    //Invoke internal constructor
    this.base.call(this, atts); 
  },
});
var PlayerCollection = Appacitive.Collection.extend({
  model: Player
});
var collection = new PlayerCollection();

var john = collection.create({
  name: 'john doe'
});
```

### Add and Retreive

You can add an object (or an array of objects) to the collection, firing an "add" event. You may also pass raw attribute objects, and have them be vivified as instances of the object.

If you're adding objects to the collection that are already in the collection, they'll be ignored, unless you pass {merge: true}, in which case their attributes will be merged into the corresponding object.

```javascript
var PlayerCollection = Appacitive.Collection.extend({
  
  model: Player,
  
  //Sort on score
  comparator: function(object) {
    return object.get('score');
  }
});
var collection = new PlayerCollection();

collection.add([
  { name: 'John Doe', score: 200 }, 
  { name: 'Jane Doe', score: 300 }
]);

// Get "jane" Appacitive.Object by its sorted position.
var jane = collection.at(0);

// Or you can get it by Appacitive id.
var janeCopy = collection.get(jane.id);
 
```

### Reset and Remove

This method removes a model (or an array of models) from the collection, and returns them. Fires a "remove" event.

```javascript
// Remove "jane" from the collection.
collection.remove(jane);
```

Adding and removing objects one at a time is all well and good, but sometimes you have so many objects to change that you'd rather just update the collection in bulk. Use reset to replace a collection with a new list of objects (or attribute hashes), triggering a single "reset" event at the end.

```javascript
// Completely replace all items in the collection.
collection.reset([
  { name: 'Stacy Doe', score: 40 }, 
  { name: 'James Doe', score: 350 }
]);
```
