----------

## Data storage and retrieval

All data is represented as entities. This will become clearer as you read on. Lets assume that we are building a game and we need to store player data on the server.

### Creating objects

```objectivec
APObject *player = [[APObject alloc] initWithTypeName:@"player"];
```

An `APObject` comprises of an entity (referred to as 'object' in Appacitive jargon). To initialize an object, we need to provide it some options. The mandatory argument is the `type` argument.

What is a type? In short, think of types as tables in a contemporary relational database. A type has properties which hold values just like columns in a table. A property has a data type and additional constraints are configured according to your application's need. Thus we are specifying that the player is supposed to contain an entity of the type 'player' (which should already be defined in your application).

The player object is an instance of `APObject`. An `APObject` is a class which encapsulates the data (the actual entity or the object) and methods that provide ways to update it, delete it etc.

#### Setting Values for objects
Now we need to name our player 'John Doe'. This can be done as follows

```objectivec
APObject *player = [[APObject] initWithType:@"player"];

[player addPropertyWithKey:@"name" value:@"John Doe"];

```

#### Getting values for objects
Lets verify that our player is indeed called 'John Doe'.

```objectivec
// using the getters
NSLog(@"Player Name: %@",[player getPropertyWithKey:@"name"]);

// direct access via the raw object data
NSLog(@"Player Name: %@",[player.properties valueForKey:@"name"]);  // John Doe

```

#### Saving objects
Saving a player to the server is easy.

```objectivec
[player addPropertyWithKey:@"age" value:25];
[player saveObjectWithSuccessHandler:^(NSDictionary *result){
    NSLog(@"Player Object saved successfully!");
}failureHandler:^(APError *error){
    NSLog(@"Error occurred: %@",[error description]);
}];
```

When you call save, the entity is taken and stored on Appacitive's servers. A unique identifier called `__id` is generated and is stored along with the player object. This identifier is also returned to the object on the client-side. You can access it using `player.objectId`.
This is what is available in the `player` object after a successful save.

```objectivec
{
"__id": "14696753262625025",
"__type": "player",
"__typeid": "12709596281045355",
"__revision": "1",
"__createdby": "System",
"__lastmodifiedby": "System",
"__tags": [],
"__utcdatecreated": "2013-01-10T05:18:36.0000000",
"__utclastupdateddate": "2013-01-10T05:18:36.0000000",
"name": "John Doe",
"__attributes": {}
}
```

You'll see a bunch of fields that were created automatically by the server. They are used for housekeeping and storing meta-information about the object. All system generated fields start with `__`, avoid changing their values. Your values will be different than the ones shown here.

### Retrieving objects
 To retrieve an object, simply call the fetch method on the instance and on success the instance will be populated with the object from Appacitive.

```objectivec
// retrieve the player
[player fetchWithSuccessHandler:^(){
NSLog(@"Player: %@",[player description]);
}failureHandler:^(APError *error) {
NSLog(@"Error occurred: %@",[error description]);
}];
```

You can also retrieve multiple objects at a time, which will return an array of `APObject` objects in the successBlock. Here's an example

```objectivec
NSArray *objectIdList = [[NSArray alloc] initWithObjects:@"33017891581461312",@"33017891581461313", nil];
[APObject fetchObjectsWithObjectIds:objectIdList typeName:@"post"
        successHandler:^(NSArray *objects){
            NSLog("%@ number of objects fetched.", [objects count]);
        } failureHandler:^(APError *error) {
            NSLog(@"Error occurred: %@",[error description]);
        }];
});
```

**NOTE:** When performing fetch, search operations, you can choose to retrieve only specific properties of your object stored on Appacitive. This feature applies to all, system defined as well as user defined properties except *__id* and *__type*, which will always be fetched. Using this feature essentially results in lesser usage of network resources, faster response times and lesser memory usage for object storage on the device. Look for fetch methods that accept an  NSArray type of parameter named _propertiesToFetch_ and pass it an array of properties you wish to fetch. For search methods, set the _propertiesToFetch_ NSArray type property of an instance of APQuery class and pass that instance of APQuery to the query parameter of the search methods. More on the APQuery class in the __Queries__ section.

