# Social Integration

You can use social identities to simplify user management in your app. By offering options for your users to login using their Facebook or Twitter accounts, you eliminate a source of friction by not requiring that users create app specific usernames and passwords just for your app.

With Appacitive you can register multiple social identities against the same Appacitive user and switch between them as needed. This allows you to offer multiple login options (e.g.: Login with Facebook and Login with Twitter) in your app.

## Facebook

Appacitive provides an easy way to integrate Facebook in your application. For twitter you will need to integrate their login flow. Using our Facebook integration, you can associate an authenticated Facebook user with Appacitive.User. With just a few lines of code, you'll be able to provide a "log in with Facebook" option in your app, and be able to save their data to Appacitive.

### Setting Up Facebook

To start using Facebook with Appacitive, you need to:

1. <a href="https://developers.facebook.com/apps" target="_blank">Setup Facebook app <i class="glyphicon glyphicon-share-alt"></i></a>.
2. Follow these instructions to <a href="https://developers.facebook.com/docs/reference/javascript/" target="_blank">include Facebook SDK <i class="glyphicon glyphicon-share-alt"></i></a> in your app.
3. Replace your call to FB.init() with a call to `Appacitive.Facebook.initialize()`. This is how you need to do it

```javascript
window.fbAsyncInit = function() {
  Appacitive.Facebook.initialize({
    appId      : 'YOUR_APP_ID', // Facebook App ID
    version    : 'v2.3',
    status     : false, // check login status
    cookie     : true, // enable cookies to allow Appacitive to access the session
    xfbml      : true  // parse XFBML
  });
  // Additional initialization code here
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
```

### Login & Signup via Facebook

Once you're done including and setting up Facebook SDK in your app, you can start signing up users.
`Appacitive.Facebook` provides a way to log in or sign up through Facebook. This is accomplished using the requestLogin() method: 

```javascript
//Registering via facebook is done like so

//Login with facebook
Appacitive.Facebook.requestLogin().then(function(fbResponse) {
  console.log('Facebook login successfull with access token: ' 
  												+ Appacitive.Facebook.accessToken());
  
  // signup with Appacitive
  return Appacitive.User.loginWithFacebook(Appacitive.Facebook.accessToken(), 
                                                                { create: true });

}).then(function (authResult) {
  // user has been successfully signed up and set as current user
  // authresult contains the user and Appacitive-usertoken
}, function(err) {
  if (Appacitive.Facebook.accessToken()) {
    // there was an error during facebook login
  } else {
    // there was an error signing up the user
  }
});

```
So simple? Indeed. These're the steps followed

1. The user is shown Facebook login modal.
2. After the user logs in successfully, SDK gets the accessToken which can be set and retrieved using `Appacitive.Facebook.AccessToken()`, and sends it to our App
3. Our app gets the userinfo for that accessToken and saves it to an `Appacitive User`. If it's a new user based on the Facebook ID, then that user is created.
4. After saving, the user is set as current user

The method `Appacitive.User.loginWithFacebook` will attempt to login an existing user with the obtained token. If such a user does not exist, it creates a new user and associates the Facebook ID with that user. If you do not want to perform the last step of creating a new user, don't send create:true in second argument.

The success callback is given one argument: `authresult`
```javascript
{
    "token": "user_token",
    "user": Appacitive.User object
}
```
* The `token` field is the user token. This is similar to the session token, but instead of authenticating the app with the server, it authenticates the logged in user with the app. More on this later, in the authentication section.
* The `user` field is the Appacitive User object. The data that exists in the user field got pulled from facebook when he/she logged in.

**Note**: For nodejs you just need to set the `Appacitive.Facebook.accessToken()` value, and call `Appacitive.User.loginWithFacebook` with the token.

```javascript
//Token retreived from Facebook
var token = "your_fb_token";

//Set token
Appacitive.Facebook.accessToken(token);

//Call login
Appacitive.User.loginWithFacebook(token);
```

### Permissions

You may optionally provide a comma-separated string that specifies what permissions your app requires from the Facebook user in the options object as a `scope` property to the method `Appacitive.Facebook.requestLogin`.

```javascript```
var options = { scope: 'email' }; //a comma-separated list of the permissions
Appacitive.Facebook.requestLogin(options).then(function(response) {
    console.log('Facebook login successfull');
}, function() {
  console.log('Facebook login failed');
});
```

`Appacitive.User` integration doesn't require any permissions to work out of the box (ie. null or specifying no permissions is perfectly acceptable). Read more about <a href="https://developers.facebook.com/docs/reference/api/permissions/" target="_blank">permissions<i class="glyphicon glyphicon-share-alt"></i></a> on Facebook's developer guide.

### Linking Facebook account

**Note:** here, we consider that the user has already logged-in with Facebook.

If you want to associate an existing loggedin Appacitive.User to a Facebook account, you can link it like so

```javascript
var user = Appacitive.User.current();
user.linkFacebook(Appacitive.Facebook.accessToken()).then(function(obj) {
  //You can access linked accounts of a user, using this field
  console.dir(user.linkedAccounts()); 
});
```

### Create Facebook linked accounts

**Note:** here, we consider that the user has already logged-in with Facebook.

If you want to associate a new Appacitive.User to a Facebook account, you can link it like so
```javascript
//create user object
var user = new Appacitive.User({
  username: 'john.doe@appacitive.com',
  password: /* password as string */,
  email: 'johndoe@appacitive.com',
  firstname: 'John',
  lastname: 'Doe' 
});

