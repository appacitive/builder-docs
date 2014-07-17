# Data Store

## Objects

All data is represented as objects. This will become clearer as you read on. Let's assume that we are building a game and we need to store player data on the server.

### Creating an object
To create a player via the sdk, do the following
```csharp
var player = new APObject("player");
```
Huh?

An `APObject` comprises of an entity (referred to as `object` in Appacitive jargon). To initialize an object, we need to provide it some options. The mandatory argument is the `__type` argument.

What is a type? In short, think of types as tables in a contemporary relational database. A type has properties which hold values just like columns in a table. A property has a data type and additional constraints are configured according to your application's need. Thus we are specifying that the player is supposed to contain an entity of the type 'player' (which should already be defined in your application).

The player object is an instance of `APObject`. An `APObject` is a class which encapsulates the data (the actual entity or the object) and methods that provide ways to update it, delete it etc. To see the raw entity that is stored within the `APObject`, fire `player.ToJSON()`.

#### Setting Values
Now we need to name our player 'John Doe'. This can be done as follows
```csharp
 // Using setters
 var player = new APObject("player");
 player.Set("name", "John Doe");

 // dynamically assigning properties (via the use of the dynamic keyword)
 dynamic player = new APObject("player");
 player.name = "John Doe";
```
#### Getting values
Lets verify that our player is indeed called 'John Doe'
```csharp
// using the getters
var name = player.Get<String>("name");

// Using the getter with a default value
// This will return N.A. incase the name property is not available.
var name = playet.Get<string>("name", "N.A.");

// dynamic usage
// Assuming that player is declared via the dynamic keyword.
// player.Name, player.NAme etc would also work here.
var name = player.name;
```

### Saving an object
Saving a player to the server is easy.
```csharp
var player = new APObject("player");
player.Set("name", "John Doe");
player.Set("age", 22);
await player.SaveAsync();
Console.WriteLine("New player created with id {0}.", player.Id);
```
When you call save, the object is taken and stored on Appacitive's servers. A unique object id is generated and is stored along with the player object. This identifier is also returned to the object on the client-side. You can access it directly using `Id` property. This is available in the `player` object after a successful save.

### Retrieving an object

You can retrieving an existing object instance from the backend via its type and unique id.

```csharp
// retrieve the player
var id = "12345";
var player = await APObjects.GetAsync("player", id);
```

If you want to update an object and need a reference to it without making a call to the server, you can create a new instance by passing the type and id in the constructor. This instance is a loose reference to the object on the server side without actually making a call to the backend.

```csharp
// Retrieve the player
// The existingPlayer object represents the player object with id 12345.
var existingPlayerId = "12345";
var existingPlayer = new APObject("player", existingPlayerId);

```

**Note**:  You can mention exactly which all fields you want returned so as to reduce the overall payload size. By default all fields are returned. Fields `Id` and `Type` are the fields which will always be returned.

```csharp
// You can choose to get specific fields only by passing the fields needed.
// The following sample will get only the name and age fields.
var player = await APObjects.GetAsync("player", "12345", new[] { "name", "age" });
```
You can also retrieve multiple objects at a time, which will return an array of `APObject` instances. Here's an example

```csharp
var ids = new [] {"14696753262625025", "14696753262625026", "14696753262625027"};
var fields = new[] { "name", "age" };       // optional fields to get
var players = await APObjects.MultiGetAsync("player", ids, fields);


```
### Updating an object

You can update an existing object via the SaveAsync() instance method on `APObject`.
Saving an object will update the instance with the latest values from the server.

```csharp
// Get existing player
var player = await APObjects.GetAsync("player", "12345");
// Update name and age
player.Set("name", "Jack");
player.Set("age", 24);
// Save
await player.SaveAsync();

```
As you might notice, updates and creates are both done via the `SaveAsync` method. The SDK combines the create operation and the update operation under the hood and provides a unified interface. This is done be detecting the presence of a non-zero `Id` property.
This also means that the `Id` property on all APObjects or derived types are immutable.

