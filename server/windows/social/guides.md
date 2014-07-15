# Social Integration

The Appacitive .NET SDK allows you to use your Facebook and Twitter accounts for authenticating, signing-up. It becomes really easy for the users of your application to authenticate themselves or create user accounts using their existing Facebook or Twitter accounts.

## Facebook
Using the following code you create or login users using Facebook.

### Setup
1. [Setup a Facebook app](https://developers.Facebook.com/apps).

### Creating Users via Facebook
To create a new user from Facebook, you can use the OAuth2 class. 
Before you call that, you will need the User Facebook access token which you can get by using the [Facebook SDK](https://developers.Facebook.com).
Once you have got the token you write the following code

```csharp
var authType = "facebook";
var facebookAccessToken = "laksjalsjd... "; // Facebook access token from oauth handshake
var facebookCredentials = new OAuth2Credentials(
    facebookAccessToken, 
    authType);
facebookCredentials.CreateUserIfNotExists = true;  // This will also create a user if it does not existing in the system.
var session = await facebookCredentials.AuthenticateAsync();

// Alternatively, you could have used the following as well.
await AppContext.LoginAsync(facebookCredentials);
```

The `CreateUserIfNotExists` is used to tell Appacitive whether or not it needs to create a new user or not. 
So if it is set to `true` and the User does not exist on Appacitive, a new user will be created. 


### Login via Facebook

You can the above code to login existing users via Facebook. 
By changing the value of `CreateUserIfNotExists` to `false`, a new User will not be created on Appacitive in case the login fails.


## Twitter 
Similarly you can checkout the following code to create or login users using Twitter.

### Setup
1. [Setup Twitter OAuth](https://oauth.io/docs)

### Creating Users via Twitter
To create new users via Twitter you will need the consumerkey, consumersecret, oauthtoken and oauthtokensecret.
This can be got by the using the twitter SDK.
Afer you have got the above values you can use the following code 

```csharp
//For login with twitter, pass twitter credentials to SDK
var twitterCredentials = new OAuth1Credentials(
    consumerKey, 
    consumerSecret, 
    accessToken, 
    accessSecret, 
    "twitter");
twitterCredentials.CreateUserIfNotExists = true;
var session = await twitterCredentials.AuthenticateAsync();
```

### Login via Twitter
You can the above code to login existing users via Twitter. 
By changing the value of `CreateUserIfNotExists` to `false`, a new User will not be created on Appacitive in case the login fails.


