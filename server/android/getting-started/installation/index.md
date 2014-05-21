# Installation

You can use Appacitive as the backend for you new or existing android apps using the Appacitive Android SDK. The Appacitive Android SDK is available as a downloadable jar file which you can add as a dependency to your app.

## Prerequisites

1. [Java Development Kit](http://www.oracle.com/technetwork/java/javase/downloads/index.html) (JDK) 1.6
2. [Appacitive Android SDK](http://www.appacitive.com) jar. 
3. An IDE of your choice.

The SDK currently supports Android 2.3 (API 9) and higher.

## For Android Studio users

Add the jar file to a folder called `libs` in your module. Right click on the newly added jar file in the IDE and select the `Add As Library...` option. Optionally, you can manually add the following line to the `dependencies` section in the `build.gradle` file of your app's module after placing the SDK jar in the `libs` directory. 

```
compile files('libs/appacitive-android-1.0.jar') 
```

![](http://cdn.appacitive.com/devcenter/android/android-studio-1.png)

Initialize the SDK by calling the `AppacitiveContext.initialize()` method with your *API key* and the *environment* you want to use.

![](http://cdn.appacitive.com/devcenter/android/android-studio-2.png)

You can find your API Keys on the dashboard of your app in the API Keys section located in the bottom left corner.

![](http://cdn.appacitive.com/devcenter/android/android-studio-3.png)

## For Eclipse users

Similarily for Eclipse, add the Appacitive Android SDK jar file to the `libs` folder in your app's module. 

Initialize the SDK by calling the `AppacitiveContext.initialize()` method with your *API key* and the *environment* you want to use.

![](http://cdn.appacitive.com/devcenter/android/eclipse-1.png)
