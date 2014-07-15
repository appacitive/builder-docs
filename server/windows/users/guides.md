# Users
Most apps have the concept of a user representing the person that is using the app. User management in Appacitive provides all the help that you would need to manage the user life cycle for your app. 

The platform provides an inbuilt User data type which is represented by the `APUser` and `APUsers` class in the .NET SDK. These objects provide all the features required to manage the user lifecycle inside your app.

Also note that User data type extends the core data object. This implies that user objects can essentially be treated just like you would treat an object of any other data type on the platform. Infact, the `APUser` class extends the `APObject` class.

## Registering a new user
The first step in the user lifecycle is usually new user registration.
To do this, simple initialize a new instance of an `APUser` with the required data and call `SaveAsync()`. This will asynchronously create a new user on the Appacitive platform.

```csharp
var user = new APUser()
    {
        "Username" : "john.doe@example.com",
        "Password" : "p@ssw0rd",
        "Email" : "john.doe@example.com",
        "FirstName" : "John",
        "LastName" : "Doe",
        "DateOfBirth" : "15-11-1985"
    };
await user.SaveAsync();
```
Do ensure that that username that you have provided is unique.

## Logging in
Once users are signed up, the next step is generally to log them into your app.
To login a user for your application, your can use the `App.LoginAsync()` method.

```csharp
var credentials = new UsernamePasswordCredentials()
{
    Username : "username@example.com",
    Password : "p@ssw0rd"
};
await App.LoginAsync(credentials);
```

This will authenticate the user credentials that are provided and also set the current logged in user for the app. 

## The current user
After logging into the app, you can access the currently logged in user via the `AppContext.UserContext`. This current user provides a cached access to the logged in user which is available even after the app is restarted. 
The current user's session is also relayed in all API calls to the platform. This enables ACL evaluation for the app on behalf of the logged in user.

```csharp
var credentials = new UsernamePasswordCredentials { .. };
await App.LoginAsync(credentials);

var loggedInUser = AppContext.UserContext.LoggedInUser;
```

You can also subscribe to login and logout events in your app via the `UserLoggedIn` and `UserLoggedOut` events on the `UserContext`.

```csharp
// Login event.
AppContext.UserContext.UserLoggedIn += (s,e) =>
{
    var user = e.User;
    var sessionToken = e.SessionToken;
};
// Logout event
AppContext.UserContext.UserLoggedOut += (s,e) =>
{
    Console.WriteLine("User is now logged out.");
}
```

## Managing passwords
The reset password feature helps user's recover their passwords incase they forget it. Resetting the password for a user will send them an email with a link to page where they can choose a new password. 

Passwords inside Appacitive are never stored in cleartext and are salted and hashed at the time of storage. This means that it is not possible to recover a user's current password. 

To reset password for a user, use the `InitiateResetPasswordAsync()` method on the `APUsers` class.
```csharp
var username = "john.doe@example.com";
await APUsers.InitiateResetPasswordAsync(username);
```

The `ChangePasswordAsync` method let's you change the password for the currently loggedin user.
```csharp
// Change password for the current user.
await APUsers.ChangePasswordAsync(oldPassword, newPassword);
```

## Managing the user session.
Logging in a user creates a user session on the Appacitive platform. This session is represented by a session token that is returned by the platform on successful login. The `UserSession` object allows you to validate or invalidate a user session represented by a session token.

```csharp
var credentials = new UsernamePasswordCredential{..};
await App.LoginAsync();
var sessionToken = AppContext.UserContext.SessionToken;

// Validate the user session.
var isValid = await UserSession.IsValidAsync(sessionToken);
// Invalidate the user session. 
// This will automatically logout the current user as well.
await UserSession.InvalidateAsync(sessionToken);
```

## Basic operations
The `APUser` class extends the `APObject` class. This means that all operations that support `APObject` also support `APUser`. Non-instance methods for users etc are available on the `APUsers` helper class.

### Fetching and updating users
The code sample below shows how you can fetch and update users using the SDK.
```csharp
// Get user.
var user = await APUsers.GetByUsernameAsync(username);
// Update user
var user.SetAttribute("lastSeenOn", DateTime.Now.ToString());
await user.SaveAsync();
```

### Querying users
You can query users via the `APUsers` helper class. The [query syntax](/windows/data-store/guides.html#query-api) is the same as the query syntax for querying `APObject` objects.