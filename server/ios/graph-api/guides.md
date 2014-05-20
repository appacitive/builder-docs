## Graph Search

Graph queries offer immense potential when it comes to traversing and mining for connected data. There are two kinds of graph queries, filter and projection.

### Creating graph queries

You can create filter and projection graph queries from the management portal. When you create such queries from the portal, you are required to assign a unique name with every saved search query. You can then use this name to execute the query from your app by making the appropriate api call to Appacitive.

### Executing projection graph queries

Executing saved projection queries works the same way as executing saved filter queries. The only difference is that you also need to pass the initial ids as an array of strings to feed the projection query. The response to a projection query will depend on how you design your projection query. Do test them out using the query builder from the query tab on the management portal and from the test harness.

```objectivec
APGraphNode *projectionGraphQuery = [[APGraphNode alloc] init];
    [projectionGraphQuery applyProjectionGraphQuery:@"project_sales" usingPlaceHolders:nil forObjectsIds:@[@"12345",@"34567"] successHandler:^(APGraphNode *node) {
        NSLog(@"Sales Projection:%@",[node description]);
    }];
```