# Debugging
----

The appacitive iOS SDK provides a class called APLogger for debugging the network requests and responses. The APLogger class logs the all messages to the console. To log to a file or someplace else, you will have to extend the APLogger class and override the `-[APLogger log:withType:]` method. Logging is disabled by default. To enable Logging use the `-[APLogger enableLogging:];` method. The SDK uses a static `sharedLogger` instance for logging the network requests. If you decide to use the same instance for logging the messages in your app, note that disabling the logging on the `sharedLogger` instance will disable the logging of Appacitive network request calls. 

```objectivec
[[APLogger sharedLogger] enableLogging:YES];
```

To disable logging, use the same method with the `enableLogging` parameter set to `NO`.

```objectivec
[[APlogger sharedLogger] enableLogging:NO];
```

Enabling logging will only log error messages by default. This is to prevent the sensitive data, which is sent in the network requests, from getting logged. For debugging purposes, you can enable logging of the debug messages, which logs all requests and responses, by using the `-[[APLogger sharedLogger] enableVerboseMode:];` method.

```objectivec
[[APLogger sharedLogger] enableVerboseMode:YES];
```

You can disable verbose mode by setting the parameter to `NO`.

To use APLogger to log your own messages, use the `-[APLogger log:withType:]` method. The type parameter accepts either `APMessageTypeError`, which represents an error message, or `APMessageTypeDebug`, which represents a debug message.

You can also instantiate your own logger instance to log your own messages using the -[APLogger initWithLoggingEnabled:verboseMode:];

```objectivec
APLogger myLogger = [[APLogger alloc] initWithLoggingEnabled:YES verboseMode:NO];
```

To log the messages to the console, use the `-[APLogger log:withType:]` method.

```objectivec
[myLogger log:@"Some error message" withType:APMessageTypeError];
```
