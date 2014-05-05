## Error space

### Failure behavior
The appacitive SDK provides its own error space for all failures that occur within the SDK.
Internal errors and API failures are returned as strongly typed exceptions. All custom exception types in the SDK
extend the `BaseAppacitiveException` class.

### Error space.

The table below details the complete error space for the SDK.

#### Non-api errors.

| Exception Type        | Details |
|:------------- |:-------------|
| `AppacitiveRuntimeException` | This error is raised for all failures except backend API call failures.  |

#### API Failures
| Exception Type        | Details |
|:------------- |:-------------|
| `BadRequestException` | This error corresponds to status code `400` from the API. It is raised for a bad request or invalid data.|
| `AccessDeniedException` |  |
| `InvalidSubscriptionException` |  |
| `UsageLimitExceededException` |  |
| `ObjectNotFoundException` |  |
| `UpdateConflictException` |  |
| `PreconditionFailedException` |  |
| `ApiAuthenticationFailureException` |  |
| `UserAuthenticationFailureException` |  |
| `DuplicateObjectException` |  |
| `IncorrectConfigurationException` |  |
| `InternalServerException` |  |
| `DataAccessException` |  |
| `UnExpectedSystemException` |test  |

HttpContext.Current.User (principal)
AppContext.UserContext.LoggedInUser (APUser)


BadRequestException - 400
AccessDeniedException - 401
InvalidSubscriptionException 402
UsageLimitExceededException - 403
ObjectNotFoundException - 404
UpdateConflictException - 409
PreconditionFailedException - 412
ApiAuthenticationFailureException - 420
UserAuthenticationFailureException - 421
DuplicateObjectException - 435
IncorrectConfigurationException - 436
InternalServerException - 500
DataAccessException - 512
UnExpectedSystemException - others

### Error space object model