```objectivec
// retrieve the player
[player fetchWithPropertiesToFetch:@[@"name",@"score"] successHandler:^(){
NSLog(@"Player: %@",[player description]);
}failureHandler:^(APError *error) {
NSLog(@"Error occurred: %@",[error description]);
}];
```

### Updating objects

You can update your existing objects and save them to Appacitive.

```objectivec
// Incase the object is not already retrieved from the system,
// simply create a new instance of an object with the id.
// This creates a "handle" to the object on the client
// without actually retrieving the data from the server.
// Simply update the fields that you want to update and call the update method on the object.

// This will simply create a handle or reference to the existing object.
APObject *post = [[APObject alloc] initWithTypeName:@"post" objectId:@"33017891581461312"];
//Update properties
[post updatePropertyWithKey:@"title" value:@"UpdatedTitle"];
[post updatePropertyWithKey:@"text" :@ "This is updated text for the post."];
// Add a new attribute
[post addAttributeWithKey:@"topic" value:@"testing"];
// Add/remove tags
[post addTag:@"tagA"];
[post removeTag:@"tabC"];
[post updateWithSuccessHandler:^(){
NSLog(@"post title:%@, post text:%@",[object getTitle],[object getText]);
}failureHandler:^(APError *error){
NSLog(@"Error occurred: %@",[error description]);
}];

```

### Deleting objects

Lets say we've had enough of John Doe and want to remove him from the server, here's what we'd do.

```objectivec
[player deleteObjectWithSuccessHandler:^(){
  NSLog(@"JohnDoe player object has been deleted!");
}failureHandler:^(APError *error){
  NSLog(@"Error occurred: %@",[error description]);
}];

//You can also delete object with its connections in a simple call.
APObject *player = [[APObject alloc] initWithTypeName:@"player" objectId:@"123456678809"];
[friend deleteObjectWithConnectingConnectionsSuccessHandler:^(){
  NSLog(@"friend object deleted with its connections!");
}failureHandler:^(APError *error){
  NSLog(@"Error occurred: %@",[error description]);
}];

// Multiple objects can also be deleted at a time. Here's an example
[APObjects deleteObjectsWithIds:@["14696753262625025",@"14696753262625026"] typeName:@"player" successHandler:^(){
  NSLog(@"player objects deleted!");
}failureHandler:^(APError *error){
  NSLog(@"Error occurred: %@",[error description]);
}];
```

----------
## Connections

All data that resides in the Appacitive platform is relational, like in the real world. This means you can do operations like fetching all games that any particular player has played, adding a new player to a team or disbanding a team whilst still keeping the other teams and their `players` data perfectly intact.

Two entities can be connected via a relation, for example two entities of type `person` might be connected via a relation `friend` or `enemy` and so on. An entity of type `person` might be connected to an entity of type `house` via a relation `owns`. Still here? OK, lets carry on.

One more thing to grok is the concept of labels. Consider an entity of type `person`. This entity is connected to another `person` via relation `marriage`. Within the context of the relation `marriage`, one person is the `husband` and the other is the `wife`. Similarly the same entity can be connected to an entity of type `house` via the relation `owns_house`. In context of this relation, the entity of type `person` can be referred to as the `owner`.

`Wife`, `husband` and `owner` from the previous example are `labels`. Labels are used within the scope of a relation to give contextual meaning to the entities involved in that relation. They have no meaning or impact outside of the relation.

As with entities (objects), relations are also contained in collections.

Let's jump in!


### Creating &amp; Saving

#### New Connection between two existing Objects

Connections represent relations between objects. Consider the following.

```objectivec
//`reviewer` and `hotel` are the endpoint labels
APObject *reviewer = [[APObject alloc] initWithTypeName:@"reviewer" objectId:@"123445678"];

APObject *hotel = [[APObject alloc] initWithTypeName:@"hotel" objectId:@"987654321"];

//`review` is relation name
APConnection *connection = [[APConnection alloc] initWithRelationType:@"review"];

[connection createConnectionWithObjectA:reviewer objectB:hotel successHandler^() {
  NSLog(@"Connection created!");
}failureHandler:^(APError *error){
  NSLog(@"Error occurred: %@",[error description]);
}];
```

