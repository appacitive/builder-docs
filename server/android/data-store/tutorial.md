# Data Store

This is the core feature of the Appacitive Backend. It consists of *objects* and *connections* between them. 
 
## Objects

All data is represented as *objects*. This will become clearer as you read on. Let's assume that we are building a game and we need to store player data on the server.

### Creating objects

To create a player via the SDK, do the following

```
	AppacitiveObject john = new AppacitiveObject("player");
```

An **AppacitiveObject** is any data entity (referred to as *object* in Appacitive jargon) on your backend. To initialize an object, we need to provide it some options. The mandatory argument is the *__type* argument.

What is a *__type*? 
In short, think of *types* as tables in a contemporary relational database. A *type* has *properties* which hold values, just like columns in a table. A *property* has a data type, and additional constraints are configured according to your application's need. 

Thus, we are specifying that *john* represents a type of *player* for your game. The type *player* should already be defined in your application through the management portal.

The *player* object is an instance of **AppacitiveObject**. An **AppacitiveObject** is a class which encapsulates the data (the actual entity or the object) and methods that provide ways to update it, delete it etc.

### Setting values

Now we need to name our *player* 'John Doe'. This can be done as follows,

```
	AppacitiveObject john = new AppacitiveObject("player");
	john.setStringProperty("name", "John Doe");
```

### Getting values

Lets verify that our *player* is indeed called 'John Doe',

```
String name = john.getPropertyAsString("name");
```

### Saving

Saving a *player* to the server is easy.

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

When you call `createInBackground()`, the object is created on Appacitive's servers. A unique object *id* is generated and assigned to the *player* object. This identifier is also returned within the *object* on the client-side. You can access it directly using `getId()` property. This is available in the *player* object after a successful save.

### Retrieving

You can retrieving an existing *object* from the backend using it's *type* and unique *id*.

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

If you want to update an *object* and need a reference to it without making a call to the server, you can create a new instance by passing the *type* and *id* in the constructor. This instance is a loose reference to the object on the server side without actually making a call to the backend.

```
        // Retrieve the player
        // The existingPlayer object represents the player object with id 12345.
        long existingPLayerId = 12345;
        AppacitiveObject existingPlayer = new AppacitiveObject("player", existingPLayerId);
```

**Note:** You can mention exactly which all fields (defined by you or system-defined fields) you want returned so as to reduce the overall payload size. By default all fields are returned. Fields *Id* and *Type* are the fields which will always be returned.

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

You can also retrieve multiple *objects* at a time, which will return a collection of `AppacitiveObject`` instances. Just make sure all objects are of the same type. Here's an example,

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

You can update an existing object via the `updateInBackground()` instance method on `AppacitiveObject`. Saving an object will update the instance with the latest values from the server. 

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

Every object instance has a integer based *__revision* property which is internally incremented on each update by the system. If you want to ensure that you are always updating the latest version of the object, you can choose to send the revision number you have with the update call. If this revision number matches the revision on the server, the update will be allowed. In case the revision number does not match, it implies that the object has changed since you last read it, and the update will be canceled.

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

You can delete an *object* on the server via the `deleteInBackground()` method on the `AppacitiveObject `class. Let's say we've had enough of our *John Doe* and want to delete his *player* object from the server. Here's how you can do that,

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

You can also delete object along with all its *first degree connections*. Note that this will only delete the connections and not the connected objects.

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

All data that resides in the Appacitive platform is relational, like in the real world. This means you can do operations like fetching *all* games that any particular player has played, adding a new *player* to a *team* or disbanding a team whilst still keeping the other teams and their *players* data perfectly intact.

Two entities can be connected via a `relation`, for example two entities of type *person* might be connected via a relation *friend* or *enemy* and so on. An entity of type *person* might be connected to an entity of type *house* via a relation *owns*.

Relations, like types, can contain *user defined properties* for you to store any additional business data for each connection of that relation. You create your relations from the management portal.

One more thing to understand is the concept of `labels`. Consider an entity of type *person*. This entity is connected to another *person* via relation *marriage*. Within the context of the relation *marriage*, one *person* is the *husband* and the other is the *wife*. Similarly the same entity can be connected to an entity of type *house* via the relation *house_owner*. In context of this relation, the entity of type *person* can be referred to as the *owner*.

*Wife*, *husband* and *owner* from the previous example are `labels`. Labels are used within the scope of a relation to give contextual meaning to the entities involved in that relation. They have no meaning or impact outside of the relation.

Connections, like objects, allow you to add *attributes* and *tags* to them.

Let's jump in!

### Creating and saving

The SDK provides a very fluent interface for creating connections. You can mix and match various options, to create a connection for your specific application scenario.

#### New Connection between two existing objects


```
        // Create a connection of relation 'marriage' on the server between objects 'john' and 'mary'
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

