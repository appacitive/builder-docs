# User Groups and Access Control
 
## User Groups:
User groups provide a convinient way for you to aggregate users who share a common set of access rules. As these access rule are applied to the group instead of individual users, they are automatically adjusted when a user joins or leaves the group.

User groups also support nesting where one user group can be added inside another. Child user groups inherit access permissions from their parent. This allows you to define a layered access control model with granularity of permissions increasing as you go down the user group hierarchy.

E.g., for a discussion board app, all users in the **members** group may have `create` and `read` access for posts whereas all members of the **moderators** subgroup may have `update` and `delete` access. 

### Securing user groups
Security of user groups is also managed using access control rules. On the management portal, you can configure which users and user groups are allowed to add or remove members from a group. This prevents unauthorized users from adding themselves to a user group to which they do not have access.

**NOTE** : Access rules for user groups are only evaluated for api calls made using the client api keys. Using the master api key will not evaulate any access control rules that are setup.

### Managing user groups
Once you have the necessary user group hierarchy and access setup via the management portal, you can manage group memberships for your app via the SDK. 

#### Creating and managing user groups
Creation and management of user group hierarchy can only be done via the Appacitive management portal and is not allowed over the REST api.

#### Managing members
You can add or remove members for a user group via the `AddMembersAsync` and `RemoveMembersAsync` methods on the `UserGroup` helper class.

``` csharp
// Adding users to a user group
await UserGroup.AddMembersAsync(groupIdOrName, new [] { userId1, userId2, .. });

// Removing users from a user group
await UserGroup.RemoveMembersAsync(groupIdOrName, new [] { userId1, userId2, .. });
```

### System defined user groups
By default, the appacitive platform provides two system defined user groups. These are 

* **loggedin** : Represents all logged in users.
* **anonymous** : Represents all non-logged in (anonymous) users.

## Access Control
Given that each and every request is in the context of some kind of user, the platform then lets you define rules to control the kind of operations that these users can perform. These rules are called `Acls`. 

### User Context
Every request that you app makes to the appacitive platform is associated with a user context. This user context is relayed to the backend via the user authentication token send in the `appacitive-user-auth` header. In the absence of this header, the request is assumed to be made under an anonymous user. Incase you are using the SDK, all this is automatically setup when a user logs in.

For create operations, the user in the user context for that operation is setup as the owner for the object. Owners have implicit admin access over objects. Ownership cannot be revoked using acls.

### Acls
Acls are rules associated with an object that define how access to that object will be moderated. Whenever an api call is made, the user context setup for the api call is used to evaulate the acls applicable on the data affected by the operation. Acl rules define whether a user can perform a particular operation on the affected instance. 

** Contents of an acl rule: **

* **sid** : Id of the user or group for which access is being defined.
* **type** : Type of id (`user` or `usergroup`).
* **permission** : Permission type indicating if the specific access is allowed or denied. (`allow` or `deny`).
* **access** : The access being allowed or denied. (`create`, `update`, `delete`, `read` or `manageaccess`).

To prevent having to define the same acl for each and every instance, you can define acls for a type. Acls defined at a type level are inherited by all instances of the given type. Instance level acls extend or override those defined for the type.

### Acl evaluation

The type based hierarchy for acls implies that there can be multiple acls applicable on any instance at any point of time. The final set of applicable permissions is evaluated based on a combination of all applicable acls using the following guidelines. 

1. The absence of any matching rules for an object imply an implicit deny for the corresponding operation.
2. To enable access, you need to define an allow rule allowing the particular access.
3. An explicit deny rule cannot be overriden and will always result in access being denied for the transaction. This means that you should only use an explicit deny in scenarios where you want to absolutely revoke access with any override.

### Managing Acls

The code samples below show how you can manage access control rules for an object via the SDK.

#### Allow access to an object.
You can setup allow access for a user or group via the `AllowUser` and `AllowUserGroup` methods on the objects `Acl` property.

``` csharp    
APObject obj = ..;
// Allow read and write access to a specific user.
obj.Acl.AllowUser( userId, Access.Read, Access.Write );

// Allow read and write access to a specific user group.
obj.Acl.AllowUserGroup( userId, Access.Read, Access.Write );

// Allow read and write access to all logged in users
obj.Acl.AllowUserGroup( "loggedin", Access.Read, Access.Write );

// Allow read and write access to all anonymous users
obj.Acl.AllowUserGroup( "anonymous", Access.Read, Access.Write );
```

#### Deny access to an object implicitly
You can deny access to an object by simply removing any matching allow or deny acls on that object. This is especially useful when say such a rule is defined for a type. All instances of this type will be denied access. But you will still retain the ability to override this deny with an explicit allow on a specific instance.
You can implicitly deny access for a user or user group via the `ResetUser` and `ResetUserGroup` methods on the `Acl` property of the object.

``` csharp    
APObject obj = ..;
// Reset read and write access for a specific user.
obj.Acl.ResetUser( userId, Access.Read, Access.Write );

// Reset read and write access for a specific user group.
obj.Acl.ResetUserGroup( userId, Access.Read, Access.Write );

// Reset read and write access for logged in users.
obj.Acl.ResetUserGroup( "loggedin", Access.Read, Access.Write );

// Reset read and write access for anonymous users.
obj.Acl.ResetUserGroup( "anonymous", Access.Read, Access.Write );
```

#### Deny access to an object explicitly
Explicitly denying access to objects sets up a deny rule for the given user and action on an object. You should be careful when using this as a deny rule setup for a type cannot be overridden by an allow acl rule at an instance level.
You can remove any explicit acl rules for a user or user group via the `DenyUser` and `DenyUserGroup` methods on the `Acl` property of the object.

``` csharp    
APObject obj = ..;
// Deny read and write access for a specific user.
obj.Acl.DenyUser( userId, Access.Read, Access.Write );

// Deny read and write access for a specific user group.
obj.Acl.DenyUserGroup( userId, Access.Read, Access.Write );

// Deny read and write access for logged in users.
obj.Acl.DenyUserGroup( "loggedin", Access.Read, Access.Write );

// Deny read and write access for anonymous users.
obj.Acl.DenyUserGroup( "anonymous", Access.Read, Access.Write );
```

### Supported types
Acls can be defined for all objects, users and devices. On the SDK, you can apply acls on the corresponding `APObject`, `APUser` and `APDevice` types and their subclasses.

### Filtering
Access control rules act naturally as a secondary level filter over and above the queries that you specify from the client side. As a result, search api calls made using client keys vs master keys may return different results as searches made using the master key will not perform the additional acl based filtering.

### Gotchas
When using access control for you app, you need to be aware of the following gotchas.

1. All access type (`read`, `update`, `create` and `delete`) are discrete and granting one does not automatically imply the other.
2. When an object is created, the user available in the user context is automatically setup as the owner of the object. Owners can perform all operations on an object without any acl setup.
3. Using the master key in the SDK or when making REST api calls will skip all acl evaluation.
 
