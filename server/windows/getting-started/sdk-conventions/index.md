## SDK Conventions

The .NET sdk follows certain conventions for all operations. These are applied for all types through out the SDK.

### Appacitive platform and SDK mapping.
The following table shows the different sub systems in the Appacitive platform and their corresponding
SDK classes.

| Appacitive sub system | Corresponding SDK types |
|:------------- |:-------------|
| Objects | `APObject` and `APObjects` |
| Connections | `APConnection` and `APConnections` |
| Users | `APUser` and `APUsers` |
| Devices | `APDevice` and `APDevices` |
| Canned lists | `CannedList` |
| Search querying | `Query` |
| Graph apis | `Graph` |
| Authentication & user session | `Credential` & `UserSession` |
| File upload and download | `FileUpload` and `FileDownload` |
| Push notifications` | `PushNotification` |
| Emails` | `Email` |


### Why two classes like APObject and APObjects ?
For types that encapsulate data (objects, connections, users and devices), the SDK provides
two types. One is an instance type (e.g., `APObject`) which contains instance specific functionality
like create and update. The other is a lookup type (e.g., `APObjects` - note the plural name) which contains
instance agnostic functionality for retrieve, search and delete.


### The AppContext class
The `AppContext` is a static class which encapsulates all the app level state of the SDK.
This class helps provide the following functionality -

1. Provides access to the currently logged in user via `AppContext.UserContext`.
2. Provides access to the current device via `AppContext.DeviceContext`.
3. Provides management for app level debugging and tracing via `AppContext.Debug`.
4. Provides access to app level state like the api key and the environment via `AppContext.State`.

### Save behavior
All data classes in the SDK keep track of their internal state and all modifications made by the
app in between saves. This essentially means two things -

1. Calling `SaveAsync()` in quick succession without any modifications will not result in an API call.
2. You do not need to retrieve an object to update it. Simply create a new instance with the existing id and update
the fields that you need to change. Calling `SaveAsync()` will simply update the fields that you modified, while
retaining all other existing fields.

### The async / await pattern
Most operations in the SDK are asynchronous and make extensive use of the [Task Parallel Library](http://msdn.microsoft.com/en-us/library/dd460717(v=vs.110).aspx).
You can use the [`async / await`](http://msdn.microsoft.com/en-us/library/hh191443.aspx) keywords with these methods.
These will ensure that all I/O operations inside the SDK will run in a non-blocking way keeping your app responsive.
