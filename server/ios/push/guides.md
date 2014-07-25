# Push Notifications
----

Using Appacitive platform you can send push notification to iOS, Android and Windows Phone devices.

We recommend you to go through **[this](http://devcenter.appacitive.com//ios/push/guides.html#setup-on-appacitive)** section, which explains how you can configure Appacitive app for Push notification. You will need to provide some basic one time configurations like certificates, using which we will setup push notification channels for different platforms for you. Also we provide a Push Console using which you can send push notification to the users.

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

## Setup on Appacitive

There are a series of steps that you need to follow to ready iOS app to start receiving Push Notifications from the Appacitive Server.
These steps involve registering your app on the **[Apple Developer](http://developer.apple.com/ios)** site and creating a few certificates.

The whole process is explained very well in **[this](http://www.raywenderlich.com/32960/apple-push-notification-services-in-ios-6-tutorial-part-1)** tutorial on the **[Ray Wenderlich](http://www.raywenderlich.com/)** blog.
Over here we shall just note down the steps involved registering the app on the Apple dev center and creating the certificates. 
You visit the **[Ray Wenderlich](http://www.raywenderlich.com/)** blog to better understand the whole process.

### Generate the Certificate Signing Request (CSR)
One of the very first things you will need to do is create a Certificate Signing Request (CSR). It is needed whenever you apply for a digital certificate.

To create a CSR open the keychain access on your Mac.
In the grey bar at the top, select the Keychain Access menu and under the Certificate Assistant select the *Request a Certificate from a Certificate Authority*.

![](http://cdn.appacitive.com/devcenter/ios/push/Keychain-Access-1-Request-Certificate-500x200.jpg)

You should see a Certificate Assistant popup. 
Enter an email address, a common name (we have named it PushChat), select the *saved to disk* option and then click on continue.
We named the saved file as "PushChat.certSigningRequest".

![](http://cdn.appacitive.com/devcenter/ios/push/Keychain-Access-2-Generate-CSR.jpg)

In the *Keys* section of the Keychain Access, a new private key should be generated with the name "PushChat".
Right click on this key and select export. 
It would ask you to give a name for the .p12 file and also enter a passphrase.
Lets say we named it as "PushChatKey.p12" and passphrase as "pushchat".

![](http://cdn.appacitive.com/devcenter/ios/push/Keychain-Access-3-Export-Private-Key-500x279.jpg)

### Making the App Id
Now you need to register your app with on the **[iOS developer](https://developer.apple.com/devcenter/ios)** site.
Once you have logged in select the *Certificates, Identifiers and Profiles* section which you will find on the right.

![](http://cdn.appacitive.com/devcenter/ios/push/select_certificates_identifiers_profiles-480x269.png)

Select *Certificates* under iOS apps.

On the new page open *Identifiers -> APP IDS* section.
It should you a list of Apps registered.
Click on the + button at the top to create a new APP ID. 

![](http://cdn.appacitive.com/devcenter/ios/push/create_app_id-480x292.png)

You need to put in the App details like the 

1. *APP ID Description* - PushChat
2. *App Services* - Right now select Push Notification
3. *Explicit App Id* - Put your app bundle identifier that you will get from your Xcode Project.

Its important to note here that your *Explicit App Id* should be exactly the same as your bundle identifier or else you app will not recieve pushes


### Downloading the SSL Certificate

After you have created the new App, select it from the App List.

![](http://cdn.appacitive.com/devcenter/ios/push/push_app_accordion-480x301.png)

Click on *Settings* at the bottom and then scroll down to the Push Notification section.
Here select the *Create Certificate* under the *Developer SSL Certificate*.

First it shall ask you to create a CSR. 
We have already done this so click on continue.

In the next step you can upload the CSR that we just created, and then click on *Generate*.
Once the certificate is generated you can click *Continue*, and then you shall be shown an option to download the generated SSL certificate.
The file would be "aps_development.cert"

![](http://cdn.appacitive.com/devcenter/ios/push/click_download-480x159.png)


### Provisioning Profile

Next you need to create provisioning profile.

Select the *Provisioning Profiles* section and click on the *+* button.

![](http://cdn.appacitive.com/devcenter/ios/push/create_new_provisioning_profile-480x274.png)


For the type select *iOS development profile*.

![](http://cdn.appacitive.com/devcenter/ios/push/select_development-402x320.png)


Then select the App for which you want to create the profile.

![](http://cdn.appacitive.com/devcenter/ios/push/select_app_id-410x320.png)


Select the certificates you want to include in profile

![](http://cdn.appacitive.com/devcenter/ios/push/select_certificate-467x320.png)


Select the devices for on which you will be testing the app

![](http://cdn.appacitive.com/devcenter/ios/push/select_devices-397x320.png)


Give a name to the profile and Generate it

![](http://cdn.appacitive.com/devcenter/ios/push/privisioning_profile_name-480x317.png)


Now download the profile, and then add to your XCode by either double clicking it or dragging to the XCode icon.



### Making the PKCS12 File.

In this section we will be creating the .p12 file which will be uploaded to Appacitive.

Now these are 3 files that we will need for creating the .p12 file

1. The CSR
2. The private key as a p12 file (PushChatKey.p12)
3. The SSL certificate, aps_development.cer

Below are the steps to create the file *.p12* file

#### 1. Converting *aps_development.cer* to *.pem* file

``` javascript
openssl x509 -in aps_developer.cer -inform DER -out aps_developer.pem -outform PEM
```

#### 2. Converting the private key *.p12* file *.pem* file

``` javascript
openssl pkcs12 -nocerts -out PushChat.pem -in PushChatKey.p12
```

#### 3. (Optional): If you want to remove password from the private key:

``` javascript
openssl rsa -out pushchat_key_noenc.pem -in PushChat.pem
```

#### 4. Create a PKCS#12 format file:

``` javascript
openssl pkcs12 -export -in aps_developer.pem -inkey pushchat_key_noenc.pem -certfile PushChat.certSigningRequest -name "AppacitivePushchat" -out AppacitivePushchat.p12
```


#### Adding the file to Appacitive

Now the above PKCS#12 file that you have generated needs to be uploaded to Appacitive.

To do that, you need to login to your Appacitive account and open the App for which you want to set up Push notification.

In your App, go to the *Modules -> Push Settings*

![](http://cdn.appacitive.com/devcenter/ios/push/SelectPush.png)

On the Push Settings page, select the iOS tab and upload the PKCS#12 file that you generated.

![](http://cdn.appacitive.com/devcenter/ios/push/Upload_Certificate.png)

If you have removed the passphrase then you do not need to add the passphrase on Appacitive.

Click on update and now you are all set to send Push notifications to your iOS app using Appacitive.









