# Device
----

Appacitive provides an out-of-the box data type called device. This type helps you in managing the devices that your apps are installed on. You can use the device class to track your user's devices and send push notifications.

## Register

There are two types of device registrations provided by the SDK. the `registerDevice` method will create a device instance in your app at appacitive and also give you an instance to the newly created device, just like when you create an object.

```objectivec
    APDevice *mydevice = [[APDevice alloc] initWithDeviceToken:@"1gh32fh5fgh37fx58c" deviceType:@"ios"];
    [mydevice registerDeviceWithSuccessHandler:^() {
        NSLog(@"Device created!");
    } failureHandler:^(APError *error) {
        NSLog(@"Some error occurred: %@",[error description]);
    }];
``` 

The `registerCurrentDeviceWithPushDeviceToken` method will create a device instance in your app at Appacitive with the push device token and also set it active for receiving push notifications. the device instance that gets instantiated is the static APdevice instance `currentDevice`. Make sure that the push device token that you enter as the parameter for the register call is the same token that you receive from iOS for receiving push notifications.

```objectvec
[APDevice registerCurrentDeviceWithPushDeviceToken:nil enablePushNotifications:NO successHandler:^{
    NSLog(@"Device created!");
} failureHandler:^(APError *error) {
    NSLog(@"Some error occurred: %@",[error description]);
}];
```

## De-register

The deregisterCurrentDevice method will set the isActive flag of the current device to `false` thereby disabling push notifications on the device.

```
[APDevice deregisterCurrentDeviceWithSuccessHandler:^{
    NSLog(@"Device de-registered!");
} failureHandler:^(APError *error) {
    NSLog(@"Some error occurred: %@",[error description]);
}];
```

## Delete

Deleting a device works the same way as [deleting an APObject](/ios/data-store/guides.html#deleting).

## Update

Updating an APDevice works the same way as [updating an APObject](/ios/data-store/guides.html#updating).

## Retrieve

Retrieving a device works the same way as [retrieving an APDObject](/ios/data-store/guides.html#retrieving).

