# Error handling in the SDK

Every function call with the signature as xxxInBackground() makes a call to the Appacitive API. All such methods accept a `Callback` object which has two methods you can override. These methods are `success` and `failure`.

The `success` callback is invoked if the call was successful. The result of the API call is returned as a parameter to your success callback. In case of any kind of error, the `failure` callback is invoked. You get a null result and an Exception describing what went wrong. 

If the exception is an instance of AppacitiveException, it contains the following information.

* `code` holds a generic error code. The code can be used to program against.
* `message` contains a short, user-friendly, description of the error.
* `additionalMessages` contains a list of messages. This property is not always populated.
* `referenceId` contains a unique id for the call, which you can report to us in case of any issues.

### API Failures

The following errors are returned in case the API returns a non 2xx status code.

| Error Type | Status Code | Details |
|:------------- |:-------------:|:-------------|
| `BadRequest` | `400` | Bad request or invalid request data. |
| `AccessDenied` | `401` | The current user does not have access on the requested data. |
| `PaymentRequired` | `402` | The appacitive subscription for the application is invalid or has expired. |
| `UsageLimitExceeded` | `403` | API burst limits have been exceeded. |
| `NotFound` | `404` | The requested data was not found on the backend server. |
| `UpdateConflict` | `409` | The revision of the data to be updated was different from the revision on the client. |
| `PreconditionFailed` | `412` |  A dependent pre conditional operation did not succeed.  |
| `ApiAuthenticationError` | `420` | Invalid api key or api session token. |
| `UserAuthenticationError` | `421` | Invalid user credentials or session token. |
| `DuplicateObject` | `435` | Duplicate object. |
| `IncorrectConfiguration` | `436` | Backend configuration for the corresponding feature is incorrect. |
| `InternalServerError` | `500` | Operation failure on the backend platform. |
| `DataAccessError` | `512` | Data read or write failure on the backend platform. |
| `UnknownCause` | `100` | Unhandled failure on the backend platform. |
       
### Non-api errors.

The SDK also proactively throws a few exceptions if proper conditions are not met before making a call to the API. These are `ValidationException` and `UserAuthException`. 

A `ValidationException` is thrown if all mandatory fields are not supplied for an API call, like signing up a new `AppacitiveUser` without a password.

A `UserAuthException` is thrown if a user is not logged in through the SDK for a call that requires a user auth token. 


## Example

Let's take a look at an example. In the code below, we try to fetch an object with a non-existent id. Appacitive API will return an error - so here's how to handle it properly in your `Callback`.

```
        AppacitiveObject.getInBackground("player", 111222333, null, new Callback<AppacitiveObject>() {
            @Override
            public void success(AppacitiveObject player) {
                Log.d(tag, player.getPropertyAsInt("score"));
            }

            @Override
            public void failure(AppacitiveObject player, Exception e) {
                Log.d(tag, e.getMessage());
            }
        });
```

As you can see in the example above you can see that we have logged the message of the error to the console. The description will provide you with more insight into what kind of error has occurred.

<div class="block-notice">
    <i class="glyphicon glyphicon-info-sign"></i> The AppacitiveException instance will have a property called 'referenceId'. This id will be helpful when asking for support. If you cannot find an answer or solution to any problem, feel free to contact us through the <a href="http://appacitive.freshdesk.com">Appacitive Support Forum</a> with the referenceId.
</div>
