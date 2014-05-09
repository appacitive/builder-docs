# Data Store

## Objects

All data is represented as *objects*. This will become clearer as you read on. Let's assume that we are building a game and we need to store player data on the server.

### Creating objects

To create a player via the SDK, do the following

```
	AppacitiveObject john = new AppacitiveObject("player");
```

An **AppacitiveObject** is any data entity (referred to as *object* in Appacitive jargon) on your backend. To initialize an object, we need to provide it some options. The mandatory argument is the *__type* argument.

What is a __type? 
In short, think of types as tables in a contemporary relational database. A type has properties which hold values, just like columns in a table. A property has a data type, and additional constraints are configured according to your application's need. 

Thus, we are specifying that *john* represents a *player* for your game. The type *player* should already be defined in your application through the management portal.

The *player* object is an instance of **AppacitiveObject**. An AppacitiveObject is a class which encapsulates the data (the actual entity or the object) and methods that provide ways to update it, delete it etc.

### Setting values

Now we need to name our player 'John Doe'. This can be done as follows,

```
	AppacitiveObject john = new AppacitiveObject("player");
	john.setStringProperty("name", "John Doe");
```

### Getting values

Lets verify that our player is indeed called 'John Doe',

```
String name = john.getPropertyAsString("name");
```

### Saving

Saving a player to the server is easy.

```
        AppacitiveObject john = new AppacitiveObject("player");
        john.setStringProperty("name", "John Doe");
        john.setIntProperty("age", 23);
        john.createInBackground(new Callback<AppacitiveObject>() {
            @Override
            public void success(AppacitiveObject createdObject) {
                System.out.println("Player created with id " + createdObject.getId());
            }
        });
```

When you call save, the object is stored on Appacitive's servers. A unique object *id* is generated and is stored along with the *player* object. This identifier is also returned within the object on the client-side. You can access it directly using `getId()` property. This is available in the *player* object after a successful save.

### Retrieving

You can retrieving an existing object from the backend using it's *type* and unique *id*.

```
        long playerId = 12345;
        List<String> fields = null;
        AppacitiveObject.getInBackground("player", playerId, fields, new Callback<AppacitiveObject>() {
            @Override
            public void success(AppacitiveObject player) {
                //  Player with id 12345 was retrieved from the server
            }
        });
```

If you want to update an object and need a reference to it without making a call to the server, you can create a new instance by passing the *type* and *id* in the constructor. This instance is a loose reference to the object on the server side without actually making a call to the backend.

```
        // Retrieve the player
        // The existingPlayer object represents the player object with id 12345.
        long existingPLayerId = 12345;
        AppacitiveObject existingPlayer = new AppacitiveObject("player", existingPLayerId);
```

**Note:** You can mention exactly which all fields (defined by you or system defined) you want returned so as to reduce the overall payload size. By default all fields are returned. Fields *Id* and *Type* are the fields which will always be returned.

```
		// You can choose to get specific fields only by passing the fields needed.
		// The following sample will get only the name and age fields.

        List<String> fields = new ArrayList<String>(){{
            add("name");
            add("age");
        }};

        AppacitiveObject.getInBackground("player", 12345, fields, new Callback<AppacitiveObject>() {
            @Override
            public void success(AppacitiveObject player) {

            }
        });

```

You can also retrieve multiple objects at a time, which will return a collection of *AppacitiveObject* instances. Just make sure all objects are of the same type. Here's an example,

```
        List<String> fields = new ArrayList<String>(){{
            add("name");
            add("age");
        }};

        List<Long> playerIds = new ArrayList<Long>(){{
            add(12345L);
            add(98765L);
        }};

        AppacitiveObject.multiGetInBackground("player", playerIds, fields, new Callback<List<AppacitiveObject>>() {
            @Override
            public void success(List<AppacitiveObject> players) {
                
            }
        });
```

### Updating

You can update an existing object via the `updateInBackground()` instance method on *AppacitiveObject*. Saving an object will update the instance with the latest values from the server. 

```
        //  We will retrieve an object of type player with id 12345, 
        //  update his name and age and save our changes on the server

        AppacitiveObject.getInBackground("player", 12345, null, new Callback<AppacitiveObject>() {
            @Override
            public void success(AppacitiveObject player) {
                player.setStringProperty("name", "Jack");
                player.setIntProperty("age", 35);
                player.updateInBackground(false, new Callback<AppacitiveObject>() {
                    @Override
                    public void success(AppacitiveObject updatedPlayer) {
                        
                    }
                });
            }
        });
```

