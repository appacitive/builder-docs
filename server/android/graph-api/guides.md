# Graph API

Appacitive's Graph API's offer immense flexibility when it comes to retrieving connected data for your app. 

## Creating Graph APIs

You can create `Graph API`s from the management portal. When you create such queries from the portal, you are required to assign a unique name with every saved search query. You can then use this name to execute the query from your app by making the appropriate API call to Appacitive.

You can start creating your Queries or API's by going to *modules* -> *build & deploy* -> *graph api builder*.

## Executing saved Graph APIs

You can execute a saved Graph API by using it's name that you assigned to it while creating it from the management portal. You will need to send any placeholders you might have set up while creating the API as a list of key-value pairs in the body of the request. You also need to pass the initial ids as an array of strings to feed the API. The response to a Graph API will depend on how you design your Graph API. Do test them out using the API builder from the query tab on the management portal and/or from the Rest API Console.

```
	List<Long> ids = new ArrayList<Long>()
	{{
		add(123);
		add(987);
	}};

	AppacitiveGraphSearch.projectQueryInBackground("sample_project", ids, new HashMap<String, String>() {{
	            put("level1_filter", "val1");
	            put("level2_filter", "val2");
	        }}, new Callback<List<AppacitiveGraphNode>>() {
	            @Override
	            public void success(List<AppacitiveGraphNode> result) {
	                
	            }
	        }
);
```