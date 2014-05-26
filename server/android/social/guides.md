# Social Integration

You can use social identities to simplify user management in your app. By offering options for your users to log in using their Facebook or Twitter accounts, you eliminate a source of friction by not requiring that users create app specific usernames and passwords just for your app.

With Appacitive you can link multiple social identities against the same Appacitive user and switch between them as needed. This allows you to offer multiple login options (eg. Login with Facebook and/or Login with Twitter and/or native email login) in your app.

# Facebook

Login with Facebook is a very popular approach for logging in users into your app. You must integrate the [Facebook Android SDK](https://developers.facebook.com/docs/android/login-with-facebook/v2.0) into your app and perform the login flow as described.

Then pass the generated OAuth token to appacitive to create a new appacitive user with their facebook account linked to their appacitive account. 

If the user already exists on appacitive, this call simply returns the existing user in the success callback.

## Signup new user

```
        AppacitiveUser.signupWithFacebookInBackground(facebookToken, new Callback<AppacitiveUser>() {
            @Override
            public void success(AppacitiveUser user) {
                
            }
        });
```

## Login existing user

For successive logins into your app, you can simply login an existing user using their facebook token.

```
        AppacitiveUser.loginWithFacebookInBackground(facebookToken, new Callback<AppacitiveUser>() {
            @Override
            public void success(AppacitiveUser user) {

            }
        });
```

# Twitter

Another popular login approach is logging in users with their Twitter accounts. 
You should first head to the social settings on the management portal via *modules* -> *users* -> *social login* and enter the details consumer key and consumer secret of your twitter app.

## Signup new user with Twitter

```
        AppacitiveUser.signupWithTwitterInBackground(oauthToken, oauthTokenSecret, new Callback<AppacitiveUser>() {
            @Override
            public void success(AppacitiveUser user) {

            }
        });
```
This call will authenticate an existing appacitive user with the provided twitter details or create one if a appacitive user does not exist with the specified twitter details.

You can choose to pass the consumerKey and consumerSecret with every login or signup call to appacitive or simply store it once on the management portal.

## Login with Twitter

```
        AppacitiveUser.loginWithTwitterInBackground(oauthToken, oauthTokenSecret, new Callback<AppacitiveUser>() {
            @Override
            public void success(AppacitiveUser user) {

            }
        });
```

This call will invoke the failure handler in case a appacitive user does not exist with the following twitter account.

# Login with email and password

You can choose to provide native email/password login for your users and later link their facebook/ twitter accounts as required.


```
        AppacitiveUser.loginInBackground(username, password, expiry, attempts, new Callback<AppacitiveUser>() {
            @Override
            public void success(AppacitiveUser user) {

            }
        });
```

The `expiry` metions for how long (in minutes) the generated appacitive auth token should be valid since the last api call using it. 
The `attempts` parameter specifies how many times the generated auth token can be used.

Use -1 for default values of both parameters.

Once an auth token gets invalidated, you'll have to generate a new one by authenticating the user again.