#### New Connection between two new Objects

There is another easier way to connect two new entities. You can pass the new entities themselves to the connection while creating it.

```objectivec
/* Will create a new myScore connection between
- new player object which will be created along with the connection.
- new score object which will be created along with the connection.
*/ The myScore relation defines two endpoints "player" and "score" for this information.

//Create an instance of object of type score
APObject *score = [[APObject alloc] initWithTypeName:@"score"];
[score addPropertyWithKey:@"points" value:@"150"];

//Create an instance of object of type player
APObject *score = [[APObject alloc] initWithTypeName:@"player"];
[score addPropertyWithKey:@"points" value:@"150"];

APConnection *connection = [[APConnection alloc] initWithRelationType:@"myScore"];
[connection createConnectionWithObjectA:player objectB:score labelA:@"player" labelB:@"score" successHandler^() {
  NSLog(@"Connection created!");
}failureHandler:^(APError *error){
  NSLog(@"Error occurred: %@",[error description]);
}];
```

This is the recommended way to do it. In this case, the myScore relation will create the entities player and score first and then connect them using the relation `marriage`.

**NOTE:** It doesn't matter whether player and score have been saved to the server yet. If they've been saved, then they will get connected via the relation 'myScore'. And if both (or one) hasn't been saved yet, the required entities will get connected and stored on the server. So you could create the two entities and connect them via a single call, and if you see the two entities will also get reflected with saved changes, so your objects are synced.

#### Setting values for a connection

```objectivec
//This works exactly the same as in case of APObjects.
[myScore addPropertyWithKey:@"matchname" value:@"European Premier League"];
```

#### Getting values for a connection

```objectivec
NSLog(@"Match name: %@", [myScore getPropertyWithKey:@"matchname"]);
```

### Retrieving connections

#### Get Connection by Id

```objectivec
[APConnections fetchConnectionWithRelationType:@"review" objectId:@"33017891581461312" successHandler^(NSArray objects) {
  NSLog(@"Connection fetched:%@",[[objects lastObject] description]);
}failureHandler:^(APError *error){
  NSLog(@"Error occurred: %@",[error description]);
}];
```

Retrieving can also be done via the `fetch` method. Here's an example

```objectivec
APConnection *review = [[APConnection alloc] initWithTypeName:@"review" objectId:@"35097613532529604"];
[review fetchWithSuccessHandler:^()
  {
    NSLog(@"Connection fetched: %@",[review description]);
  }
  failureHandler:^(APError *error) {
    NSLog(@"Error occurred: %@",[error description]);
  }
];
```

The review object is similar to the object, except you get two new fields viz. endpointA and endpointB which contain the id and label of the two entities that this review object connects.

#### Get Connected Objects

Consider `Jane` has a lot of friends whom she wants to invite to her marriage. She can simply get all her friends who're of type `person` connected with `Jane` through a relation `friends` with label for Jane as `me` and friends as `friend` using this search

```objectivec
[APConnections fetchConnectedObjectsOfType:@"person" withObjectId:@"1234567890" withRelationType:@"friends" successHandler:^(NSArray *objects)
  {
    NSLog(@"Jane's friends:\n");
    for(APObject *obj in objects)
    {
      NSLog(@"%@ \n"[obj getPropertyWithKey:@"name"]);
    }
  }
```

#### Get all Connections for an Endpoint Object Id

Scenarios where you may need to just get all connections of a particular relation for an objectId, this query comes to rescue.

Consider `Jane` is connected to some objects of type `person` via `invite` relationship, that also contains a `bool` property viz. `attending`,  which is false by default and will be set to true if that person is attending marriage.

Now she wants to know who all are attending her marriage without actually fetching their connected `person` object, this can be done as

