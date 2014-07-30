# Graph Query

Graph Query offers immense potential when it comes to traversing and mining connected data. It allows you to create an API which returns a list of resulting ids.

## Creating Graph Query

<iframe src="//player.vimeo.com/video/85415329" width="700" height="350" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
<br/>

You can create Graph Queries from the management portal. When you create such query from the portal, you are required to assign a unique name with every saved query. You can then use this name to execute the query from your app by making the appropriate call to Appacitive.

## Executing Graph Query

You can execute a saved Graph Query by using it’s name that you assigned to it while creating it from the management portal. You will  need to pass any placeholders you might have set up while creating the Query as a list of key-value pairs in the body of the request.

Following example refers to the Graph Query that we created in the video.

```csharp
// Name of graph query
var graphQueryName = "get_users";  

// any placeholders if provided : optional

var placeHolders = new Dictionary<string, string>
                    {
                        {"topic", "avengers"}
                    };
var matchingIDs = await Graph.Query(graphQueryName, placeHolders);
```