#### Handling concurrent updates

It is possible that multiple clients may be updating the same object instance on the backend. To prevent any accidental bad writes, Appacitive provides a revision number based [Multi Version Concurrency Control (MVCC)][3] mechanism.

Each object instance has a integer based Revision property which is internally incremented on each update. If you want to ensure that you are always updating the correct object, you can pass the current revision number of the object during the update. If this revision number matches the revision on the server, the update will be allowed. In case the revision number does not match, it implies that the object has changed since you last read it. Accordingly the update operation will be cancelled.

```csharp
// Get existing player (say at revision # 3 on the server)
var player = await APObjects.GetAsync("player", "12345");
// Update name and age
player.Set("name", "Jack");
player.Set("age", 24);

// Save (this call will succeed)
var revision = player.Revision;     // revision = 3
await player.SaveAsync(revision);

// Save again with old revision (this call will fail as revision number is now 4)
await player.SaveAsync(revision);
```

### Deleting an object

You can delete an APObject via the `DeleteAsync` method on the `APObjects` helper class. Let's say we've had enough of John Doe and delete his player account from the server. Here's how you can do that -

```csharp
// This will delete player with id 12345.
await APObjects.DeleteAsync("player", "12345");
```

You can also delete object along with all its first degree [connections](#connections).
Note that this will only delete the connections and not the connected objects.
```csharp
var deleteConnections = true;
await APObjects.DeleteAsync("player", "12345", deleteConnections);
```
Multiple objects can also be deleted at a time. The delete connections options is not available for multi deletes. Here's an example
```csharp
var ids = var ids = new [] {"14696753262625025", "14696753262625026"};
await APObjects.MultiDeleteAsync("player", ids);
```

## Connections

All data that resides in the Appacitive platform is relational, like in the real world. This means you can do operations like fetching all games that any particular player has played, adding a new player to a team or disbanding a team whilst still keeping the other teams and their `players` data perfectly intact.

Two entities can be connected via a relation, for example two entites of type `person` might be connected via a relation `friend` or `enemy` and so on. An entity of type `person` might be connected to an entity of type `house` via a relation `owns`.

One more thing to understand is the concept of labels. Consider an entity of type `person`. This entity is connected to another `person` via relation `marriage`. Within the context of the relation `marriage`, one person is the `husband` and the other is the `wife`. Similarly the same entity can be connected to an entity of type `house` via the relation `house_owner`. In context of this relation, the entity of type `person` can be referred to as the `owner`.

`Wife`, `husband` and `owner` from the previous example are `labels`. Labels are used within the scope of a relation to give contextual meaning to the entities involved in that relation. They have no meaning or impact outside of the relation.

Let's jump in!


### Creating a connection

The SDK provides a very fluent interface for creating connections.
You can mix and match various options, to create a connection for your specific application scenario.

#### New Connection between two existing Objects

Before we go about creating connections, we need two entities. Consider the following

```csharp
var idForJohn = "12345";
var idForJane =  "39209";
// initialize and set up a connection
// This will setup a connection of type sibling between the objects
// with the given ids.
var conn = await APConnection
                .New("marriage")
                .FromExistingObject("husband", idForJohn)
                .ToExistingObject("wife", idForJane)
                .SaveAsync();

```

If you've read the previous guide, most of this should be familiar. What happens in the `APConnection` class is that the relation is configured to actually connect the two entities. We provide the ids of the two entities to be connected and specify which is which. For example here, John is the husband and Jane is the wife.

In case you are wondering why this is necessary then here is the answer, it allows you to structure queries like 'who is John's wife?' and much more. Queries are covered in later guides.

`conn` is an instance of `APConnection` of type `marriage`. Similar to an entity, you may call `ToJSON` on a connection to get a json representation of the connection.

#### New Connection between two new Objects

Apart from connecting existing objects, you can also create and connect new objects in one go. For example, say I want to create an order and its invoice in one go.

```csharp
// Create new objects for order and invoice
var order = new APObject("order");
order.Set("order_number", 747383);
var invoice = new APObject("invoice");
invoice.Set("invoice_date", DateTime.Now);

// Create both objects and connect them with a connection of type invoices
await APConnection.New("invoices")
            .FromNewObject("order", order)
            .ToNewObject("invoice", invoice)
            .SaveAsync();
Console.WriteLine("Order id: {0}", order.Id);
Console.WriteLine("Invoice id: {0}", invoice.Id);
```

This is the recommended way to do it. In this case, the invoices relation will create the objects order and invoice first and then connect them using the relation `invoices`.

As you can probably guess from the examples above, you can change `FromNewObject` to `FromExistingObject` and `ToNewObject` to `ToExistingObject`, depending on whether you are connecting an new object or an existing one.

#### Connection properties
Like in the case of objects, connections can have user defined properties and attributes as well. For example, a relation of type `employed` between a `user` and a `company` can contain a property called `joining_date`. This makes sense since the joining date is not a property of the user or the company in isolation.

Properties in connections work exactly in the same way as they work in objects.

```csharp
// This works exactly the same as in case of your standard objects.
// Setting property values
APConnection employed;
employed.Set("joining_date", DateTime.Now);

// Reading property values
var joiningDate = employed.Get<DateTime>("joining_date");
```
### Retrieving a connection

#### Get Connection by Id

```csharp
var conn = await APConnections.GetAsync("employed", "123456");
```
The `APConnection` object is similar to the `APObject`, except you get one new field viz. `Endpoints`. Endpoints represent the two objects that the connection links.

```csharp
var idForJohn = "12345";
var idForJane =  "39209";
var conn = await APConnection
                .New("marriage")
                .FromExistingObject("husband", idForJohn)
                .ToExistingObject("wife", idForJane)
                .SaveAsync();

var john = await conn.Endpoints["husband"].GetObjectAsync();
var jane = await conn.Endpoints["wife"].GetObjectAsync();
```

#### Get Connected Objects

Consider you want to get a list of all people who are friends of John. Essentially what you want is all objects of type `person` who are connected to John via the relation 'friend'.

```csharp
var john = new APObject("person", "12345");
// Returns a paged list of friends.
// We are assuming that the labels for the friend relationship is the same for both endpoints as a friend relationship is not directed.
var friends = await john.GetConnectedObjectsAsync("friend", pageSize:200);
// Write all names to console.
friends.ForEach( f => Console.WriteLine( f.Get<string>("name"));
// Get next page.
var nextPage = await friends.NextPageAsync();
```

NOTE: Incase the relation you are querying is between the same type with different labels, then you must provide the label of the object that you are querying. Example, consider the relationship `father` between `person` objects. In this relationship, the same object can participate as the `father` as well as the `child` with different objects. When querying the `father` connection for John, you will need to specify the label as `father` to get a list of all John's children.

In all other scenarios, passing a label is optional.

#### Get all connections for an object

Get all connections for an object lets you get all connected objects along with the actual connections between them and your initial object.

Consider that a `person` `Jane` is connected to some objects of type `person` via an `invited` relationship. The `invited` relation contains a property viz. `accepted`,  which is `false` by default and will be set to true if that person has accepted the invite.

Get all connections is useful for her to track which people have accepted her invite as the actual status is stored in the connection rather than the person object. She can _optionally_ also apply a filter to return only those connections which have accepted as true.

```csharp
//set an instance of person Object for Jane
var jane = new APObject("person", "id for jane");

// Create query
var query = Query.Property("accepted").IsEqualTo(false);

// Get connections
// This will return the top 200 connections
PagedList<APConnection> = jane.GetConnectionsAsync("invited", query, pageSize:200);
```

#### Get connection by endpoints

Appacitive also provides a reverse way to fetch a connection  between two objects.
If you provide two object ids of same or different type types, all connections between those two objects are returned.

Consider you want to check whether `John` and `Jane` are friends you can check for the existance of a `friend` relationship.

```csharp
bool areFriends = false;
APObject jane, john; // Objects of person type.

// Get connection of type "friend" between jane and john if it exists.
var friendConnection = APConnections.GetAsync("friend", jane.Id, john.Id);
// If no connections exist, then the two users are not friends.
if( friendConnection == null )
    areFriends = false;
else 
    areFriends = true;
```

### Updating a connection

Updating is done exactly in the same way as entities, i.e. via the `SaveAsync()` method.

*Important*: The endpoints for a connection are immutable and cannot be changed. To change the endpoints, you would need to delete the existing connection and recreate a new one. 

```csharp
var membership = new APConnection("membership", "{membershidId}");
// Update the membership renewal date.
membership.Set("renewalDate", DateTime.Now);
await membership.SaveAsync();
```

### Deleting a connection

You can delete a connection via the `DeleteAsync` method on the `APConnections` helper class. 
```csharp
var membershipId = "1872389122";
await APConnections.DeleteAsync("membership", membershipId);
```

----------

## Queries

Queries provide a mechanism to search your application data.
All searching in SDK is done via `Appacitive.Sdk.Query` object. You can retrieve many objects at once, put conditions on the objects you wish to retrieve, and much more.

The following basic uqery apis are available inside the SDK. Queries apart from these can be made using the Graph api feature discussed later.

### Query api

```csharp
/// Find all objects of a given type with the given filters.
Task<PagedList<APObject>> FindAllAsync(
    string type,                                // type to query
    IQuery query = null,                        // query filter
    IEnumerable<string> fields = null,          // fields to retrieve
    int page = 1,                               // page number
    int pageSize = 20,                          // page size
    string orderBy = null,                      // sort field
    SortOrder sortOrder = SortOrder.Descending  // sort order
    )

/// Find all objects connected to the given object with the given filters.
Task<PagedList<APObject>> GetConnectedObjectsAsync(
string relation,                                // relation to query
    string query = null,                        // query filter
    string label = null,                        // label of the object
    IEnumerable<string> fields = null,          // fields to retrieve
    int pageNumber = 1,                         // page number
    int pageSize = 20,                          // page size
    string orderBy = null,                      // sort field
    SortOrder sortOrder = SortOrder.Descending) // sort order
```

As an example, to find all people with first name as John, we would do the following.

```csharp
List<APObject> allMatches = new List<APObject>();
var query = Query.Property("firstname").IsEqualTo("john");
// Run query. Returns a paged response with pagesize 200.
var matches = await APObjects.FindAllAsync("person", query, pageSize: 200);
allMatches.AddRange(matches);
// Incase more records are present, paginate
while( !matches.IsLastPage )
{
    matches = await matches.GetNextPageAsync();
    allMatches.AddRange(matches);
}
```

#### Modifiers

Notice the `page`, `pageNumber`, `orderBy`, `sortOrder`, `query`, and `fields`? These're the optional parameters that you can specify in a query. Lets get to them one by one.

#### Pagination

All queries on the Appacitive platform support pagination and sorting. To specify pagination and sorting on your queries, simply pass the `page`, `pagesize`. The resulting object also contains custom properties like `IsLastPage` as well as methods like `GetNextPageAsync()` to help you get to the next page without having to pass all your parameters again.

#### Sorting
Query results can be sorted using the `orderBy` and `sortOrder` parameters.
The `orderBy` parameter takes the name of the property on which to sort and the `sortOrder` parameter lets you select the order of sorting (ascending or descending).

#### Fields

As in the case of single and multi get apis, you can choose the exact set of fields that you want the api to return. Pass in an array of the properties to be returned in the `fields` parameter to apply this modifier to the query results.

#### Filters

Filters are useful for fine tuning the results of your search. Objects and connections inside Appacitive have 4 different types of data, namely - properties, attributes, aggregates and tags. Filters can be applied on each and every one of these. Combinations of these filters is also possible.

The `Query` object provides a factory for creating filters for appacitive without having to learn the specialized query format used by the underlying REST api.
The typical format for the Query helper class is
```csharp
Query.{Property|Attribute|Aggregate}("name").<Condition>(condition args);
```
Some sample examples of how it can be used are
```csharp
// To query on a property called firstname
var query = Query.Property("firstname").IsEqualTo("John");

// To query on an attribute called nickname
var query = Query.Attribute("nickname").IsEqualTo("John");

// To query on an aggregate called avg_rating
var query = Query.Aggregate("avg_rating").IsGreaterThan(4.5);
```
In response it returns you an `IQuery` object, which encapsulates the specified filter in object form.


### List of supported conditions

| Condition | Sample usage |
| ------------- |:-----|
| **Geography properties** ||
| WithinPolygon() | ``` Query.Property("location").WithinPolygon(geocodes); ```
| WithinCircle() | ```Query.Property("location").WithinCircle(geocode, radius); ```|
| **String properties** ||
| StartsWith() | ```Query.Property("name").StartsWith("Ja"); ```|
| Like()| ```Query.Property("name").Like("an"); ```|
| FreeTextMatches()**   | ```Query.Property("description").FreeTextMatches("roam~0.8"); ```|
| EndsWith() | ```Query.Property("name").EndsWith("ne"); ``` |
| IsEqualTo() | ```Query.Property("name").IsEqualTo("Jane"); ``` |
| **Text properties** ||
| FreeTextMatches()**   |```Query.Property("description").FreeTextMatches("roam~0.8"); ```|
| **Time properties ** ||
| BetweenTime() | ```Query.Property("start_time").BetweenTime(startDate, endDate);``` |
| IsEqualToTime() | ```Query.Property("start_time").IsEqualToTime(DateTime.Now);``` |
| IsLessThanTime() | ```Query.Property("start_time").IsLessThanTime(DateTime.Now);``` |
| IsLessThanEqualToTime() | ```Query.Property("start_time").IsLessThanEqualToTime(DateTime.Now);``` |
| IsGreaterThanTime()| ```Query.Property("start_time").IsGreaterThanTime(DateTime.Now);``` |
| IsGreaterThanEqualToTime()| ```Query.Property("start_time").IsGreaterThanEqualToTime(DateTime.Now);``` |
| **Date properties ** ||
| BetweenDate() | ```Query.Property("start_at").BetweenDate(startDateTime, endDateTime);``` |
| IsEqualToDate()| ```Query.Property("start_at").IsEqualToDate(DateTime.Now);``` |
| IsLessThanDate() | ```Query.Property("start_at").IsLessThanDate(DateTime.Now);``` | 
| IsLessThanEqualToDate() | ```Query.Property("start_at").IsLessThanEqualToDate(DateTime.Now);``` |
| IsGreaterThanDate() | ```Query.Property("start_at").IsGreaterThanDate(DateTime.Now);``` |
| IsGreaterThanEqualToDate() | ```Query.Property("start_at").IsGreaterThanEqualToDate(DateTime.Now);``` |
| **Datetime, int and decimal properties** ||
| IsLessThan() | ```Query.Property("field").IsLessThan(value);``` |
| IsLessThanEqualTo() | ```Query.Property("field").IsLessThanEqualTo(value);``` |
| Between() | ```Query.Property("field").Between(start, end);``` |
| IsGreaterThanEqualTo() | ```Query.Property("field").IsGreaterThanEqualTo(value);``` |
| IsGreaterThan() | ```Query.Property("field").IsGreaterThan(value);``` |
| IsEqualTo() | ```Query.Property("field").IsEqualTo(value);``` |
** Supports [Lucene query parser syntax][4]

### Geolocation

You can specify a property type as a geography type for a given type or relation. These properties are essential latitude-longitude pairs. Such properties support geo queries based on a user defined radial or polygonal region on the map. These are extremely useful for making map based or location based searches. E.g., searching for a list of all restaurants within 20 miles of a given users locations.

#### Radial Search

A radial search allows you to search for all records of a specific type which contain a geocode which lies within a predefined distance from a point on the map. A radial search requires the following parameters.

```csharp
//create a new Geocode object
var center = new Geocode(36.1749687195m, -115.1372222900m);
//create filter
var query = Query.Property("location").WithinCircle(center, 20.0m, DistanceUnit.Miles);
//create query object
var restaurants = await APObjects.FindAllAsync("restaurant", query);
```

#### Polygon Search

A polygon search is a more generic form of geographcal search. It allows you to specify a polygonal region on the map via a set of geocodes indicating the vertices of the polygon. The search will allow you to query for all data of a specific type that lies within the given polygon. This is typically useful when you want finer grained control on the shape of the region to search.

```csharp
//create geocode objects
var pt1 = new Geocode(36.1749687195m, -115.1372222900m);
var pt2 = new Geocode(34.1749687195m, -116.1372222900m);
var pt3 = new Geocode(35.1749687195m, -114.1372222900m);
var pt4 = new Geocode(36.1749687195m, -114.1372222900m);

//create polygon filter
var query = Query.Property("location").WithinPolygon(pt1, pt2, pt3, pt4);

//create query object
var restaurants = await APObjects.FindAllAsync("restaurant", query);
```

### Tag Based Searches

The Appacitive platform provides inbuilt support for tagging on all data (objects, connections, users and devices). You can use this tag information to query for a specific data set. The different options available for searching based on tags is detailed in the sections below.

#### Query data tagged with one or more of the given tags

For data of a given type, you can query for all records that are tagged with one or more tags from a given list. For example - querying for all objects of type message that are tagged as personal or private.

```csharp
// Create the query
var query = Query.Tags.MatchOneOrMore("personal", "private");
// Will return messages tagged with either personal or private or both.
var messages = await APObjects.FindAllAsync("message", query);
```

#### Query data tagged with all of the given tags

An alternative variation of the above tag based search allows you to query for all records that are tagged with all the tags from a given list. For example, querying for all objects of type message that are tagged as personal AND private.

```csharp
// Create the query
var query = Query.Tags.MatchAll("personal", "private");
// Will return messages tagged with both personal and private.
var messages = await APObjects.FindAllAsync("message", query);
```

### Compound Queries

Compound queries allow you to combine multiple queries into one single query. The multiple queries can be combined using `Query.And` and `Query.Or` operators.
`NOTE`: All types of queries with the exception of free text queries can be combined into a compound query.

```csharp
/*
Find all users
- whose first name is John or Jane and
- who stay within 20 mile radius of the empire state building.
*/
var locationOfEmpireState = new Geocode(40.7484m, 73.9857m);
var query = Query.And(
                Query.Or(
                    Query.Property("firstname").IsEqualTo("john"),
                    Query.Property("firstname").IsEqualTo("jane")
                    ),
                Query.Property("location").WithinCircle(locationOfEmpireState, 20.0m, DistanceUnit.Miles)
                );

var matches = await APObjects.FindAllAsync("person", query);
```

### FreeText

There are situations when you would want the ability to search across all text content inside your data. Free text queries are ideal for implementing this kind of functionality. As an example, consider a free text lookup for users which searches across the username, firstname, lastname, profile description etc.

`NOTE`: Free text queries support the [Lucene query parser syntax][4]  for free text search.

```csharp
var places = await APObjects.FreeTextSearchAsync("places", "+champs +palais", pageSize:200);
```