```objectivec
APObject *Jane = [[APObject alloc] initWithTypeName:@"person" objectId:@"12345678"];

APQuery *queryObj = [[APQuery alloc] init];
queryObj.filterQuery = [[APQuery queryExpressionWithProperty:@"attending"] isEqualTo:@"true"];

[APConnections searchAllConnectionsWithRelationType:@"invite" byObjectId:Jane.objectId withLabel:@"attendee" withQuery:[queryObj stringValue] successHandler:^(NSArray *objects, NSInteger pageNumber, NSInteger pageSize, NSInteger totalRecords) {
    NSLog(@"Attendees:");
    for(APObject *obj in objects)
        NSLog(@"%@ \n",[obj getPropertyWithKey:@"name"]);
}];

```

In this query, you provide a relation type (name) and a label of opposite side whose connection you want to fetch and what is returned is a list of all the connections for above object.

#### Get Connection by Endpoint Object Ids

Appacitive also provides a reverse way to fetch a connection  between two objects.
If you provide two object ids of same or different type types, all connections between those two objects are returned.

Consider you want to check whether `John` and `Jane` are married, you can do it as

```objectivec
//'marriage' is the relation between person type
//and 'husband' and 'wife' are the endpoint labels
[APConnections searchAllConnectionsWithRelationType:@"marriage" fromObjectId:@"22322" toObjectId:@"33422" labelB:@"wife" withQuery:nil successHandler:^(NSArray *objects, NSInteger pageNumber, NSInteger pageSize, NSInteger totalRecords) {
        if([objects count] <= 0)
            NSLog(@"John and Jane are married");
        else
            NSLog(@"John and Jane are not married");
    }];
//For a relation between same type type and different endpoint labels
//'label' parameter becomes mandatory for the get call

```

#### Get all connections between two Object Ids

Consider `Jane` is connected to `John` via a `marriage` and a `friend` relationship. If we want to fetch all connections between them we could do this as

```objectivec
[APConnections searchAllConnectionsFromObjectId:@"12345" toObjectId:@"67890" withQuery:nil successHandler:^(NSArray *objects, NSInteger pageNumber, NSInteger pageSize, NSInteger totalRecords) {
    NSLog(@"John and Jane share the following relations:");
    for(APConnection *obj in objects)
        NSLog(@"\n%@",[obj description]);
}];
```

On success, we get a list of all connections that connects `Jane` and `John`.

#### Get Interconnections between one and multiple Object Ids

Consider, `Jane` wants to what type of connections exists between her and a group of persons and houses , she could do this as

```objectivec
[APConnections searchAllConnectionsFromObjectId:@"12345" toObjectIds:@[@"24356", @"56732", @"74657"] withQuery:nil successHandler:^(NSArray *objects, NSInteger pageNumber, NSInteger pageSize, NSInteger totalRecords) {
        NSLog(@"Jane share the following relations:");
        for(APConnection *obj in objects)
            NSLog(@"\n%@",[obj description]);
    }];
});
```

### Updating connections


Updating is done exactly in the same way as entities, i.e. via the `updateConnection` method.

*Important*: While updating, changing the endpoint objects (the `__endpointa` and the `__endpointb` property) will not have any effect and the operation will fail. In case you need to change the connected endpoints, you need to delete the connection and create a new one.

```objectivec
APConnection *newConnection = [[APConnection alloc] initWithRelationType:@"myconnection"];
[newConnection fetchConnection];
[newConnection updatePropertyWithKey:@"name" value:@"newName"];
[newConnection updateConnection];
```

### Deleting connections

Deleting is provided via the `del` method.

```objectivec
APConnection *newConnection = [[APConnection alloc] initWithRelationType:@"myconnection"];
[newConnection fetchConnection];
[newConnection deleteConnection];
});


// Multiple connection can also be deleted at a time. Here's an example
[APConnections deleteConnectionsWithRelationType:@"myConnections" objectIds:@[@"123123",@"234234",@"345345"] failureHandler:^(APError *error) {
    NSLog(@"Some error occurred: %@", [error description]);
}];

```

----------

## Queries

All searching in SDK is done via `APQuery` object. You can retrieve many objects at once, put conditions on the objects you wish to retrieve, and more.

