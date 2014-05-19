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

