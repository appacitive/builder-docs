# Graph API

Graph API offers immense potential when it comes to traversing, mining and returning connected data. It allows you to create an API which returns a lot of related data without having to make too many calls.

## Creating Graph API

<iframe src="//player.vimeo.com/video/85415329" width="700" height="350" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
<br/>

You can create Graph API's from the management portal. When you create such API's from the portal, you are required to assign a unique name with every saved query. You can then use this name to execute the API from your app by making the appropriate call to Appacitive.


## Executing Graph API

You can execute a saved Graph API by using it’s name that you assigned to it while creating it from the management portal. You will  need to pass the initial ids as an array of strings to feed the API, and any placeholders you might have set up while creating the API as a list of key-value pairs in the body of the request.

Following example refers to the Graph API that we created in the video.

```csharp
// Name of graph projection query
var graphApiName = "get_posts";

// List of ids for which to run the graph api
var userIds = ["34912447775245454", "34322447235528474"];

// any placeholders if provided : optional
var placeHolders = new Dictionary<string, string>
                    {
                        {"topic", "avengers"}
                    };

GraphNode[] results = await Graph.Select(graphApiName, userIds, placeHolders);

```