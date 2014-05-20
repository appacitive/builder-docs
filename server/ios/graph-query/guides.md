## Graph Search

Graph queries offer immense potential when it comes to traversing and mining for connected data. There are two kinds of graph queries, filter and projection.

### Creating graph queries

You can create filter and projection graph queries from the management portal. When you create such queries from the portal, you are required to assign a unique name with every saved search query. You can then use this name to execute the query from your app by making the appropriate api call to Appacitive.

### Executing Filter graph queries

You can execute a saved graph query (filter or projection) by using it’s name that you assigned to it while creating it from the management portal. You will need to send any placeholders you might have set up while creating the query.

```objectivec
[APGraphNode applyFilterGraphQuery:@"namefilter" usingPlaceHolders:@{@"firstname":@"Jonathan", @"lastname":@"White"} successHandler:^(NSArray *objects) {
        NSLog(@"ObjectIds:");
        for(NSString *obj in objects)
            NSLog(@"\n%@",obj);
    }];
```