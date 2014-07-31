# Push Notifications

Using Appacitive, you can send rich and engaging push notifications to your app's users. You can push notifications to iOS, Android and Windows Phone devices.
This tutorial will guide you through the push notification capabilities of the Android SDK.

## Configuration

First and foremost, you must enable push notifications for your app on the management portal. Go to *modules* -> *notifications* -> *push settings* and enable the toggle to allow push notifications to be sent for your app.

Next, configure your platform specific settings for your app in the same section.

![](http://cdn.appacitive.com/devcenter/android/push-1.png)

You can obtain the required details by following the steps on the [Getting Started](http://developer.android.com/google/gcm/gs.html) page of the Android developer site.

## Sending Push Notifications

In the Android SDK, the `AppacitivePushNotification` class provides methods to send push notifications. Appacitive provides five ways to select the recipients,

- Broadcast
- Platform specific Devices
- Specific List of Devices
- To List of Channels
- Query

### Broadcast

If you want to send a push notification to *all* active devices, you can use the following option,

```
        String message = "Hello World!";
        Map<String, String> customData = new HashMap<String, String>() {{
            put("field1", "value1");
            put("field2", "value2");
        }};

        //  Broadcast message
        AppacitivePushNotification.Broadcast(message)
                .withBadge("+1")    	//  Increment existing badge by 1
                .withExpiry(500)    	//  Expiry in milliseconds
                .withData(customData)	//	Custom data
                .sendInBackground(new Callback<String>() {
                    @Override
                    public void success(String result) {
                        assert Long.valueOf(result) > 0;
                    }
                });
```

### To platform specific devices

If you want to send push notifications to one or more specific platforms, you can use this option. To do so you will need to provide the `devicetype` in the query.

```
        String message = "Hello World!";

        AppacitivePushNotification.ToQueryResult(message, BooleanOperator.and(new ArrayList<Query>() {{
            add(new PropertyFilter("devicetype").isEqualTo("ios"));
            add(new PropertyFilter("devicetype").isEqualTo("android"));
        }}))
                .sendInBackground(
                        new Callback<String>() {
                            @Override
                            public void success(String result) {
                                assert Long.valueOf(result) > 0;
                            }
                        }
                );
```

### To specific list of devices

If you want to send push notifications to specific devices, you can use this option. To do so you will need to provide the `device ids`.

```
        String message = "Hello World!";
        List<String> deviceIds = new ArrayList<String>() {{
            add("id1");
            add("id2");
        }};

        AppacitivePushNotification.ToDeviceIds(message, deviceIds)
                .sendInBackground(
                        new Callback<String>() {
                            @Override
                            public void success(String result) {
                                assert Long.valueOf(result) > 0;
                            }
                        }
                );
```

### To one or more channels

The `device` object has a *multi-valued* property called`channel`, using which you can club multiple devices. This is helpful if you want to send push notification using channel.

```
        String message = "Hello World!";
        List<String> channels = new ArrayList<String>() {{
            add("channel1");
            add("channel2");
        }};
        
        AppacitivePushNotification.ToChannels(message, channels)
                .sendInBackground(
                        new Callback<String>() {
                            @Override
                            public void success(String result) {
                                assert Long.valueOf(result) > 0;
                            }
                        }
                );
```

### Query based selection of devices

You can send push notifications to devices using a `Query`. All the devices which come out as result of the query will receive the push notification.

```
        String message = "Hello World!";

        AppacitivePushNotification.ToQueryResult(message, BooleanOperator.and(new ArrayList<Query>() {{
            add(new PropertyFilter("devicetype").isEqualTo("ios"));
            add(new PropertyFilter("isactive").isEqualTo("true"));
        }}))
                .sendInBackground(
                        new Callback<String>() {
                            @Override
                            public void success(String result) {
                                assert Long.valueOf(result) > 0;
                            }
                        }
                );
```

## Platform specific options

The `AppacitivePushNotification`'s fluent interface provides a `withPlatformOptions` method to pass different platform specific options as shown in the examples below.

### iOS

```
        String message = "Hello iOS!";

        AppacitivePushNotification.Broadcast(message)
                .withPlatformOptions(new IosOptions("soundfile"))
                .sendInBackground(new Callback<String>() {
                    @Override
                    public void success(String result) {
                        assert Long.valueOf(result) > 0;

                    }
                });
```

### Android

```
        String message = "Hello iOS!";
        AppacitivePushNotification.Broadcast(message)
                .withPlatformOptions(new AndroidOptions("title"))
                .sendInBackground(new Callback<String>() {
                    @Override
                    public void success(String result) {
                        assert Long.valueOf(result) > 0;

                    }
                });
```

### Windows Phone

Windows Phone supports three types of notifications,

- Toast notifications. 
- Tile notifications (flip, cyclic and iconic) 
- Raw notifications (string based raw data)

The Windows Phone platform options allows you to choose the specific kind of notification to be send to each Windows Phone device type (WP7, WP75 and WP8). The samples below show how this can be done.

```
		//	Toast
        WindowsPhoneOptions options = new WindowsPhoneOptions(new ToastNotification("text1", "text2", "path"));
        AppacitivePushNotification.Broadcast("Hi Windows Phone!")
                .withPlatformOptions(options)
                .sendInBackground(new Callback<String>() {
                    @Override
                    public void success(String result) {
                        assert Long.valueOf(result) > 0;
                    }
                });
		
		//	Raw
        WindowsPhoneOptions options = new WindowsPhoneOptions(new RawNotification("Raw Data"));
        AppacitivePushNotification.Broadcast("Hi Windows Phone!")
                .withPlatformOptions(options)
                .sendInBackground(new Callback<String>() {
                    @Override
                    public void success(String result) {
                        assert Long.valueOf(result) > 0;
                    }
                });

		//	Tile notification (Flip tile for all versions)
        FlipTile tile = new FlipTile();
        tile.backContent = "back content";
        tile.backTitle = "back title";
		...
        
        WindowsPhoneOptions options = new WindowsPhoneOptions(TileNotification.createNewFlipTile(tile));
        AppacitivePushNotification.Broadcast("Hi Windows Phone!")
                .withPlatformOptions(options)
                .sendInBackground(new Callback<String>() {
                    @Override
                    public void success(String result) {
                        assert Long.valueOf(result) > 0;
                    }
                });

		//	Tile notification (cyclic tile for WP8, flip tile for other versions)
        FlipTile flipTile = new FlipTile();
        flipTile.backContent = "back content";
        flipTile.backTitle = "back title";
		...

        CyclicTile cyclicTile = new CyclicTile();
        cyclicTile.frontTitle = "front title";
		...

        WindowsPhoneOptions options = new WindowsPhoneOptions(TileNotification.createNewCyclicTile(cyclicTile, flipTile));
        AppacitivePushNotification.Broadcast("Hi WP!")
                .withPlatformOptions(options)
                .sendInBackground(new Callback<String>() {
            @Override
            public void success(String result) {
                assert Long.valueOf(result) > 0;
            }
        });

		// Tile notification (iconic tile for WP8, flip tile for other versions)
        FlipTile flipTile = new FlipTile();
        flipTile.backContent = "back content";
        flipTile.backTitle = "back title";
		...

        IconicTile iconicTile = new IconicTile();
        iconicTile.frontTitle = "front title";
		...

        WindowsPhoneOptions options = new WindowsPhoneOptions(TileNotification.createNewIconicTile(iconicTile, flipTile));
        AppacitivePushNotification.Broadcast("Hi WP!")
                .withPlatformOptions(options)
                .sendInBackground(new Callback<String>() {
            @Override
            public void success(String result) {
                assert Long.valueOf(result) > 0;
            }
        });
```

You can fire each of these calls from the management portal using the **Push Console**. Go to *modules* -> *notofications* -> *push console*. Make sure you have enabled push notifications and selected all your desired platforms for the app.

You can also view the status of your sent push notifications in the **push log** section. 