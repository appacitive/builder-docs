## User Management

Users represent your app's users. There is a host of different functions/features available in the SDK to make managing users easier. The `APUser` interface deals with user management.

### Create

There are multiple ways to create users.

#### Basic

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

#### Creating Users via Facebook

You can give your users the option of signing up or logging in via Facebook. For this you need to

 1. [Setup Facebook app](https://developers.Facebook.com/apps).
 2. Follow [these](https://developers.Facebook.com/docs/reference/ios/current/) instructions to [include Facebook SDK](https://developers.Facebook.com/docs/reference/ios/current/) in your app.


To create a user with Facebook, you need the user's Facebook access token and you need to pass it to the `createUserWithFacebook:` method.

```objectivec
APUser *spencer = [[APUser alloc] init];
[spencer createUserWithFacebook:@"Hsdfbk234kjnbkb23k4JLKJ234kjnkkJK2341nkjnJSD"];
```

Similarly you can also create a user with Twitter Oauth v1.0 and Oauth v2.0.

### Retrieve

There are three ways you could retrieve the user

#### By id.
Fetching users by id is exactly like fetching objects/data. Let's say you want to fetch user with `__id` 12345.

```objectivec
APUser *johndoe = [[APUser alloc] initWithTypeName:@"user" objectId:@"12345"];
    [johndoe fetch];
```

**NOTE**:  The `APUser` class is a subclass of `APObject` class. Therefore, all `APObject` operations can be performed on an `APUser` object, but you will need a user logged in to perform user-specific operations like update, fetch and delete.

#### By username

```objectivec
APUser *spencer = [[APUser alloc] init];
spencer.username = @"spencemag";
[spencer fetch];    ```

#### By UserToken

```objectivec
APUser *spencer = [[APUser alloc] init];
[spencer fetchUserWithUserToken:@"25jkhv5k7h8vl4jh5b26l3j45"];
```

### Update
Again, there's no difference between updating a user and updating any other data. It is done via the `update` method.

```objectivec
APUser *spencer = [[APUser alloc] init];
[spencer fetchUserByUserName:@"spencemag"];
[spencer setUsername:@"spencer.maguire"];
[spencer updateObject];
```

### Delete
There are 2 ways of deleting a user.
#### Via the user id

```objectivec
APUser *spencer = [[APUser alloc] initWithTypeName:@"user" objectId:@"123456"];
[spencer deleteObject];
    ```

#### Via the username

```objectivec
APUser *spencer = [[APUser alloc] init];
[spencer deleteObjectWithUserName:@"spencer.maguire"];
```

### Authentication

Authentication is the core of user management. You can authenticate (log in) users in multiple ways. Once the user has authenticated successfully, you will be provided the user's details and an access token. This access token identifies the currently logged in user and will be used to implement access control. Each instance of an app can have one logged in user at any given time. When you call any of the authenticate methods provided by the SDK, on successful authentication, the SDK will set the user's access token to the token provided by Appacitive. The APUser class also provides a static instance called `currentUser`. This instance will also be instantiated with the user object returned by appacitive when the call to the `authenticate` method returns success. The `userToken` and `currentUser` are read-only and can only be set by successfully authenticating a user.

#### Login via username + password

You can ask your users to authenticate via their username and password.

```objectivec
[APUser authenticateUserWithUserName:@"spencer.maguire" password:@"H3LL0_K177Y"];
```


#### Login with Facebook

You can ask your users to log in via Facebook. The process is very similar to signing up with fFacebook.

```objectivec
[APUser authenticateUserWithFacebook:@"23klj4bkjl23bn4knb23k4ln"];
```

#### Login with Twitter

You can ask your users to log in via Twitter. This'll require you to implement twitter login and provide the SDK with consumerkey, consumersecret, oauthtoken and oauthtokensecret. There are two version of Twitter's Oauth authentication that the SDK provides, viz. the Oauth1.0 and Oauth2.0

```objectivec
//Oauth1.0
[APUser authenticateUserWithTwitter:@"kjbknkn23k4234" oauthSecret:@"5n33h4b5b"];

//Oauth2.0
    [APUser authenticateUserWithTwitter:@"3kjn2k34n" oauthSecret:@"2m34234n" consumerKey:@"2vhgv34v32hg" consumerSecret:@"sdfg087fd9"];
```

### User Session Management

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

### Linking and Unlinking accounts

#### Linking Facebook account

**NOTE:** Here, we assume that the user has already logged-in with Facebook.

If you want to associate an existing loggedin APUser to a Facebook account, you can do it as shown below.

```objectivec
APUser *user = [APUser currentUser];
[user linkFacebookAccountWithAccessToken:@"jlj4jl2lj34jl324ljhb23lj4b"];
});
```

#### Create Facebook linked accounts

**NOTE:** Here, we assume that the user has already logged-in with Facebook.

If you want to associate a new APUser to a Facebook account, you can simply use the `authenticateUserWihFacebook` method.


#### Linking Twitter account

**NOTE:** Here, we assume that the user has already logged-in with Twitter.

If you want to associate an existing loggedin APUser to a Twitter account, you can link it like so

```objectivec
//Oauth1.0
[user linkTwitterAccountWithOauthToken:@"234kjb23k4bk23b4" oauthSecret:@"23d4kj32n4kjbk32bn4k"];

//Oauth2.0
 [user linkTwitterAccountWithOauthToken:@"kj3h24k234b" oauthSecret:@"23hb4jh2b3j4" consumerKey:@"2jh3lb4jh2b34" consumerSecret:@"2j3b4j234jb"];
```

#### Create Twitter linked accounts

**NOTE:** Here, we assume that the user has already logged-in with Twitter.

If you want to associate a new APUser to a Twitter account, you can simply use the authenticateUserWithTwitter method.


#### Retreiving linked accounts

```objectivec
//Retrieveing a specific linked account with service name viz. facebook or twitter.
[user getLinkedAccountWithServiceName:@"twitter" successHandler:^(NSDictionary *result) {
    NSLog(@"Linked twitter account details:%@",[result description]);
}];

//Retrieving
[user getAllLinkedAccountsWithSuccessHandler:^(NSDictionary *result) {
    NSLog(@"All Linked account details:%@",[result description]);
}];

```

#### Delinking Facebook account

```objectivec
[user delinkAccountWithServiceName:@"facebook"];
});
```

### Password Management

#### Reset Password

Users often forget their passwords for your app. So you are provided with an API to reset their passwords.To start, you ask the user for his username and call

```objectivec
[user sendResetPasswordEmailWithSubject:@"APPACITIVE : Reset your password"];
```

This will send the user an email, with a reset password link. When user clicks on the link, he'll be redirected to an Appacitive page, which will allow him to enter new password and save it.

#### Update Password
Users need to change their passwords whenever they've compromised it. You can update it using this call:

```objectivec
[user changePasswordFromOldPassword:@"0LDP4$$W0RD" toNewPassword:@"N3WP4$$W0RD"];});
```
### Check-in

Users can check-in at a particular co-ordinate using this call.

```objectivec
[APUser setUserLocationToLatitude:@"23.27" longitude:@"72.30" forUserWithUserId:@"spencer.maguire"];
});
```