#### Handling concurrent updates

It is possible that multiple clients may be updating the same *object* instance on the backend. To prevent any accidental bad writes, Appacitive provides a *revision number* based [Multi Version Concurrency Control (MVCC)](http://en.wikipedia.org/wiki/Multiversion_concurrency_control) mechanism.

Every object instance has a integer based *__revision* property which is internally incremented on each update by the system. If you want to ensure that you are always updating the latest version of the object, you can choose to send the revision number you have with the update call. If this revision number matches the revision on the server, the update will be allowed. In case the revision number does not match, it implies that the object has changed since you last read it, and the update will be cancelled.

```
        //  We will retrieve an object of type player with id 12345,
        // update his name and age and save our changes on the server
        AppacitiveObject.getInBackground("player", 12345, null, new Callback<AppacitiveObject>() {
            @Override
            public void success(AppacitiveObject player) {
                player.setStringProperty("name", "Jack");
                player.setIntProperty("age", 35);
                boolean updateWithRevision = true;
                player.updateInBackground(updateWithRevision, new Callback<AppacitiveObject>() {
                    @Override
                    public void success(AppacitiveObject updatedPlayer) {

                    }
                });
            }
        });
```

**Note:** A helper method called `fetchLatestInBackground()` has been provided for you to fetch the latest copy of the object/connection/user/device on the client side.

### Deleting

You can delete an *AppacitiveObject* via the `deleteInBackground()` method on the *AppacitiveObject* helper class. Let's say we've had enough of our *John Doe* and want to delete his player account from the server. Here's how you can do that,

```
        //  Delete John Doe using a handle on the object
        player.deleteInBackground(false, new Callback<Void>() {
            @Override
            public void success(Void result) {

            }
        });

        //  Delete John Doe using his id
        long id = 12345;
        AppacitiveObject.deleteInBackground("player", id, false, new Callback<Void>() {
            @Override
            public void success(Void result) {
                
            }
        });

```

You can also delete object along with all its first degree connections. Note that this will only delete the connections and not the connected objects.

```
        boolean deleteConnections = true;
        AppacitiveObject.deleteInBackground("player", 12345, deleteConnections, new Callback<Void>() {
            @Override
            public void success(Void result) {

            }
        });
```

Multiple objects can also be deleted with a single call. The *delete connections* options is **not** available for bulk-deletes. All the objects to be deleted in a single call should belong tho the **same** type. Also they should **not** have any connections. Here's an example,

```
        List<Long> playerIds = new ArrayList<Long>(){{
            add(12345L);
            add(98765L);
        }};
        
        AppacitiveObject.bulkDeleteInBackground("player", playerIds, new Callback<Void>() {
            @Override
            public void success(Void result) {
                
            }
        });
```


----------


## Connections

All data that resides in the Appacitive platform is relational, like in the real world. This means you can do operations like fetching *all* games that any particular player has played, adding a new player to a team or disbanding a team whilst still keeping the other teams and their *players* data perfectly intact.

Two entities can be connected via a `relation`, for example two entities of type *person* might be connected via a relation *friend* or *enemy* and so on. An entity of type *person* might be connected to an entity of type *house* via a relation *owns*.

Relations, like types, can contain *user defined properties* for you to store any additional business data for each connection of that relation. You can create your relations from the management portal.

One more thing to understand is the concept of `labels`. Consider an entity of type *person*. This entity is connected to another *person* via relation *marriage*. Within the context of the relation *marriage*, one *person* is the *husband* and the other is the *wife*. Similarly the same entity can be connected to an entity of type *house* via the relation *house_owner*. In context of this relation, the entity of type *person* can be referred to as the *owner*.

*Wife*, *husband* and *owner* from the previous example are `labels`. Labels are used within the scope of a relation to give contextual meaning to the entities involved in that relation. They have no meaning or impact outside of the relation.

Let's jump in!

### Creating and saving

The SDK provides a very fluent interface for creating connections. You can mix and match various options, to create a connection for your specific application scenario.

#### New Connection between two existing Objects


```
        // Create a connection of relation marriage on the server between john and mary
        long johnId = 12345;
        long janeId = 98765;

        new AppacitiveConnection("marriage")
                    .fromExistingObject("husband", johnId)
                    .toExistingObject("wife", janeId)
                .createInBackground(new Callback<AppacitiveConnection>() {
                    @Override
                    public void success(AppacitiveConnection marriageConnection) {
                        System.out.println(marriageConnection.getId());
                    }
                });
```

## Querying