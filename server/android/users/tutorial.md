# Users

`Users` represent your app's users. There is a host of different functions/features available in the SDK to make managing users easier. The `AppacitiveUser` type deals with user management.

## Create 

There are two ways to sign-up a new user.

### Basic 

You create users the same way you create any other data.

```
        AppacitiveUser user = new AppacitiveUser();
        user.setFirstName("John");
        user.setUsername("johhn.doe");
        user.setEmail("jdoe@example.com");
        user.setPassword("p@ssw0rd");
        user.signupInBackground(new Callback<AppacitiveUser>() {
            @Override
            public void success(AppacitiveUser result) {
                assert result.getId() > 0;
            }
        });
```

### Signup with facebook

You can also signup a new user on your app using his facebook access token

```
        final String fbToken = "XXXXXXXXXXXXXXXXXXXXXXXXXXX";
        AppacitiveUser.signupWithFacebookInBackground(fbToken, new Callback<AppacitiveUser>() {
            @Override
            public void success(AppacitiveUser user) {
                assert result.getId() > 0;                
            }
        });
```

## Retrieve

There are three ways you could retrieve a existing user.

### By id

Fetching users by by their unique `__id` is exactly like fetching objects or connections. Let's say you want to fetch user with id *12345*,

```
			List<String> fieldsToFetch = null;
            AppacitiveUser.getByIdInBackground(12345, fieldsToFetch, new Callback<AppacitiveUser>() {
                @Override
                public void success(AppacitiveUser user) {

                }
            });
```

### By username

```
			List<String> fieldsToFetch = null;
            AppacitiveUser.getByUsernameInBackground("john.doe", fieldsToFetch, new Callback<AppacitiveUser>() {
                @Override
                public void success(AppacitiveUser user) {

                }
            });
```

## Update

Updating a `AppacitiveUser` is similar to updating a `AppacitiveObject`. Updates can be applied to the backend via the `updateInBackground` method.

```
        List<String> fieldsToFetch = null;
        final boolean updateWithRevision = false;
        try {
            AppacitiveUser.getByUsernameInBackground("john.doe", fieldsToFetch, new Callback<AppacitiveUser>() {
                @Override
                public void success(AppacitiveUser user) {
					//	update the email address for the user
                    user.setEmail("updated_email@example.com");
                    try {
                        user.updateInBackground(updateWithRevision, new Callback<AppacitiveUser>() {
                            @Override
                            public void success(AppacitiveUser updatedUser) {

                            }
                        });
                    } catch (UserAuthException e) {
                        
                    }
                }
            });
        } catch (UserAuthException e) {
        }
```

## Delete

You can delete a user using his *username* or *id* or directly call `deleteInBackground` on the `AppacitiveUser` object itself.

```
        boolean deleteConnections = false;
        try {
            AppacitiveUser.deleteInBackground(12345, deleteConnections, new Callback<Void>() {
                @Override
                public void success(Void result) {
                }
            });
        } catch (UserAuthException e) {
            
        }
```

# Authentication

Authentication is the core of user management. You can authenticate (*log in*) users in multiple ways. Once the user has authenticated successfully, you will be provided the user's details and an access token. This access token identifies the currently logged in user session. You can also initialize the app with this token. This will send this token with every API call to Appacitive. This way the API can infer that the given call is made in the context of the logged in user. Access control rules may also dictate the need to send this token.

```
	//	To initialize the app with an existing token
	AppacitiveContext.setLoggedInUserToken("xxxxxxxxxxxxxxxxxxxx");

	// To authenticate and initialize the app with the logged in user
	long expiry = -1;
    int attempts = -1;
    AppacitiveUser.loginInBackground("john.doe", "p@ssw0rd", expiry, attempts, new Callback<AppacitiveUser>() {
        @Override
        public void success(AppacitiveUser user) {
            
        }
    });
	
```

## Login via username + password

You can ask your users to authenticate via their username and password.

```

	long expiry = -1;
    int attempts = -1;
    AppacitiveUser.loginInBackground("john.doe", "p@ssw0rd", expiry, attempts, new Callback<AppacitiveUser>() {
        @Override
        public void success(AppacitiveUser user) {
            System.out.println(AppacitiveContext.getLoggedInUser().getUsername());
        	System.out.println(AppacitiveContext.getLoggedInUserToken());
        }
    });
```

## Login with Facebook

You can ask your users to log in via Facebook. To do this, you will need to implement the Facebook oauth handshake in your app to get the user access token. You can use the Facebook SDK specific to your platform for this purpose. Once you have the access token, simply call `loginWithFacebookInBackground` with the Facebook token.

```

	String facebookToken = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
    AppacitiveUser.loginWithFacebookInBackground(facebookToken, new Callback<AppacitiveUser>() {
        @Override
        public void success(AppacitiveUser user) {

        }
    });
```

## Login with Twitter

You can ask your users to log in via Twitter. This will require you to implement Twitter login and provide the SDK with `consumer key`, `consumer secret`, `oauth token` and `oauth token secret`. 

You can choose to store the `consumer key` and `consumer secret` once through the management portal. This way you need not pass it again with every call. Go to *modules* -> *users* -> *social login* to access your Facebook and Twitter settings.

```
	AppacitiveUser.loginWithTwitterInBackground(consumerKey, consumerSecret, oAuthToken, oAuthTokenSecret, new Callback<AppacitiveUser>() {
	    @Override
	    public void success(AppacitiveUser user) {
	        
	    }
	});
```

## Current user

Whenever you authenticate a user using the `AppacitiveUser.login...()` method, the user is stored in the platform specific local environment and can be retrieved using `AppacitiveContext.getLoggedInUser()`.

```
    AppacitiveUser currentUser = AppacitiveContext.getLoggedInUser();
    String userToken = AppacitiveContext.getLoggedInUserToken();
```

You can clear the current logged in user by calling `AppacitiveContext.logout()` method. The `AppacitiveContext` class also provides setters for *current user* and *user token*.

# Password Management

Users often forget their passwords for your app. So you are provided with an API to reset their passwords. This API emails a single use URL for resetting the password to the user's email address.

```
        AppacitiveUser.sendResetPasswordEmailInBackground("john.doe", "Reset Password Email Subject", new Callback<Void>() {
            @Override
            public void success(Void result) {

            }
        });
```

If a user wishes to change his/her password, you can use the `updatePasswordInBackground()` method. 