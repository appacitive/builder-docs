# User Management
----

Users represent your app's users. There is a host of different functions/features available in the SDK to make managing users easier. The `APUser` interface deals with user management.

## Create

There are multiple ways to create users.

### Basic

You create users the same way you create any other data.

```objectivec
APUser *spencer = [[APUser alloc] init];
spencer.username = @"spencemag";
spencer.firstName = @"Spencer";
spencer.lastName = @"Maguire";
spencer.email = @"spencer.maguire@email.com";
spencer.phone = @"9421234567";
spencer.password = @"H3LL0_K177Y";

[spencer createUser];
```

### Creating Users via Facebook

You can give your users the option of signing up or logging in via Facebook. For this you need to

 1. [Setup Facebook app](https://developers.Facebook.com/apps).
 2. Follow [these](https://developers.Facebook.com/docs/reference/ios/current/) instructions to [include Facebook SDK](https://developers.Facebook.com/docs/reference/ios/current/) in your app.


To create a user with Facebook, you need the user's Facebook access token and you need to pass it to the `createUserWithFacebook:` method.

```objectivec
APUser *spencer = [[APUser alloc] init];
[spencer createUserWithFacebook:@"Hsdfbk234kjnbkb23k4JLKJ234kjnkkJK2341nkjnJSD"];
```

Similarly you can also create a user with Twitter Oauth v1.0 and Oauth v2.0.

## Retrieve

There are three ways you could retrieve the user

### By id.
Fetching users by id is exactly like fetching objects/data. Let's say you want to fetch user with `__id` 12345.

```objectivec
APUser *johndoe = [[APUser alloc] initWithTypeName:@"user" objectId:@"12345"];
    [johndoe fetch];
```

**NOTE**:  The `APUser` class is a subclass of `APObject` class. Therefore, all `APObject` operations can be performed on an `APUser` object, but you will need a user logged in to perform user-specific operations like update, fetch and delete.

### By username

```objectivec
APUser *spencer = [[APUser alloc] init];
spencer.username = @"spencemag";
[spencer fetch];    ```

### By UserToken

```objectivec
APUser *spencer = [[APUser alloc] init];
[spencer fetchUserWithUserToken:@"25jkhv5k7h8vl4jh5b26l3j45"];
```

## Update
Again, there's no difference between updating a user and updating any other data. It is done via the `update` method.

```objectivec
APUser *spencer = [[APUser alloc] init];
[spencer fetchUserByUserName:@"spencemag"];
[spencer setUsername:@"spencer.maguire"];
[spencer updateObject];
```

## Delete
There are 2 ways of deleting a user.
### Via the user id

```objectivec
APUser *spencer = [[APUser alloc] initWithTypeName:@"user" objectId:@"123456"];
[spencer deleteObject];
    ```

### Via the username

```objectivec
APUser *spencer = [[APUser alloc] init];
[spencer deleteObjectWithUserName:@"spencer.maguire"];
```

## Authentication

Authentication is the core of user management. You can authenticate (log in) users in multiple ways. Once the user has authenticated successfully, you will be provided the user's details and an access token. This access token identifies the currently logged in user and will be used to implement access control. Each instance of an app can have one logged in user at any given time. When you call any of the authenticate methods provided by the SDK, on successful authentication, the SDK will set the user's access token to the token provided by Appacitive. The APUser class also provides a static instance called `currentUser`. This instance will also be instantiated with the user object returned by appacitive when the call to the `authenticate` method returns success. The `userToken` and `currentUser` are read-only and can only be set by successfully authenticating a user.

### Login via username + password

You can ask your users to authenticate via their username and password.

```objectivec
[APUser authenticateUserWithUserName:@"spencer.maguire" password:@"H3LL0_K177Y"];
```


### Login with Facebook

You can ask your users to log in via Facebook. The process is very similar to signing up with fFacebook.

```objectivec
[APUser authenticateUserWithFacebook:@"23klj4bkjl23bn4knb23k4ln"];
```

### Login with Twitter

You can ask your users to log in via Twitter. This'll require you to implement twitter login and provide the SDK with consumerkey, consumersecret, oauthtoken and oauthtokensecret. There are two version of Twitter's Oauth authentication that the SDK provides, viz. the Oauth1.0 and Oauth2.0

```objectivec
//Oauth1.0
[APUser authenticateUserWithTwitter:@"kjbknkn23k4234" oauthSecret:@"5n33h4b5b"];

//Oauth2.0
    [APUser authenticateUserWithTwitter:@"3kjn2k34n" oauthSecret:@"2m34234n" consumerKey:@"2vhgv34v32hg" consumerSecret:@"sdfg087fd9"];
```

## User Session Management

Once the user has authenticated successfully, you will be provided the user's details and an access token. This access token identifies the currently logged in user and will be used to implement access control. Each instance of an app can have one logged in user at any given time.By default the SDK takes care of setting and unsetting this token. However, you can explicitly tell the SDK to start using another access token.

```objectivec
//Get the currently logged-in user object.
APUser *user = [APUser currentUser];

//Log out the currently logged-in user.
[APUser logOutCurrentUser];

//Validate the currentUser's sesion.
[APUser validateCurrentUserSessionWithSuccessHandler:^(NSDictionary *result) {
    NSLog(@"Current user session is valid");
} failureHandler:^(APError *error) {
    NSLog(@"Current user session is invalid");
}];
```
