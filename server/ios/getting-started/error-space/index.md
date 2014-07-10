# Error handling in the SDK
----

For all those operations that require making a network request to the Appacitive API, depending on the type of operation the SDK provides two to three flavours of methods. For every operation there will always be one flavour of the method that will take a block as an argument called the `failureHandler` which accepts an APFailure type of block that returns an APError instance. The `failureHandler` is invoked when some error occurs while communicating with the Appacitive servers to perform your desired operations. In the `failureHandler`, provide the code that you would like to get executed when an error occurs, like logging the failure result or retrying the operation etc. The APError instance returned but the failure block will help you identify the error that was occurred while performing the operations you requested.

The APError instance contains the following information.

* `code` holds a generic error code. The code can be used to program against.
* `message` contains a short, user-friendly, description of the error.
* `additionalMessages` contains a list of messages. This property is not always populated.
* `referenceId` contains a unique id for the call, which you can report to us in case of any issues.

The SDK provides its own error space for these error with each type. The table below details the complete error space for the SDK.

### API Failures

The following errors are returned in case the API returns a non 2xx status code.
Depending upon the status code returned via the API, specific errors are returned.

| Error Type | Status Code | Details |
|:------------- |:-------------:|:-------------|
| `BadRequest` | `400` | Bad request or invalid request data. |
| `AccessDenied` | `401` | The current user does not have access on the requested data. |
| `PaymentRequired` | `402` | The Appacitive subscription for the application is invalid or has expired. |
| `UsageLimitExceeded` | `403` | API burst limits have been exceeded. |
| `NotFound` | `404` | The requested data was not found on the back-end server. |
| `UpdateConflict` | `409` | The revision of the data to be updated was different from the revision on the client. |
| `PreconditionFailed` | `412` |  A dependent pre conditional operation did not succeed.  |
| `ApiAuthenticationError` | `420` | Invalid API key or API session token. |
| `UserAuthenticationError` | `421` | Invalid user credentials or session token. |
| `DuplicateObject` | `435` | Duplicate object. |
| `IncorrectConfiguration` | `436` | Back-end configuration for the corresponding feature is incorrect. |
| `InternalServerError` | `500` | Operation failure on the back-end platform. |
| `DataAccessError` | `512` | Data read or write failure on the back-end platform. |
| `UnknownCause` | `100` | Unhandled failure on the back-end platform. |
       
### Non-API errors.

All **non-API** related errors (invalid data \ connection failed etc)

In case the error occurs outside the scope of the API, you will get the `Reference Id` as `-1` and the code property of the APError instance will contain the HTTP status code based on which you can find out what kind of failure occurred while trying to communicate with the API server.


## Example

Let's take a look at an example. In the code below, we try to fetch an object with a non-existent id. Appacitive server will return an error - so here's how to handle it properly in your callback:

```objectivec
APObject player = [[APObject alloc] initWithTypeName:@"player" objectId:@"11123123123"];
[player fetchWithSuccessHandler:^(NSDictionary *result) {
	NSLog(@"Object fetched!");
}failureHandler:^(APError *error) {
	NSLog(@"%@"[error description]);
}];
```

As you can see in the example above you can see that we have logged the description of the error to the console. The description will provide you with more insight into what kind of error has occurred.

<div class="block-notice">
    <i class="glyphicon glyphicon-info-sign"></i> The APError instance will have a property called 'referenceId'. This id will be helpful when asking for support. If you cannot find an answer or solution to your problems, feel free to contact us through the <a href="http://appacitive.freshdesk.com">Appacitive Support Forum</a> with the referenceId.
</div>
