# Error handling in the SDK

The SDK functions report their success or failure using an object with callbacks, similar to a Backbone "options" object. The two primary callbacks used are success and error. The success callback is called whenever an operation completes without errors.

The error callback is called for any kind of error that occurs when interacting with the Appacitive API's over the network. These errors are either related to problems connecting to the server or problems performing the requested operation. 

## Error Types

On failure, all functions return an `Appacitive.Error` object. This object holds these properties:

* `code` holds a generic error code. The code can be used to program against.
* `message` contains a short, user-friendly, description of the error.
* `additionalMessages` contains a list of messages. This property is not always populated.
* `referenceId` contains a unqiue id for the call, which you can report to us in case of any issues.

The SDK provides its own error space for these error with each type. The table below details the complete error space for the SDK.

### API Failures

The following errors are return in case the api returns a non 2xx status code.
Depending upon the status code returned via the api, specific errors are returned.

| Error Type | Status Code | Details |
|:------------- |:-------------:|:-------------|
| `BadRequest` | `400` | Bad request or invalid request data. |
| `AccessControl` | `401` | The current user does not have access on the requested data. |
| `PaymentRequired` | `402` | The appacitive subcription for the application is invalid or has expired. |
| `UsageLimitExceeded` | `403` | API burst limits have been exceeded. |
| `NotFound` | `404` | The requested data was not found on the backend server. |
| `MvccFailure` | `409` | The revision of the data to be updated was different from the revision on the client. |
| `PreconditionFailed` | `412` |  A dependent pre conditional operation did not succeed.  |
| `ApiAuthenticationError` | `420` | Invalid api key or api session token. |
| `IdentityFailures` | `421` | Invalid user credentials or session token. |
| `UserAuthenticationError` | `421` | Invalid user credentials or session token. |
| `Duplicate` | `435` | Duplicate object or connection. |
| `IncorrectConfiguration` | `436` | Backend configuration for the corresponding feature is incorrect. |
| `InternalServerError` | `500` | Operation failure on the backend platform. |
| `DataAccessError` | `512` | Data read or write failure on the backend platform. |
| `UnknownCause` | `100` | Unhandled failure on the backend platform. |
       
### Non-api errors.
All **non-api** related errors (invalid data \ connection failed etc).

| Error Type | Details |
|:------------- |:-------------|
| `ConnectionFailed` | Error indicating the connection to the Appacitive servers failed  |
| `InvalidJson` | Error indicating that badly formed JSON was received in response. This either indicates you have done something unusual with modifying how things encode to JSON, or the network is failing badly.  |
| `XDomainRequest` | Error indicating a real error code is unavailable because we had to use an XDomainRequest object to allow CORS requests in Internet Explorer, which strips the body from HTTP responses that have a non-2XX status code. |
| `UnknownCause` | Error indicating the cause for th error was unknown. No error information available. |
| `InvalidParameters` | Invalid parameters or data was provided for operation |
| `MissingId` | Error indicating an unspecified id |
| `IdNotFound` | Error indicating that the specified id doesn't exists |
| `DuplicateValue` | Error that a unique field was given a value that is already taken. |
| `DuplicateUsername` | Error that a user with same username already exists. |


## Example

Let's take a look at an example. In the code below, we try to fetch an object with a non-existent id. Appacitive server will return an error - so here's how to handle it properly in your callback:

```javascript
var Player = Appacitive.Object.extend('player');
player.get('11133431223344', {
	success: function(player) {
    	// This function will *not* be called.
    	console.log(player.get('name') + ' fetched');
	},
    error: function(error) {
        if (Appacitive.Error.IdNotFound === error.code) {
            console.log(error.message);
        }
    }
});
```

The get call might also fail because it couldn't connect to the Appacitive. Here's the same callback but with a bit of extra code to handle that scenario:

```javascript
var Player = Appacitive.Object.extend('player');
player.get('11133431223344', {
	success: function(player) {
    	// This function will *not* be called.
    	console.log(player.get('name') + ' fetched');
	},
    error: function(error) {
        if (Appacitive.Error.IdNotFound === error.code) {
            console.log(error.message);
        } else if (error.code === Appacitive.Error.ConnectionFailed) {
	        console.log("We couldn't connect to Appacitive!");
	    }
    }
});
```

Another example to check if a username is already taken while user signup:

```javascript
Appacitive.User.signup({
	username: 'john',
	password: 'p@ssw0rd',
	firstname: 'john'
}, {
	success: function(user) {
		console.log('User signed up successfully');
	},
	error: function(error) {
		if (Appacitive.Error.DuplicateUsername === error.code) {
            console.log(error.message);
        }
	}
});
```

## Enable Exception Debugging

If you are using <a href="../promises/">`promises`</a>, any exceptions thrown inside the then handlers will be caught by the promise. What this means is that the following:

```javascript
promise.then(function() {
    throw new Error('I am just an error.');
});
```

Will not cause the exception to be visible in the log panel of your browser or IDE. This can lead to confusion as it seems that everything went fine, while in reality, the exception is thrown but not reported. To correctly deal with exceptions in promises, consider the approach below.

```javascript
promise.then(funtion() {
    throw new Error('I am just an error.');
}).then(null, function(e) {
    // Check whether the error is an exception.
    if(e instanceof Error) {
        // e holds the Error thrown in the then handler above.
        // e.message === 'I am just an error.';
    } else {
        // e is an Appacitive.Error.
    }
});
```

Apart from handling these exceptions, you can also log them as:

```javascript
// To log exceptions.
Appacitive.logs.exceptionLog = function(exception) {
	//... Log exception
};
```

The `error.message` and `error.stack` properties will provide insight in what went wrong, and where.

<div class="block-notice">
    <i class="glyphicon glyphicon-info-sign"></i> All network requests performed by the sdk to Appacitive are logged. All logged resposnes include a `referenceId` property. This id will be helpful when asking for support. If you cannot find an answer or solution to your problems, feel free to contact us through the <a href="http://appacitive.freshdesk.com">Appacitive Support Forum</a>.
</div>
