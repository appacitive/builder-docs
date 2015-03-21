# Users

Users represent your app's users. There are a host of different functions/features available in the SDK to make managing users easier. The `Appacitive.Users` module deals with user management.

## Create User

There are multiple ways to create users.

### Basic

You create users the same way you create any other data.
```javascript
// set the fields
var userDetails = {
  username: 'john.doe@appacitive.com',
  password: /* password as string */,
  email: 'johndoe@appacitive.com',
  firstname: 'John',
  lastname: 'Doe'
};

// now to create the user
Appacitive.Users.createUser(userDetails).then(function(obj) {
  alert('Saved successfully, id: ' + obj.get('__id'));
}, function(err, obj) {
  alert('An error occured while saving the user.');
});

//or you might create user using basic object route
var newUser = new Appacitive.User(userDetails);

//and then call save on that object
newUser.save().then(function(obj) {
  alert('Saved successfully, id: ' + newUser.get('__id'));
});
```

## Retrieve User

There are three ways you could retreive the user

### By Id
Fetching users by id is exactly like fetching objects/data. Let's say you want to fetch user with `__id` 12345.
```javascript
var user = new Appacitive.User({ __id: '12345'});

user.fetch().then(function (obj) {
  alert('Could not fetch user with id 12345');
});
```
**Note**: All `Appacitive.Object` operations can be performed on `Appacitive.User` object. Infact its a subclass of `Appacitive.Object` class. So, above data documenation is valid for users too.
But, you need a user logged in to perform user-specific operations like update, fetch and delete.
#### By username

```javascript
//fetch user by username
Appacitive.User.getUserByUsername("john.doe").then(function(obj) {
  alert('Could not fetch user with id 12345');
});
```
### By UserToken

```javascript
//fetch user by usertoken
Appacitive.User.getUserByToken("{{usertoken}}").then(function(obj) {
  alert('Could not fetch user with id 12345');
});
```
## Update User
Again, there's no difference between updating a user and updating any other data. It is done via the `save` method.
```javascript
user.set('firstname', 'Superman');
user.save().then(function(obj) {
  alert('Update successful');
});
```

## Delete User
There are 3 ways of deleting a user.
### Delete By Id
```javascript
//To delete a user with an `__id` of, say, 1000.
Appacitive.User.deleteUser('1000').then(function() {
  // deleted successfully
});
```

### Via the object
```javascript
//If you have a reference to the user object, you can just call 'del' on it to delete it.
user.destroy().then(function() {
  // deleted successfully
});
```

#### Deleting the currently logged in user
```javascript
//You can delete the currently logged in user via a helper method.
Appacitive.User.deleteCurrentUser().then(function() {
  // delete successful
});
```
## Authentication

Authentication is the core of user management. You can authenticate (log in) users in multiple ways. Once the user has been authenticated successfully, you will be provided with the user details and access token. This access token identifies the currently logged in user and will be used to implement access control. Each instance of an app can have one logged in user at any given time. You can also explicitly set the accesstoken and tell the SDK to start using the access token.
```javascript
// the access token
// var token = /* ... */

// setting it in the SDK
Appacitive.session.setUserAuthHeader(token);
// now the sdk will send this token with all requests to the server
// Access control has started

// removing the auth token
Appacitive.session.removeUserAuthHeader();
// Access control has been disabled

//Setting accessToken doesn't takes care of setting user associated for it. For that you will need to set current user too specified in further sections.

```
### Signup and login

This method allows to create a user, authenticate it and set it as current user
```javascript
// set the fields
var userDetails = {
    username: 'john.doe@appacitive.com',
  password: /* password as string */,
  email: 'johndoe@appacitive.com',
  firstname: 'John',
  lastname: 'Doe'
};

// now to create the user
Appacitive.User.signup(userDetails).then(function(authResult) {
  console.log(authResult.token);
  alert('Saved successfully, id: ' + authResult.user.get('__id'));
});

//The `authResult` is.
{
    "token": "UjRFNVFKSWdGWmtwT0JhNU9jRG5sV0tOTDlPU0drUE1TQXJ0WXBHSlBreWVYdEtFaWRNV2k3TXlUK1BxSlMwcFp1L09wcHFzQUpSdTB3V3NBOFNVa2srNThYUUczYzM5cGpnWExUOHVMcmNZVmpLTHB4K1RLM3BRS2JtNXJCbHdoMWsxandjV3FFbFFacEpYajlNQmNCdm1HbWdsTHFDdzhlZjJiM0ljRUUyVUY2eUl2cllDdUE9PQ==",
    "user": Appacitive.User object
}
```

### Login via username + password

You can ask your users to authenticate via their username and password.
```javascript

Appacitive.User.login("username", "password").then(function (authResult) {
    // user has been logged in successfully
});

//The `authResult` is similar as given above.
{
    "token": "UjRFNVFKSWdGWmtwT0JhNU9jRG5sV0tOTDlPU0drUE1TQXJ0WXBHSlBreWVYdEtFaWRNV2k3TXlUK1BxSlMwcFp1L09wcHFzQUpSdTB3V3NBOFNVa2srNThYUUczYzM5cGpnWExUOHVMcmNZVmpLTHB4K1RLM3BRS2JtNXJCbHdoMWsxandjV3FFbFFacEpYajlNQmNCdm1HbWdsTHFDdzhlZjJiM0ljRUUyVUY2eUl2cllDdUE9PQ==",
    "user": Appacitive.User object
}
```