If you've read the previous guide, most of this should be familiar. What happens in the `AppacitiveConnection` class is that the *relation* is configured to actually connect the two entities. We provide the *ids* of the two entities to be connected and specify which is which. For example here, **John** is the *husband* and **Jane** is the *wife*.

In case you are wondering why this is necessary then here is the answer, it allows you to structure queries like 'who is John's wife?' and much more. Queries are covered in later guides.

`marriageConnection` is an instance of `AppacitiveConnection` of type *marriage*. This instance has many methods to manipulate the connection object.

#### New connection between two new objects

Apart from connecting existing objects, you can also create and connect new objects in one go. For example, say I want to create an *order* and its *invoice* in one go.

```
        // Create 2 new objects of type 'order' and 'invoice'
        final AppacitiveObject order = new AppacitiveObject("order");
        order.setIntProperty("order_number", 555566666);

        final AppacitiveObject invoice = new AppacitiveObject("invoice");
        invoice.setDateProperty("invoice_date", new Date());

        // Create both objects and connect them with a connection of relation type 'invoices' in a single api call
        new AppacitiveConnection("invoices")
                .fromNewObject("order", order)
                .toNewObject("invoice", invoice)
                .createInBackground(new Callback<AppacitiveConnection>() {
                    @Override
                    public void success(AppacitiveConnection result) {
                        System.out.println("Order id : " + order.getId());
                        System.out.println("Invoice id : " + invoice.getId());
                    }
                });
```

This is the recommended way to do it. In this case, the *invoices* relation will create the objects *order* and *invoice* first and then connect them using the relation *invoices*.

As you can probably guess from the examples above, you can change `fromNewObject()` to `fromExistingObject()` and `toNewObject()` to `toExistingObject()`, depending on whether you are connecting an new object or an existing one.

Other methods like `fromExistingUser()`, `toExistingUser()`, `fromNewDevice()` and `toExistingDevice()` are also provided if your relation has *user* or *device* pre defined types on either or both sides.

### Connection properties

Like in the case of *objects*, *connections* can have **user defined properties**, **attributes** and **tags** as well. 

For example, a relation of type *employed* between a *user* and a *company* can contain a property called `joining_date`. This makes sense since the joining date is not a property of the *user* or the *company* in isolation.

Properties in connections work exactly in the same way as they work in objects.

### Retrieving

#### Get connection by id

```
        AppacitiveConnection.getInBackground("marriage", 12345, null, new Callback<AppacitiveConnection>() {
            @Override
            public void success(AppacitiveConnection connections) {
                
            }
        });
```

The `AppacitiveConnection` object is similar to the `AppacitiveObject`, except you get one new field viz. *endpoints*. *Endpoints* represent the two *objects* that the connection links.

```
        long idForJohn = 12345;
        long idForJane = 98765;
        
        new AppacitiveConnection("marriage")
                .fromExistingObject("husband", idForJohn)
                .toExistingObject("wife", idForJane)
                .createInBackground(new Callback<AppacitiveConnection>() {
                    @Override
                    public void success(AppacitiveConnection marriage) {
                        AppacitiveObject john = (AppacitiveObject)marriage.endpointA.object;
                        AppacitiveObject jane = (AppacitiveObject)marriage.endpointB.object;
                    }
                });
```

#### Get connected objects

Consider you want to get a list of all people who are friends of John. Essentially, what you want is all *objects* of type *person* who are connected to John via the relation *friend*.

