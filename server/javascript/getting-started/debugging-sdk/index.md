## Debugging the SDK.

The SDK allows you to enable \ disable debugging for your app. Enabling debugging will allow you to
see the corresponding API request and response for every SDK method invoked. You can also fine tune what debugging
information is published by specifying your own specific rule.

### Enabling debugging.
Set the specific `Appacitive.logs` property to specify the calls that you want to debug. These properties should be set with a delegate function, to which the log is sent as an argument. 

``` javascript
// To enable logging of all transactions.
Appacitive.logs.apiLog = function(log) {
	//... Log call
};

// To log failed calls.
Appacitive.logs.apiErrorLog = function(errorLog) {
	//... Log error call
};
```

These log messages contain these properties:

| Name | Details |
|:------------- |:-------------|
| `status` | Indicates the status of the call (success/error) |
| `description` |  A short, description of the call. |
| `referenceId` | A unqiue id for the call, which you can report to us in case of any issues. |
| `date` | A UTC date string when this call was made. |
| `method` | HTTP request method of the call. |
| `url` | Complete request url |
| `responseTime` | Total time taken by this call. |
| `headers` | An object of all request headers. |
| `request` | Request data sent in the call. |
| `response` | Response data received in the call. |

You might be able to identify the error by inspecting these messages. When contacting <a href="appacitive.freshdesk.com">Appacitive Support Forum</a>, sending this log along will be of great help.

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
    }
    else {
        // e is an Appacitive.Error.
    }
});
```

Apart from handling these exceptions, you can also log them as:

```javascript
// To log exceptions.
Appacitive.logs.exceptionLog = function(error) {
	//...
};
```

The `error.message` and `error.stack` properties will provide insight in what went wrong, and where.