## Current User

Whenever you use any signup or login method, the user is stored in localStorage and can be retrieved using `Appacitive.User.current`.So, everytime your app opens, you just need to check this value, to be sure whether the user is logged-in or logged-out.
```javascript
var cUser = Appacitive.User.current();
if (cUser) {
    // user is logged in
} else {
    // user is not logged in
}
```

You can explicitly set the current user as

```javascript
var user = new Appacitive.User({
    __id : '2121312'
    username: 'john.doe@appacitive.com'
    email: 'johndoe@appacitive.com',
    firstname: 'John',
    lastname: 'Doe'
});

Appacitive.User.setCurrentUser(user, token);

//Now current user points to `john.doe`
console.log(Appacitive.User.current().get('__id'));
```

You can clear currentuser, calling `Appacitive.User.logout()` method.
```javascript
var makeAPICall = true

//setting makeAPICall true will tell the SDK to make an API call and invalidate the token
//setting it false won't make an API call and simply reset the token and currentUser

Appacitive.User.logout(makeAPICall).then(function() {
  // user is looged out 
  // this will now be null
  var cUser = Appacitive.User.current();  
});
```

## User Session Management

Once the user has been authenticated successfully, you will be provided with the user details and an access token. This access token identifies the currently logged in user and will be used to implement access control. Each instance of an app can have one logged in user at any given time.By default the SDK takes care of setting and unsetting this token. However, you can explicitly tell the SDK to start using another access token.
```javascript
// the access token
// var token = /* ... */

// setting it in the SDK
Appacitive.session.setUserAuthHeader(token);
// now the sdk will send this token with all requests to the server
// Access control has started

// removing the auth token
Appacitive.session.removeUserAuthHeader();
// Access control has been disabled
```
User session validation is used to check whether the user is authenticated and his usertoken is valid or not.
```javascript

// to check whether user is loggedin locally. This won't make any explicit apicall to validate user
Appacitive.User.validateCurrentUser().then(function(isValid) {
  if(isValid) //user is logged in
});
// to check whether user is loggedin, explicitly making apicall to validate usertoken
// pass true as first argument to validate usertoken making an apicall
Appacitive.User.validateCurrentUser(true).then(function(isValid) {
  if (isValid)  //user is logged in
}); 
```

## Password Management

There're 2 ways users can change their password

* Forgot Password
* Update Password

### Forgot Password

Users often forget their passwords for your app. So you are provided with an API to reset their passwords.To start, you ask the user for his username and call

```javascript
Appacitive.User.sendResetPasswordEmail("{username}", "{subject for the mail}", options)
	.then(function(){
	  alert("Password reset mail sent successfully"); 
	});
```

This'll basically send the user an email, with a reset password link. When user clicks on the link, he'll be redirected to an Appacitive page, which will allow him to enter new password and save it.

You can also send a custom reset password link in the email. Moreover you can also define the email template to be used while sending the reset password email. These options are useful when you're using the same Appacitive app in multiple applications. For further information on custom reset password URL you can refer below.

```javascript
var options = {
  templateName: "demoemailtemplate", //optional: Name of email template to use
  resetLink: "http://www.demolink.com" //optional: Custom reset password link
};

Appacitive.User.sendResetPasswordEmail("{username}", "{subject for the mail}", options)
  .then(function(){
    alert("Password reset mail sent successfully"); 
  });
```
#### Custom URL 

You can also create a custom reset password page or provide a custom reset password page URL from our UI.

On setting custom URL, the reset password link in the email will redirect user to that URL with a reset password token appended in the query string.

```javascript
//consider your url is 
http://customapp.com

//after user clicks on the link, he'll be redirected to this url
http://customapp.com?token=dfwfer43243tfdhghfog909043094
```
The token provided in url can then be used to change the password for that user.

So basically, following flow can be utilized for reset password

1.Validate token specified in URL
```javascript
Appacitive.User.validateResetPasswordToken(token).then(function(user) {
  //token is valid and json user object is returned for that token
});
```
2.If valid then allow the user to enter his new password and save it
```javascript
Appacitive.User.resetPassword(token, newPassword).then(function() {
  //password for user has been updated successfully
});
```

### Update Password
Users need to change their passwords whenever they've compromised it. You can update it using this call:
```javascript
//You can make this call only for a loggedin user
Appacitive.User.current().updatePassword('{oldPassword}','{newPassword}')
	.then(function(){
	  alert("Password updated successfully"); 
	});
```
## Check-in

Users can check-in at a particular co-ordinate uing this call. Basically this call updates users location.
```javascript
Appacitive.User.current().checkin(new Appacitive.GeoCoord(18.57, 75.55))
		.then(function() {
		  alert("Checked in successfully");
		});
```