```objectivec

APSimpleQuery *nameQuery = [[APQuery queryExpressionWithProperty:@"name"] isEqualTo:@"John Doe"];
APQuery *queryObj = [[APQuery alloc] init];
queryObj.filterQuery = nameQuery;

[APObject searchAllObjectsWithTypeName:@"user" withQuery:[queryObj stringValue] successHandler:^(NSArray *objects, NSInteger pageNumber, NSInteger pageSize, NSInteger totalRecords) {
    NSLog(@"All users with John as their first name:");
    for(APObject *obj in objects) {
        NSLog(@"\n%@",[obj description]);
    }
}];

```
The above query will return all the players with 'John' as the first name. We first instantiated an APSimpleQuery object by using two class methods `queryExpressionWithProperty:` and `isEqualTo:`. We then instantiated an APQuery object and assigned the APSimpleQuery object that we just instantiated before to its `filterQuery` property. Finally, we used the APObject's class method `searchAllObjectsWithTypeName:withQuery:successHandler:` and passed the NSString representation of the query object to its `withQuery:` parameter.

Take a look at the documentation of the `APQuery` class to get the complete list of all types of queries you can construct.

### Modifiers

The APQuery interface provides various modifiers in the form of properties like `pageSize`, `pageNumber`, `orderBy`, `isAscending`, `filterQuery`, `fields`  and `freeText`. These are the options that you can specify in a query. Lets get to those.

```objectivec
//A filter query that will filter the objects based on the first name.
APSimpleQuery *nameQuery = [[APQuery queryExpressionWithProperty:@"firstname"] isEqualTo:@"John"];

APQuery *queryObj = [[APQuery alloc] init];

//Set the page number to the first page.
queryObj.pageNumber = 1;

//Set the page size to 10. i.e. 10 records per page.
queryObj.pageSize = 10;

//Sort the objects by name.
queryObj.orderBy = @"lastname";

//Set the sorting order to ascending.
queryObj.isAsc = YES;

//Set the filter query i.e. an instance of APSimpleQuery or APCompoundQuery.
queryObj.filterQuery = nameQuery;

//Set the properties to be fetched. All other properties of the object will be
queryObj.propertiesToFetch = @[@"firstname", @"lastname", @"username", @"location"];

//Set the free text search.
queryObj.freeText = @"xyz123";

//The APQuery class has a class method called 'stringValue' that will give the NSString representation of the APQuery object.
NSLog(@"String Representation of the queryObj:"[queryObj stringValue]);
});
```

#### Pagination

All search queries on the Appacitive platform support pagination. To specify pagination on your queries, you need to  set the properties as shown in the above code sample.


**NOTE**: By default, pageNumber is 1 and pageSize is 50

#### Sorting

The data fetched using the query object can be sorted on any existing property of the object. In the above example we are sorting the results by the `lastname` property of the object. The sorting order is set to Ascending by setting the `isAsc` property to `YES`. If you do not set the `isAsc` property to `YES` , then the default sorting order would be descending.

#### Fields

You can also mention exactly which fields/properties you need to be fetched in query results.

The `__id` and `__type`/`__relationtype` fields will always be returned.

In the above example we set the propertiesToFetch property of the queryObj to to an array with objects: `firstname`, `lastname`, `username` and `location`. Doing so will fetch only the specified properties along with `__type` and `__id` for all the objects returned as a result of a fetch or search operation.


**NOTE**: If you do not set the `propertiesToFetch` property, then all the proper tie for the objects will be fetched.

#### Filter

Filters are useful for limiting or funneling your results. They can be added on properties, attributes, aggregates and tags.

You can use the `APSimpleQuery` and `APCompoundQuery` interfaces to construct custom filters. The documentation will provide more insight into constructing custom filters.

You can filter on `property`, `attribute`, `aggregate` or `tags`.

