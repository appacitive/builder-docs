# Devices
The device data type is an inbuilt data type provided by the platform. An ojbect of this type represents the device on which your app is installed. This is only available on the SDK versions that target phone or table platforms. 

A device is an inbox for push notifications for your app. After registering a device on the platform, you can send push notifications to it. These notifications would be raised as events by the SDK within your app. Inside the SDK, device specific features are exposed by the `APDevice` and `APDevices` types.

Also note that device data type extends the core object type. This implies that device objects can essentially be treated just like you would treat an object of any other data type on the platform. Infact, the `APDevice` class extends the `APObject` class.

## Registering the device
To start receiving push notifications on a device on which your app is installed, you need to register the device. This is a one time activity.
Once registered, you can access the current device via the `AppContext.DeviceContext` object. 

The sample code below shows how to register a new device. Calling this method multiple times will not register duplicate devices.

```csharp
// To register the current device on which the app is installed.
await AppContext.DeviceContext.RegisterCurrentDeviceAsync();
```

## The current device
Once registered, you can access the current device via the `AppContext.DeviceContext` object. This object provides a cached access to the APDevice object representing the current device.

```csharp
var currentDevice = AppContext.DeviceContext.CurrentDevice;
```

## Channel management
Channels allow you to create groups of devices that are subscribed to a common topic. Push notifications sent to these channels, are sent out to all subscribed devices.

```csharp
var device = AppContext.DeviceContext.CurrentDevice;
// Subscribe to the world cup channel
device.Channels.Add("fifa-worldcup");
await device.SaveAsync();
``` 

## Basic operations
The `APDevice` class extends the `APObject` class. This means that all operations that support `APObject` also support `APDevice`. Non-instance methods for users etc are available on the `APDevices` helper class.