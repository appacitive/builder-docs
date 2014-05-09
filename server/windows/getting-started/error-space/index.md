# Error handling in the SDK

## Failure behavior
Internal errors and API call failures are returned as dedicated exceptions.
The SDK provides its own error space for these exceptions with each exception type
extending the `BaseAppacitiveException` class.

## Exception types

The table below details the complete error space for the SDK.

### API Failures
The following exceptions are thrown in case the api returns a non 2xx status code.
Depending upon the status code returned via the api, specific exceptions are raised.

| Exception Type | Status Code | Details |
|:------------- |:-------------:|:-------------|
| `BadRequestException` | `400` | Bad request or invalid request data. |
| `AccessDeniedException` | `401` | The current user does not have access on the requested data. |
| `InvalidSubscriptionException` | `402` | The appacitive subcription for the application is invalid or has expired. |
| `UsageLimitExceededException` | `403` | API burst limits have been exceeded. |
| `ObjectNotFoundException` | `404` | The requested data was not found on the backend server. |
| `UpdateConflictException` | `409` | The revision of the data to be updated was different from the revision on the client. |
| `PreconditionFailedException` | `412` |  A dependent pre conditional operation did not succeed.  |
| `ApiAuthenticationFailureException` | `420` | Invalid api key or api session token. |
| `UserAuthenticationFailureException` | `421` | Invalid user credentials or session token. |
| `DuplicateObjectException` | `435` | Duplicate object. |
| `IncorrectConfigurationException` | `436` | Backend configuration for the corresponding feature is incorrect. |
| `InternalServerException` | `500` | Operation failure on the backend platform. |
| `DataAccessException` | `512` | Data read or write failure on the backend platform. |
| `UnExpectedSystemException` | - | Unhandled failure on the backend platform. |

### Non-api errors.
All **non-api** related errors (invalid data \ SDK not initialized etc) are raised as an `AppacitiveRuntimeException`.

| Exception Type        | Details |
|:------------- |:-------------|
| `AppacitiveRuntimeException` | This error is raised for all failures _excluding_ backend API call failures.  |



## Error space object model

The class diagram below shows the object model for the Appacitive error space.
Click the image to view full size version of the diagram.

<a href="//cdn.appacitive.com/devcenter/windows/error-space-v1.png">
  <center>
    <img title="Error space - class diagram" src="//cdn.appacitive.com/devcenter/windows/error-space-small-v1.png">
  </center>
</a>