In the above example we have filtered based on the first name property using the APSimpleQuery interface object. You can also find some more examples [here](http://help.appacitive.com/v1.0/index.html#ios/data_querying-data) for the filter queries.


#### Geolocation

You can specify a property type as a geography type for a given type or relation. These properties are essential latitude-longitude pairs. Such properties support geo queries based on a user defined radial or polygonal region on the map. These are extremely useful for making map based or location based searches. E.g., searching for a list of all restaurants within 20 miles of a given users locations.

##### Radial Search

A radial search allows you to search for all records of a specific type which contain a geocode property which lies within a predefined distance from a point on the map. the following example query will filter the objects based on the `location` property whose value lies within the 5 miles of current location.

```objectivec
CLLocation *currentLocation = [[CLLocation alloc] initWithLatitude:23.2 longitude:72.3];
    APSimpleQuery *radialSearch = [APQuery queryWithRadialSearchForProperty:@"location" nearLocation:currentLocation withinRadius:@5 usingDistanceMetric:kMiles];
```

##### Polygon Search

A polygon search is a more generic form of geographical search. It allows you to specify a polygon region on the map via a set of geocodes indicating the vertices of the polygon. The search will allow you to query for all data of a specific type that lies within the given polygon. This is typically useful when you want finer grained control on the shape of the region to search.

```objectivec
CLLocation *point1 = [[CLLocation alloc] initWithLatitude:1 longitude:1];
CLLocation *point2 = [[CLLocation alloc] initWithLatitude:1 longitude:5];
CLLocation *point3 = [[CLLocation alloc] initWithLatitude:5 longitude:5];
CLLocation *point4 = [[CLLocation alloc] initWithLatitude:5 longitude:1];

CLLocation *currentLocation = [[CLLocation alloc] initWithLatitude:5.3 longitude:5.9];

APSimpleQuery *polygonSearch = [APQuery queryWithPolygonSearchForProperty:@"location" withPolygonCoordinates:@[point1, point2, point3, point4]];
```

#### Tag Based Searches

The Appacitive platform provides inbuilt support for tagging data (objects, connections, users and devices). You can use this tag information to query for a specific data set. The different options available for searching based on tags is detailed in the sections below.

##### Query data tagged with one or more of the given tags

For data of a given type, you can query for all records that are tagged with one or more tags from a given list. For example - querying for all objects of type message that are tagged with the names `Gina`, `George`, `Walt`.

```objectivec
APSimpleQuery *tagQuery = [APQuery queryWithSearchUsingOneOrMoreTags:@[@"Gina", @"George", @"Walt"]];
```

##### Query data tagged with all of the given tags

An alternative variation of the above tag based search allows you to query for all records that are tagged with all the tags from a given list. For example, querying for all objects that are tagged with `football`, `soccer` and `rugby`.

```objectivec
APSimpleQuery *tagQuery = [APQuery queryWithSearchUsingAllTags:@[@"football", @"soccer", @"rugby"]];
```

#### Composite Filters

Compound queries allow you to combine multiple queries into one single query. The multiple queries can be combined using `logical OR` and `logical And` operators. NOTE: All queries of type APSimpleQuery with the exception of free text queries can be combined into a compound query.

```objectivec
APCompoundQuery *complexQuery = [APQuery booleanAnd:@[[[APQuery queryExpressionWithProperty:@"name"] isLike:@"John"], [[APQuery queryExpressionWithAttribute:@"height"] isGreaterThan:@"6.0"]]];

```

Similarly you can also construct a complex query with the boolean OR operator.

```objectivec
APCompoundQuery *complexQuery = [APQuery booleanOr:@[[[APQuery queryExpressionWithProperty:@"name"] isLike:@"John"], [[APQuery queryExpressionWithAttribute:@"eye color"] isEqualTo:@"brown"]]];
```

#### FreeText

There are situations when you would want the ability to search across all text content inside your data. Free text queries are ideal for implementing this kind of functionality. As an example, consider a free text lookup for users which searches across the username, firstname, lastname, profile description etc.You can pass multiple values inside a free text search. It also supports passing certain modifiers that allow you to control how each search term should be used. This is detailed below.

```objectivec
APQuery *freeTextQuery = [[APQuery alloc] init];
    freeTextQuery.freeText = @"Jonathan White";
```
