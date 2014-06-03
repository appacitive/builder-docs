#Installing the Appactive iOS SDK
----

There are two ways to integrate the Appacitive iOS SDK into your project. 

1. Adding the Appacitive iOS SDK framework to your project.
2. Using the CocoaPods dependency manager.

## Adding the Appacitive iOS SDK framework to your project.

### Step 1: Download the Appactive iOS SDK framework bundle

Go [here](https://cdn.appacitive.com/sdk/ios/appacitive-ios-sdk-v-0.9.framework.zip) and download the Appacitive iOS SDK. The file you download will be a zip archive. Extract the contents. You will  find a single file named *AppacitiveSDK.framework* which is a static library framework bundle.

### Step 2: Integrate the framework bundle into your Xcode project

Drag the *AppacitiveSDK.framework* file into your Xcode project's *Project Navigator* and drop it inside the group(looks like a folder) named *Frameworks*. That's it, the SDK has been integrated.

### Step 3: Verify the setup

At this point you are going to verify if the SDK was installed successfully. In your Xcode project, open up the *Prefix.pch* file and add the following header:

```objectivec
 #import <AppacitiveSDK/AppacitiveSDK.h> 
```

Build (cmd+B) your project. If the build is successful then you have installed the SDK correctly.

### Step 4: Initialize your project with appacitive

Assuming that you have created an app on the appacitive platform, you must have an api key. Here is an image that shows where you can find the API KEY on the dashboard.

<img src = "http://cdn.appacitive.com/devcenter/ios/gettingstarted/apikey.png" style="max-width:100%;" />

To get started you need to provide your api key to the SDK. To do this call the + registerApiKey: method on the Appacitive class. Make sure to call this in the ```application:willFinishLaunchingWithOptions:``` method in your delegate. Here is an example:

```objectivec
- (BOOL)application:(UIApplication *)application 
             didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

     [Appacitive registerApiKey:@"REPLACE_ME_WITH_YOUR_APIKEY" useLiveEnvironment:NO];
     return YES;
}
```

The above method will use the provided API key and register it with the SDK.

-----------------------------------------

## Using the CocoaPods dependency manager:
 
The following steps will show you how to integrate the Appacitive iOS SDK into your app using CococPods.

### Step 1: Install CocoaPods

We here at Appacitive really like the CocoaPods library and believe that its the right way of managing external libraries in any iOS app. Hence, we decided to add the SDK to it as a pod.

If you have not used CocoaPods before head over to [this tutorial](http://www.raywenderlich.com/12139/introduction-to-cocoapods) that explains everything you need to know about it in detail. If you don't want to spend time reading it, then follow these simple steps:

Since CocoaPods runs on [Ruby](http://www.ruby-lang.org/en/) all you need to do to install it is run the following command on a terminal.

```
$ [sudo] gem install cocoapods
```

Another handy trick is to install [appledoc](http://gentlebytes.com/appledoc/) along with CocoaPods. This will generate documentation for each library you install (pretty cool eh!). Run this on a terminal to install appledoc:$ brew install appledoc

Now that you've got CocoaPods installed you are minutes away from having the SDK integrated.

**NOTE:**
If you're using a fresh out of the box Mac with Mountain Lion/Mavericks and using Xcode from the Mac App Store, you will first need to install the *Command Line Tools* for Xcode from [here](https://developer.apple.com/downloads/index.action) Or from Xcode > Settings > Downloads > Components > Command Line Tools

CocoaPods re-uses some of the RubyGems classes. If you have a version older than 1.4.0, you will have to update RubyGems: 

```
$ gem update --system.
```

### Step 2: Add the Appacitive-iOS-SDK to your Xcode project

The SDK is open source and is available at [GitHub](https://github.com/appacitive/Appacitive-iOS-SDK).

Lets consider that you have created a project called Deals finder. Here is an image that shows the structure of the project in Finder.

<img src = "http://cdn.appacitive.com/devcenter/ios/gettingstarted/xcodeproject.png" style="max-height:100%; max-width:100%;" />

Next, fire up the terminal and navigate to the project directory. Once there run the following command: 

```
$ touch Podfile
```

This will create a new file named Podfile.
Open this file using any text editor you fancy and add the following lines to it (Don't worry you're almost done):

```
platform:ios,'6.0' pod 'Appacitive-iOS-SDK', '>1.0.0'
```

Save the file and go back to the terminal. 
Run the following command:

```
$ pod install
```

This will download and install the latest Appacitive-iOS-SDK and create and new workspace for you.
From this point forward, remember to always open the Xcode workspace instead of the project file.

### Step 3: Verify the setup

At this point you are going to verify if the SDK was installed successfully. Open the workspace that was created in the previous step and open up the *Prefix.pch* file for your project then add the following header:

```objectivec
 #import <Appacitive-iOS-SDK/AppacitiveSDK.h> 
```

Build (cmd+B) your project. If the build is successful then you have installed the SDK correctly.

### Step 4: Initialize your project with appacitive

Assuming that you have created an app on the appacitive platform, you must have an api key. Here is an image that shows where you can find the API KEY on the dashboard.

<img src = "http://cdn.appacitive.com/devcenter/ios/gettingstarted/apikey.png" style="max-height:100%; max-width:100%;" />

To get started you need to provide your api key to the SDK. To do this call the + registerApiKey: method on the Appacitive class. Make sure to call this in the ```application:willFinishLaunchingWithOptions:``` method in your delegate. Here is an example:

```objectivec
- (BOOL)application:(UIApplication *)application 
             didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

     [Appacitive registerApiKey:@"REPLACE_ME_WITH_YOUR_APIKEY" useLiveEnvironment:NO];
     return YES;
}
```

The above method will use the provided API key and register it with the SDK.