//link facebook account
user.linkFacebook(Appacitive.Facebook.accessToken());

//create the user on server
user.save().then(function(obj) {
  console.dir(user.linkedAccounts());
});
```

### Delinking Facebook account
```javascript
//specify account which needs to be delinked
Appacitive.User.current().unlink('facebook').then(function() {
  alert("Facebook account delinked successfully");
});
```

## Twitter

Fot twitter login you can use <a href="https://oauth.io/docs"> OAuth.io <i class="glyphicon glyphicon-share-alt"></i></a>.

### Login & Signup via Twitter

You can ask your users to log or signup in via Twitter. This'll require you to implement twitter login and provide the SDK with consumerkey, consumersecret, oauthtoken and oauthtokensecret.  This'll also create a new user if it doesn't exist.
```javascript
//For login with twitter, pass twitter credentials to SDK
Appacitive.User.loginWithTwitter({
  oauthtoken: {{twitterObj.oAuthToken}} ,
  oauthtokensecret: {{twitterObj.oAuthTokenSecret}},
  consumerKey: {{twitterObj.consumerKey}},
  consumerSecret: {{twitterObj.consumerSecret}}
}, { 
	create: false  // DIsbale creating new user
}).then(function(authResult){
  //User logged-in successfully
});

//As before the `authResult` parameter is the same.
{
    "token": "some_token",
    "user": Appacitive.User object
}
```

The method `Appacitive.User.loginWithTwitter` will attempt to login an existing user with the obtained token. If such a user does not exist, it creates a new user and associates the Twiiter ID with that user. If you do not want to perform the last step of creating a new user, you can pass in the create: false option as third argument to the method.

### Linking Twitter account

If you want to associate an existing loggedin Appacitive.User to a Twitter account, you can link it like so

```javascript
var user = Appacitive.User.current();
user.linkTwitter({
  oauthtoken: {{twitterObj.oAuthToken}} ,
  oauthtokensecret: {{twitterObj.oAuthTokenSecret}},
  consumerKey: {{twitterObj.consumerKey}},
  consumerSecret: {{twitterObj.consumerSecret}}
}).then(function(obj) {
  //You can access linked accounts of a user, using this field
  console.dir(user.linkedAccounts()); 
});
```

### Create Twitter linked accounts

If you want to associate a new Appacitive.User to a Twitter account, you can link it like so
```javascript
//create user object
var user = new Appacitive.User({
  username: 'john.doe@appacitive.com',
  password: /* password as string */,
  email: 'johndoe@appacitive.com',
  firstname: 'John',
  lastname: 'Doe' 
});

//link twitter account
user.linkTwitter({
  oauthtoken: {{twitterObj.oAuthToken}} ,
  oauthtokensecret: {{twitterObj.oAuthTokenSecret}},
  consumerKey: {{twitterObj.consumerKey}},
  consumerSecret: {{twitterObj.consumerSecret}}
});

//create the user on server
user.save().then(function(obj) {
  console.dir(user.linkedAccounts());
});
```

### Delinking Twitter account
```javascript
//specify account which needs to be delinked
Appacitive.User.current().unlink('twitter').then(function() {
  alert("Twitter account delinked successfully");
});
```

## Creating Other Social accounts

Apart from Facebook and Twitter, Appacitive also supports Google Plus login.
```javascript
Appacitive.User.authenticateUser({
  "accesstoken": accessToken,
  "type": "googleplus", //name of the provider
  "createnew": true    //will create a new user if it doesn't exists
}, options, 'GP');
```
If you pass `createnew: false`, then Appacitive will try to find a user for that accessToken. If it exists then you'll get a user object and a token in the response. If it doesn't exist then you'll get an error.

## Retreiving all linked accounts
```javascript
Appacitive.User.current().getAllLinkedAccounts().then(function() {
  console.dir(Appacitive.User.current().linkedAccounts());
});
```

## Setting user properties while registration

While using social signup , if you want to store some additional user properties in the user object, you can achieve this by sending the `user` object in the `options` parameter.

```javascript
// Create user object
var user = new Appacitive.user();
user.set('profile_pic', 'http://lorempixel.com/64/64/people');
```

*Using loginWithFacebook*
```javascript
Appacitive.User.loginWithFacebook(Appacitive.Facebook.accessToken(), { create: true, user: user });
```

*Using loginWithTwitter*
```javascript
Appacitive.User.loginWithTwitter({
  oauthtoken: {{twitterObj.oAuthToken}} ,
  oauthtokensecret: {{twitterObj.oAuthTokenSecret}},
  consumerKey: {{twitterObj.consumerKey}},
  consumerSecret: {{twitterObj.consumerSecret}}
}, { create: true, user: user });
```

*Using Universal Social Login*
```javascript
Appacitive.User.authenticateUser({
  "accesstoken": accessToken,
  "type": "googleplus", //name of the provider
  "createnew": true    //will create a new user if it doesn't exists
}, {
  user: user
}, 'GP');
```

On a related note: This feature allows you to set mandatory properties on the user type if you're using the above mentioned API for signups.

