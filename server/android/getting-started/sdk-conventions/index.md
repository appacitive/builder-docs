# Appacitive Android SDK Conventions

The Appacitive Android SDK gives you full access to manipulate your data on the Appacitive platform.

Some key classes are -

## com.appacitive.core.*AppacitiveObject*

An object of this class is a handle to an object of a custom type defined by you through the portal. This object minimally requires the name of the custom type and the id of the object.

The id is a unique number assigned to every object, connection, device and user on the platform. This id is assigned by the platform when you create the data.

An instance of this class provides methods for you to manipulate and search with respect to this object.

The AppacitiveObject class has static methods to help you find and retrieve objects of a particular type.

Every object, user and device object also has a *accesscontrol* object which lets you assign access controls on the data.

## com.appacitive.core.*AppacitiveConnection*

The AppacitiveConnection class allows you to connect two objects. The relation must already be defined through the portal between two types.

Two objects can be connected using the fluent syntax this class provides. An object of this class is a handle to a connection on the platform. The class also provides static methods for you to retrieve and search connections.

## com.appacitive.core.*AppacitiveUser*

The user custom type is already present for every app on appacitive. It provides several helper functions for you to easily manage users of your app. You can create, retrieve, update, delete, manage passwords, login, link facebook and/or twitter accounts, check in users using this class. The *firstname*, unique *username* and *password* fields are mandatory for a user.

## com.appacitive.core.*AppacitiveDevice*

The device custom type is also created for you by the platform for every app. This type helps you to manage unique installations of your app. It contains the device type like `android`, `ios`, `wp7` etc. and the unique device token for the app on that device. 

You can manage installations of your app using this class. Registering every device with your app on appacitive helps you to send push notifications to those devices.   

## com.appacitive.core.query.*AppacitiveQuery*

This class helps you fine tune your search calls.

## com.appacitive.core.*AppacitiveFile*

You can upload, download, delete files like images and videos for your app using this class.

## com.appacitive.core.*AppacitiveEmail*

This class lets you send out emails to your users.

## com.appacitive.core.*AppacitiveGraphSearch*

AppacitiveGraphSearch lets you fire **Filter** and **Projection** queries on your data. You must first create your *Graph Queries* through the management portal.

## com.appacitive.core.*AppacitivePushNotification*

This class has static methods which let you send out targeted push notifications to devices of your apps' users.

## com.appacitive.android.*AppacitiveContext*

You need to call the initialize method of this class from your MainActivity to initialize the SDK with your API key and the appacitive environment (sandbox/live) you want to use. It is advised to only use the client API key from your app and apply appropriate access controls on your types.

All API calls made to appacitive happen on a background thread and the result is presented to you through a *success* callback. In case of an exception, the *failure* callback is called where you can suitably handle the error.

For example, 

```
        AppacitiveDevice device = new AppacitiveDevice();
        device.setDeviceToken("xxxxxxxxxxxxxxxx");
        device.setDeviceType("android");
        
        device.registerInBackground(new Callback<AppacitiveDevice>() {
            @Override
            public void success(AppacitiveDevice device) {
                
            }

            @Override
            public void failure(AppacitiveDevice device, Exception e) {
                
            }
        });
```

In case of an exception, the AppacitiveException wraps the status object returned from the API. You can compare the status code value to figure out what went wrong.
