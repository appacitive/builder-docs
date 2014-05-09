## Debugging the SDK.

The SDK allows you to enable \ disable debugging and tracing for your app. Enabling debugging will allow you to
see the corresponding API request and response for every SDK method invoked. You can also fine tune what debugging
information is published by specifying your own specific rule.

### Enabling debugging.
Use the `AppContext.Debug` method to specify the calls that you want to trace. For Windows Phone 7 and 8 apps,
the debugger uses standard .NET `System.Diagnostics.Debug` infrastructure. This will allow you to see the debugging traces
in the debug window of your IDE.

``` csharp
// To enable logging of all transactions.
AppContext.Debug.ApiLogging.LogEverything();

// To log only failed calls.
AppContext.Debug.ApiLogging.LogFailures();

// To log calls taking more than 600ms.
AppContext.Debug.ApiLogging.LogSlowCalls(600);

// To log calls based on runtime condition.
AppContext.Debug.ApiLogging.LogIf((rq, rs) => rs.Status.Code == "400");

// To log failed and slow calls.
AppContext.Debug.ApiLogging
         .LogFailures()
         .LogSlowCalls(600);

```

### Debugging for desktop and server applications.
For .NET 4.5 desktop and server side applications, the SDK uses the standard .NET Trace infrastructure for publishing debugging traces.
To get trace information enable tracing using the code above and setup a trace listener via the `app.config` or `web.config` as shown.

``` xml
<system.diagnostics>
    <trace autoflush="true" indentsize="4">
        <listeners>
            <clear />
            <add name="fileTracer" type="System.Diagnostics.TextWriterTraceListener" initializeData="trace.log" />
        </listeners>
        </trace>
</system.diagnostics>
```
