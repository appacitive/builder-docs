# Push Notifications
----

Using Appacitive platform you can send push notification to iOS, Android and Windows Phone devices.

We recommend you to go through **[this](http://appacitive.github.io/docs/current/rest/push/index.html)** section, which explains how you can configure Appacitive app for Push notification. You will need to provide some basic one time configurations like certificates, using which we will setup push notification channels for different platforms for you. Also we provide a Push Console using which you can send push notification to the users.

Appacitive provides four ways to select the sender list

* Broadcast
* Platform specific Devices
* Specific List of Devices
* To List of Channels
* Query

## Broadcast

If you want to send a push notification to all active devices, you can use the following options

```objectivec
APPushNotification *notification = [[APPushNotification alloc] initWithMessage:@"Bonjour!"];
notification.isBroadcast = YES;
[notification sendPushWithSuccessHandler:^{
		NSLog(@"Push Sent!");
} failureHandler:^(APError *error) {
		NSLog(@"Error occurred: %@",[error description]);
}];
```

## Platform specific Devices

If you want to send push notifications to specific platforms, you can do so in the following way.

```objectivec
APPushNotification *notification = [[APPushNotification alloc] initWithMessage:@"Bonjour!"];
notification.query = [[[APQuery queryExpressionWithProperty:@"devicetype"] isEqualTo:@"ios"] stringValue];
[notification sendPushWithSuccessHandler:^{
	NSLog(@"Push Sent!");
} failureHandler:^(APError *error) {
	NSLog(@"Error occurred: %@",[error description]);
}];
```

## Specific List of Devices

If you want to send push notifications to specific devices, will need to provide the device ids.

```objectivec
APPushNotification *notification = [[APPushNotification alloc] initWithMessage:@"Bonjour!"];
notification.deviceIds = @[@"23423432545", @"4353452352"];
[notification sendPushWithSuccessHandler:^{
	NSLog(@"Push sent to requested devices!"]);
} failureHandler:^(APError *error) {
	NSLog(@"Error occurred: %@",[error description]);
}];
```

## To List of Channels

You can also send PUSH messages to specific channels.

```objectivec
APPushNotification *notification = [[APPushNotification alloc] initWithMessage:@"Bonjour!"];
notification.channels = @[@"updates", @"upgrades"];
[notification sendPushWithSuccessHandler:^{
		NSLog(@"Push sent on selected channels!");
} failureHandler:^(APError *error) {
		NSLog(@"Error occurred: %@",[error description]);
}];
```

## Query

You can send push notifications to devices using a Query. All the devices which comes out as result of the query will receive the push notification.

```objectivec
APPushNotification *notification = [[APPushNotification alloc] initWithMessage:@"Bonjour!"];
notification.query = [[[APQuery queryExpressionWithProperty:@"devicetype"] isEqualTo:@"ios"] stringValue];
[notification sendPushWithSuccessHandler:^{
	NSLog(@"Push Sent!");
} failureHandler:^(APError *error) {
	NSLog(@"Error occurred: %@",[error description]);
}];
}
```