## Access Control

You can also manage access controls on your objects using the acl property of the APObect, APUser or the APDevice classes and their sub classes.

You can either allow, deny or reset permissions for users or usergroups on your object.

**NOTE:** Access controls cannot be enforced on connection objects.

To allow users certain permissions on your object use the allowUsers:permissions: method. The users parameter accepts an array of usernames or user object's objectIds and the permissions parameter accepts an array of strings whose acceptable values are `read`, `create`, `update`, `delete` and `manageaccess`.

```objectivec
APObject *myObject = [[APObject alloc] initWithTypeName:@"mytype"];
[myObject.acl allowUsers:@[@"johndoe",@"janedoe",@"9874135633"] permissions:@[@"update",@"manage permissions"]];
[myObject saveObjectWithSuccessHandler:^(NSDictionary *result){
    NSLog(@"Object saved with access conttrols");
}failureHandler:^(APError *error){
    NSLog(@"Some error occurred: %@"[error description]);
}];
```
Similarly, to allow user groups, use `allowUserGroups:permissions:` method, to deny users or usergroups, use the `denyUsers:permissions:` or `denyUserGroups:permissions` and to reset users or usergroups, use the `resetUsers:permissions:` or `resetUsergroups:permissions` methods.
