# Push Notifications

Push is a great way to send timely and relevant targeted messages to users of your app and enhance their overall experience and keep them informed of the latest developments on your app.
Appacitive allows you to send push notifications to your users in a variety of ways and targets android, ios and windows phone.

For detailed info around how platform specific push notifications work, you can check out their specific docs.

iOS       : https://developer.apple.com/notifications/

Android     : http://developer.android.com/google/gcm/index.html

Windows Phone : http://msdn.microsoft.com/en-us/library/hh221549.aspx

You will need to provide some basic one time configurations like certificates, using which we will setup push notification channels for different platforms for you. Also we provide a Push Console using which you can send push notification to the users.

## Configure App on Appacitive for Push Notification

Login to the Appacitive portal and from app list page select the app, you want to configure. Once inside, from the top navigation bar, go to Notification section and select General Settings.

Currently we support Push Notification for iOS, Android and Window, so to enable Push Notifications for the app, you will need to select either of the platforms for your app (if none of the platform is selected, app will guide you to the appropriate section, from where you can select the platform). On the Push Notification's setting page, first you will need to enable them, after that from the iOS section you can upload the certificate and set password for it (if any). For Android, you will need to provide the Sender Id, Sender Auth Token and the package name. That's it, update the app and your app is configured to send push notification.


## Receiving push notifications

To receive push notifications via the Appacitive SDK you need to do a one time setup to register the app with the platform for receiving push notifications. You can do this using the `AppContext.DeviceContext` helper class.

```csharp
/// Registering the device for push

// This can be called multiple times safely.

await AppContext.DeviceContext.RegisterCurrentDeviceAsync();
```

After registering the device with the platform, you can subscribe to notifications by simply providing event handlers to be triggered whenever a push notification is received. The code sample below shows how this can be done.

```csharp
/// For http notifications.
AppContext.DeviceContext.Notifications.HttpNotificationReceived += OnHttpNotificationReceived;
// event handler.
void OnHttpNotificationReceived(object sender, HttpNotificationEventArgs e) 
{ 
 ...
}

/// For shell toast notifications.
AppContext.DeviceContext.Notifications.ShellToastNotificationReceived += OnShellToastNotificationReceived;
// event handler
void OnShellToastNotificationReceived(object sender, NotificationEventArgs e)
{
    ...
}       
```

## Sending push notifications

Using Appacitive platform you can send push notification to iOS devices, Android base devices and Windows phone.

You will need to provide some basic one time configurations like certificates, using which we will setup push notification channels for different platforms for you. Also we provide a Push Console using which you can send push notification to the users.

In the .NET SDK, the static object PushNotification provides methods to send push notification.

Appacitive provides five ways to select the recipients

1. Broadcast
2. Platform specific Devices
3. Specific List of Devices
4. To List of Channels
5. Query

First we'll see how to send a push notification and then we will discuss the above methods with their options one by one.

### Broadcast

If you want to send a push notification to all active devices, you can use the following options

```csharp
await PushNotification
        // Send broadcast
        .Broadcast("Push from .NET SDK")
        // Increment existing badge by 1
        .WithBadge("+1")
        // Custom data field1 and field2
        .WithData(new { field1 = "value1", field2 = "value2" })
        // Expiry in seconds
        .WithExpiry(1000)
        // Device platform specific options
        .WithPlatformOptions(
            new IOsOptions
            {
                SoundFile = soundFile
            })
        .WithPlatformOptions(
            new AndroidOptions
            {
                NotificationTitle = title
            })
        .WithPlatformOptions(
            new WindowsPhoneOptions
            {
                Notification = new ToastNotification
                {
                    Text1 = wp_text1,
                    Text2 = wp_text2,
                    Path = wp_path
                }
            })
        .SendAsync();
```

### Platform specific Devices

If you want to send push notifications to specific platforms, you can use this option. To do so you will need to provide the devicetype in the query.

```csharp
await PushNotification
    // Send to specific device types
    .ToQueryResult( Query.Property("devicetype").IsEqualTo("ios"))
    // Increment existing badge by 1
    .WithBadge("+1")
    // Custom data field1 and field2
    .WithData(new { field1 = "value1", field2 = "value2" })
    // Expiry in seconds
    .WithExpiry(1000)
    .SendAsync();
```