```
        AppacitiveObject john = new AppacitiveObject("person", 12345);

        //  Returns a paged list of friends
        // We are assuming that the labels for the friend relationship is the same for both endpoints as a friend relationship is not directed.
        john.getConnectedObjectsInBackground("friend", null, null, new Callback<ConnectedObjectsResponse>() {
            @Override
            public void success(ConnectedObjectsResponse connectedObjectsResponse) {
                
            }
        });
```

**NOTE:** In case the *relation* you are querying is between the same *type* with different *labels*, then you must provide the label of the object that you are querying. Example, consider the relationship father between person objects. In this relationship, the same object can participate as the father as well as the child with different objects. When querying the father connection for John, you will need to specify the label as father to get a list of all John's children.

In all other scenarios, passing a label is optional.

#### Get all Connections for an Endpoint Object Id

Scenarios where you may need to just retrieve all *connections* of a particular *relation* for an *object* id, this query comes to your rescue.

Consider *Jane* is connected to some objects of type *person* via *invite* relationship, that also contains a bool *property* viz. *attending*, which is false by default and will be set to true if that *person* is attending marriage.

Now she wants to know who all are attending her marriage without actually fetching their connected person object, this can be done as

#### Get Connection by Endpoint Object Ids

#### Get all connections between two Object Ids

#### Get Interconnections between one and multiple Object Ids

### Updating

Updating is done exactly in the same way as *objects*, i.e. via the `updateInBackground()` method.

**Important:** Updating the *endpoints* (the `__endpointa` and the `__endpointb` property) will not have any effect and will fail the call. In case you need to change the connected *objects*, you need to delete the *connection* and create a new one.

```
        //  Make a handle to the marriage connection
        AppacitiveConnection marriage = new AppacitiveConnection("marriage", 54321);
        
        //  Update its properties venue and date
        marriage.setStringProperty("venue", "Las Vegas");
        marriage.setDateProperty("date", new Date(2014, 10, 25));

        marriage.setAttribute("theme", "summer");
        marriage.addTag("lilies");
        
        //  Save the update on the server
        marriage.updateInBackground(false, new Callback<AppacitiveConnection>() {
            @Override
            public void success(AppacitiveConnection updatedMarriage) {

            }
        });
```

**Note:** You cannot update any of the system-defined properties (the ones that begin with a double underscore like __id, __type, __createdby etc.). 


### Deleting

You can delete a *connection* using the `deleteInBackground()` method,

```
        //  Deleting a connection using its relation type and id
        AppacitiveConnection marriage = new AppacitiveConnection("marriage", 12345);
        marriage.deleteInBackground(new Callback<Void>() {
            @Override
            public void success(Void result) {

            }
        });

        //  Another way of deleting a connection
        AppacitiveConnection.deleteInBackground("marriage", 12345, new Callback<Void>() {
            @Override
            public void success(Void result) {

            }
        });

        // Deleting multiple connections of the same relation in a single call
        List<Long> playerIds = new ArrayList<Long>(){{
            add(1111L);
            add(2222L);
            add(3333L);
        }};
        AppacitiveConnection.bulkDeleteInBackground("plays_for", playerIds, new Callback<Void>() {
            @Override
            public void success(Void result) {

            }
        });
```


----------

## Querying

*Queries* provide a mechanism to search your app's data. All searching through the SDK is done via `AppacitiveQuery` object. You can retrieve many objects at once, put filters on the objects you wish to retrieve, and much more.

The following basic query APIs are available in the SDK. Queries apart from these can be made using the `AppacitiveGraph` API feature discussed later.

### Query API

```
        AppacitiveQuery query = new AppacitiveQuery();
        query.pageNumber = 1;
        query.pageSize = 10;
        query.orderBy = "property to decide the sort order of the result";
        query.isAscending = true;

        List<String> fieldsToFetch = new ArrayList<String>();

        AppacitiveObject.findInBackground(
                "type to query",
                query,
                fieldsToFetch,
                new Callback<PagedList<AppacitiveObject>>() {
                    @Override
                    public void success(PagedList<AppacitiveObject> objects) {
                        
                    }
                }
        );
```

