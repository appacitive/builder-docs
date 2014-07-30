# User Groups

User groups provide a convenient way for you to aggregate users who share a common set of access rules. As these access rule are applied to the group instead of individual users, they are automatically adjusted when a user joins or leaves the group.

User groups also support nesting where one user group can be added inside another. Child user groups inherit access permissions from their parent. This allows you to define a layered access control model with granularity of permissions increasing as you go down the user group hierarchy.

E.g., for a discussion board app, all users in the **members** group may have `create` and `read` access for posts whereas all members of the **moderators** subgroup may have `update` and `delete` access. 

## Securing user groups

Security of user groups is also managed using access control rules. On the Appacitive [Appacitive Portal](https://portal.appacitive.com), you can configure which users and user groups are allowed to add or remove members from a group. This prevents unauthorized users from adding themselves to a user group to which they do not have access.

**NOTE** : Access rules for user groups are only evaluated for api calls made using the client api keys. Using the master api key will not evaulate any access control rules that are setup.

## Managing user groups
Once you have the necessary user group hierarchy and access setup via the management portal, you can manage group memberships for your app via the SDK. 

### Creating and managing user groups
Creation and management of user group hierarchy can only be done via the [Appacitive Portal](https://portal.appacitive.com) and is not allowed over the REST api.

#### Managing members
You can add or remove members for a user group via the `addMembers` and `removeMembers` methods on the `Appacitive.Group` helper class.

While adding or removing users for a group, you can either pass their `id` or their `username` or `Appacitive.User` object itself. 

``` javascript
// Adding users to a usergroup group by ids
Appacitive.Group.addMembers('aclusergroup1', [userId1, userId2, .. ], {
	success : function() {
		console.log("users added to group");
	}
});

// Adding users to a usergroup group by user objects
Appacitive.Group.addMembers('aclusergroup1', [userObj1, userOb2, .. ], {
	success : function() {
		console.log("users added to group");
	}
});


// Removing users from a usergroup group by ids
Appacitive.Group.removeMembers('aclusergroup1', [userId1, userId2, .. ]), {
	success : function() {
		console.log("users removed from group");
	}
});

// Removing users from a usergroup group by user objects
Appacitive.Group.addMembers('aclusergroup1', [userObj1, userOb2, .. ], {
	success : function() {
		console.log("users removed from group");
	}
});
```

## System defined user groups
By default, the appacitive platform provides two system defined user groups. These are 

* **loggedin** : Represents all logged in users.
* **anonymous** : Represents all non-logged in (anonymous) users.

<!--## Managing usergroups on Portal

You can refer this video for more info on managing usergroups through [Appacitive Portal](https://portal.appacitive.com)

<iframe src="//player.vimeo.com/video/85415329" width="700" height="350" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
<br/> -->

# Access Control

Given that each and every request is in the context of some kind of user, the platform then lets you define rules to control the kind of operations that these users can perform. These rules are called `Acls`. 

## User Context
Every request that you app makes to the appacitive platform is associated with a user context. This user context is relayed to the backend via the user authentication token send in the `appacitive-user-auth` header. In the absence of this header, the request is assumed to be made under an anonymous user. Incase you are using the SDK, all this is automatically setup when a user logs in.

For create operations, the user in the user context for that operation is setup as the owner for the object. Owners have implicit admin access over objects. Ownership cannot be revoked using acls.

## Acls
Acls are rules associated with an object that define how access to that object will be moderated. Whenever an api call is made, the user context setup for the api call is used to evaulate the acls applicable on the data affected by the operation. Acl rules define whether a user can perform a particular operation on the affected instance. 

** Contents of an acl rule: **

* **sid** : Id of the user or group for which access is being defined.
* **type** : Type of id (`user` or `usergroup`).
* **permission** : Permission type indicating if the specific access is allowed or denied. (`allow` or `deny`).
* **access** : The access being allowed or denied. (`create`, `update`, `delete`, `read` or `manageaccess`).

** Type Level Acl's: **

To prevent having to define the same acl for each and every instance, you can define acls for a type. Acls defined at a type level are inherited by all instances of the given type. Instance level acls extend or override those defined for the type.

## Acl evaluation

The type based hierarchy for acls implies that there can be multiple acls applicable on any instance at any point of time. The final set of applicable permissions is evaluated based on a combination of all applicable acls using the following guidelines. 

1. The absence of any matching rules for an object imply an implicit `deny` for the corresponding operation.
2. To enable access, you need to define an `allow` rule allowing the particular access.
3. An explicit `deny` rule cannot be overriden and will always result in access being denied for the transaction. This means that you should only use an explicit deny in scenarios where you want to absolutely revoke access with any override.

## Managing Acls

The code samples below show how you can manage access control rules for an object via the SDK.

### Allow access to an object.
You can setup allow access for a user or group via the `allowUser` and `allowUserGroup` methods on the objects `acls` property.

While setting acl's, you can either pass users `id` or `username` or `Appacitive.User` object itself. 

```javascript    
var Post = Appacitive.Object.extend('post');
var post = new Post();

// Allow read and write access to a specific user.
post.acls.allowUser( "userId", ["read", "write"]);

// Allow read access to specific users on this post
post.acls.allowUser(["userId1", "userId2", "userId3"], "create");

// Allow read and write access to usergroup on this post
post.acls.allowGroup("aclusergroup",["create", "read"]);

// Allow read access to anonymous users on this post
post.acls.allowAnonymous("read");
```

### Deny access to an object implicitly

You can deny access to an object by simply removing any matching allow or deny acls on that object. This is especially useful when say such a rule is defined for a type. All instances of this type will be denied access. But you will still retain the ability to override this deny with an explicit allow on a specific instance.
You can implicitly deny access for a user or user group via the `resetUser` and `resetGroup` methods on the `acls` property of the object.

```javascript  
var Post = Appacitive.Object.extend('post');
var post = new Post();

// Reset update and delete access for specific users on this post
post.acls.resetUser(["userId1", "userId2", "userId3"], ["update", "delete"]);

// Reset delete access for anonymous users on this post
post.acls.resetUser("userId1", "delete");

// Reset read access for these groups on this post
post.acls.resetGroup(["aclusergroup1", "aclusergroup2"], "update");

// Reset delete, update, manageaccess and create access for anonymous users on this post
post.acls.resetAnonymous(["delete", "update", "manageaccess", "create"]);

// Reset read and write access for logged in users on this post
post.acls.resetLoggedIn("read");
```

### Deny access to an object explicitly
Explicitly denying access to objects sets up a deny rule for the given user and action on an object. You should be careful when using this as a deny rule setup for a type cannot be overridden by an allow acl rule at an instance level.
You can remove any explicit acl rules for a user or user group via the `denyUser` and `denyGroup` methods on the `acls` property of the object.

```javascript
var Post = Appacitive.Object.extend('post');
var post = new Post();

// Deny update and delete access for specific users on this post
post.acls.denyUser(["userId1", "userId2", "userId3"],["update", "delete"]);

// Deny delete access for anonymous users on this post
post.acls.denyUser("userId1", "delete");

// Deny read access for these groups on this post
post.acls.denyGroup(["aclusergroup1", "aclusergroup2"], "update");

// Deny delete, update, manageaccess and create access for anonymous users on this post
post.acls.denyAnonymous(["delete", "update", "manageaccess", "create"]);

// Deny read and write access for logged in users on this post
post.acls.denyLoggedIn("read");
```

## Supported types
Acls can be defined for all objects, users and devices. On the SDK, you can apply acls on the corresponding `Appacitive.Object` and  `Appacitive.User` types and their subclasses.

## Filtering
Access control rules act naturally as a secondary level filter over and above the queries that you specify from the client side. As a result, search api calls made using client keys vs master keys may return different results as searches made using the master key will not perform the additional acl based filtering.

## Gotchas
When using access control for you app, you need to be aware of the following gotchas.

1. All access type (`read`, `update`, `create` and `delete`) are discrete and granting one does not automatically imply the other.
2. When an object is created, the user available in the user context is automatically setup as the owner of the object. Owners can perform all operations on an object without any acl setup.
3. Using the master key in the SDK or when making REST api calls will skip all acl evaluation.
 
<!--## Manging Acl's on Portal

You can refer this video for more info on managing access control list through [Appacitive Portal](https://portal.appacitive.com)

<iframe src="//player.vimeo.com/video/85415329" width="700" height="350" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
<br/>
-->