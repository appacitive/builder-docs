# Devices

`Devices` denote your app's installations. The `device` custom type has some predefined properties like `device token`, `device type` etc. for you to easily manage the devices your app runs on. The `device` custom type also comes handy for sending out push notifications for your app. 

The `AppacitiveDevice` class in the Appacitive Android SDK provides methods to create, retrieve, update and find devices registered with Appacitive for your app.

You should create a new object of this type every time your app is installed on a new device. A `device` object has a `devicetype` which could be *ios*, *android*, *wp7*, *wp75* or *wp8*. Also, every `device` object has a unique `devicetoken`.

## Register a device

You need to provide Appacitive with information about the device on which you might want to send push notifications later. This info minimally includes the `devicetype` (*ios*, *android* etc.) and `devicetoken`. More predefined properties are available in the device type for your benefit. You can also add any additional property(s) you might need in your application, just like creating properties in any other type.

```
        AppacitiveDevice device = new AppacitiveDevice();
		device.setDeviceToken("XXXXXXXXXXXXXXXXXXXXXXXXXXX");
        device.setDeviceType("android");
        device.registerInBackground(new Callback<AppacitiveDevice>() {
            @Override
            public void success(AppacitiveDevice device) {
                assert device.getId() > 0;
            }
        });
```

On successful registration, you can head over to the **device browser** on the management portal to view all the registered devices in a tabular view. Go to *modules* -> *data & storage* -> *devices*.

All other operation on `devices` work exactly the same as objects of any other custom type. Head over to the push notifications tutorial, to see how you can use this device registration data to send targeted push to your app's users.