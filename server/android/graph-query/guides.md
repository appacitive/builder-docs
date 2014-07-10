# Graph Query

Appacitive's Graph Queries offer immense flexibility when it comes to filtering and retrieving connected data for your app.

## Creating Graph Queries

You can create `Graph Queries` from the management portal. When you create such queries from the portal, you are required to assign a unique name with every saved search query. You can then use this name to execute the query from your app by making the appropriate API call to Appacitive.

You can start creating your Queries or API's by going to *modules* -> *build & deploy* -> *graph query builder*.

## Executing saved Graph Queries

You can execute a saved Graph Query by using it's name that you assigned to it while creating it from the management portal. You will need to send any placeholders you might have set up while creating the query as a list of key-value pairs in the body of the request.

The Graph Query will return a list of ids.

```
                AppacitiveGraphSearch.filterQueryInBackground("sample_filter", new HashMap<String, String>() {{
                            put("search_key", "value");
                        }}, new Callback<List<Long>>() {
                            @Override
                            public void success(List<Long> result) {
                                
                            }
                        }
                );
```