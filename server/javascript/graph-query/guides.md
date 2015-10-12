# Graph Query

Graph Query offers immense potential when it comes to traversing and mining connected data. It allows you to create an API which returns a list of resulting ids.

## Creating Graph Query

<iframe src="//player.vimeo.com/video/85415329" width="700" height="350" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
<br/>

You can create Graph Queries from the management portal. When you create such query from the portal, you are required to assign a unique name with every saved query. You can then use this name to execute the query from your app by making the appropriate call to Appacitive.

## Executing Graph Query

You can execute a saved Graph Query by using it’s name that you assigned to it while creating it from the management portal. You will  need to pass any placeholders you might have set up while creating the Query as a list of key-value pairs in the body of the request.

Following example refers to the Graph Query that we created in the video.

```javascript
// Name of graph query
var queryName = "get_users";

// any placeholders if provided : optional
var placeholders = { topic: "avengers" };

// Create query for Graph API
var query = new Appacitive.Queries.GraphQuery({ 
	name :queryName, 
	placeholders: placeholders 
});

// call fetch
query.fetch().then(function(ids) {
  // result contains a list of user ids
  console.log(ids.length + " found");
}, function(status) {
  console.log(status.message);
});
```

## Pagination and Sorting

By default, the API returns ids without pagination and is sorted by relevance. You can, however, specify pagination and sorting as well. The syntax to set it is the same as the one used in [basic queries](/javascript/data-store/guides.html#modifiers).

```javascript
// Create query for Graph API
var query = new Appacitive.Queries.GraphQuery({ 
	name: 'get_users', 
	placeholders: placeholders, 
	pageSize: 20, 
	pageNumber: 3,
	ascending: 'username'
});

// success callback
var successHandler = function(userIds) {
  //`userIds` is `PagedList` of `ids`

  console.log(userIds.total); //total records for query
  console.log(userIds.pageNumber); //pageNumber for this set of records
  console.log(userIds.pageSize); //pageSize for this set of records

  // fetching other left userIds
  if (!userIds.isLastPage) {
    // if this is not the last page then fetch further records 
    query.fetchNext().then(successHandler);
  }
};

// make a call
query.fetch().then(successHandler);
```

## Return Objects with Fields

Graph query returns a list of ids by default. Bu it also supports returning respective objects instead of ids with support to specific [fields](/javascript/data-store/guides.html#fields) to retrieve.

```javascript
// Create query for Graph API
var query = new Appacitive.Queries.GraphQuery({ 
	name: 'get_users', 
	placeholders: placeholders, 
	pageSize: 20, 
	pageNumber: 3,
	ascending: 'username',
	fields: ['username','firstnam', 'lastname'],
	returnObjects: true //set true to return objects 
});

// success callback
var successHandler = function(users) {
  //`users` is `PagedList` of `Object`

  console.log(users.total); //total records for query
  console.log(users.pageNumber); //pageNumber for this set of records
  console.log(users.pageSize); //pageSize for this set of records

  // fetching other left users
  if (!users.isLastPage) {
    // if this is not the last page then fetch further records 
    query.fetchNext().then(successHandler);
  }
};

// make a call
query.fetch().then(successHandler);
```
