# Using the SDK in a server side app.

## What do you mean by server side app?
Apart from being used in a mobile app, the Appacitive SDK can also be used in a server side or desktop
environment. The SDK provides inbuilt support for platforms like WCF, ASP.net as well as desktop and windows services.

## What is different for server side apps ?
Unlike mobile apps which are generally "single user", server side applications are usually client-server based
where the same "single user" assumption is applicable on a per request basis. As multiple users interact with the server side
app simultaneously, each request will be in the context of a different user.

Existing web frameworks like WCF and ASP.net already provide all the necessary infrastructure to manage user sessions across requests.
The SDK uses these existing session abstractions to provide the same seamless features like `AppContext.UserContext.LoggedInUser` without
you having to worry about managing user sessions yourself.


## So how do I use the SDK in a server side app?
On a mobile device, different OS versions may provide different capabilities. Similarly depending on the kind of server side
app, certain runtime functionality may vary. For this reason, when using the SDK in a server side app, the SDK needs to know
what kind of runtime environment it is running inside.

The code samples below shows how this can be done for desktop, WCF and ASP.net applications.

#### Initializing the SDK for desktop, console or windows service app.
``` csharp

/// Add the following code in the main() method for your desktop app.
AppContext.Initialize( {appId}, {apikey}, {environment}, {settings});

```

#### Initializing the SDK for WCF service
``` csharp

/// Add the following code in the global.asax for your WCF service
AppContext.InitializeForWcf( {appId}, {apikey}, {environment}, {settings});

```

#### Initializing the SDK for ASP.net application
``` csharp

/// Add the following code in the global.asax for your ASP.net application
AppContext.InitializeForAspnet( {appId}, {apikey}, {environment}, {settings});

```
