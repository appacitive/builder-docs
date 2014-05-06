# Graph API

Graph API offers immense potential when it comes to traversing, mining and returning connected data. It allows you to create an API which returns a lot of related data without having to make too many calls.

## Creating Graph API

<iframe src="//player.vimeo.com/video/85415329" width="700" height="350" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
<br/>

You can create Graph API's from the management portal. When you create such API's from the portal, you are required to assign a unique name with every saved query. You can then use this name to execute the API from your app by making the appropriate call to Appacitive.

## Executing Graph API

You can execute a saved Graph API by using it’s name that you assigned to it while creating it from the management portal. You will  need to pass the initial ids as an array of strings to feed the API, and any placeholders you might have set up while creating the API as a list of key-value pairs in the body of the request.

Following example refers to the Graph API that we created in the video.

```javascript
// Name of graph API
var apiName = "get_posts";

//an array of ids of user article : mandatory
var userIds = ["34912447775245454", "34322447235528474"];

// any placeholders if provided : optional
var placeholderFillers = { topic: "avengers" };

// Create query for Graph API
var query = new Appacitive.Queries.GraphAPI(apiName, userIds, placeholderFillers);

// Call fetch on query
query.fetch().then(function(results) {
  /* results object contains list of objects for provided user ids
     Each object contains a children property
     Children contains array of objects of specified child elements in query
     eg: */ 

  console.log("This user '" + results[0].get('username') + "' has " 
       + results[0].children["my_posts"].length) + " posts ");

  // You can keep drilling down the heirarchy as you've defined in you projection query
}, function(status) {
  console.log(status.message);
});
```