### Specific List of Devices

If you want to send push notifications to specific devices, you can use this option. To do so you will need to provide the device ids.

```csharp
var deviceIDs = new [] {"id1", "id2",..}; 
await PushNotification
    // Send specific device ids
    .ToDeviceIds("Push from .NET SDK", deviceIDs);
    // Increment existing badge by 1
    .WithBadge("+1")
    // Custom data field1 and field2
    .WithData(new { field1 = "value1", field2 = "value2" })
    // Expiry in seconds
    .WithExpiry(1000)
    .SendAsync();
```

### To List of Channels

Device object has a Channel property, using which you can club multiple devices. This is helpful if you want to send push notification using channel.

```csharp
var channels = new [] {"channel1", "channel2",..}; 
await PushNotification
    // Send specific channels
    .ToChannels("Push from .NET SDK", channels);
    // Increment existing badge by 1
    .WithBadge("+1")
    // Custom data field1 and field2
    .WithData(new { field1 = "value1", field2 = "value2" })
    // Expiry in seconds
    .WithExpiry(1000)
    .SendAsync();
```

### Query

You can send push notifications to devices using a Query. All the devices which comes out as result of the query will receive the push notification.

```csharp
IQuery query =  Query.Property(..;       // create query
await PushNotification
    // Send to results from a query
    .ToQueryResult(query)
    // Increment existing badge by 1
    .WithBadge("+1")
    // Custom data field1 and field2
    .WithData(new { field1 = "value1", field2 = "value2" })
    // Expiry in seconds
    .WithExpiry(1000)
    .SendAsync();
```

## Platform specific options

The PushNotification fluent interface provides a WithPlatformOptions method to pass different phone platform specific options as shown in the example below.

```csharp
await PushNotification
        // Send specific device ids
        .Broadcast("Hello from the .NET SDK")
        // Device platform specific options
        .WithPlatformOptions(
            new IOsOptions
            {
                SoundFile = soundFile
            })
        .WithPlatformOptions(
            new AndroidOptions
            {
                NotificationTitle = title
            })
        .WithPlatformOptions(
            new WindowsPhoneOptions
            {
                Notification = new ToastNotification
                {
                    Text1 = wp_text1,
                    Text2 = wp_text2,
                    Path = wp_path
                }
            })
        .SendAsync();
```

### Different options for windows phone.

For windows phone 3 types of notifications are supported. 
1. Toast notifications. 
2. Tile notifications (flip, cyclic and iconic) 
3. Raw notifications (string based raw data)

The windows phone platform options allows you to choose the specific kind of notification to be send to each windows phone device type (WP7, WP75 and WP8). The sample below shows how this can be done.

```csharp
// Toast
await PushNotification
        .Broadcast("message")
        .WithPlatformOptions(
            new WindowsPhoneOptions
            {
                Notification = new ToastNotification
                {
                    Text1 = wp_text1,
                    Text2 = wp_text2,
                    Path = wp_path
                }
            })
        .SendAsync();

// Raw notification
await PushNotification
        .Broadcast("message")
        .WithPlatformOptions(
            new WindowsPhoneOptions
                {
                    Notification = new RawNotification() { RawData = "string data.." }
                })
        .SendAsync();

// Tile notification (Flip tile for all)
await PushNotification
        .Broadcast("message")
        .WithPlatformOptions(
                    new WindowsPhoneOptions
                    {
                        Notification = TileNotification.CreateNewFlipTile( 
                            new FlipTile() { FrontTitle = title, .. } )
                    })
        .SendAsync();


// Tile notification (cyclic tile for wp8, flip tile for others)
await PushNotification
        .Broadcast("message")
        .WithPlatformOptions(
                    new WindowsPhoneOptions
                    {
                        Notification = TileNotification.CreateNewCyclicTile( 
                            new CyclicTile(), new FlipTile() )
                    })
        .SendAsync();

// Tile notification (iconic tile for wp8, flip tile for others)
await PushNotification
        .Broadcast("message")
        .WithPlatformOptions(
                    new WindowsPhoneOptions
                    {
                        Notification = TileNotification.CreateNewIconicTile( 
                            new IconicTile(), new FlipTile() )
                    })
        .SendAsync();
```