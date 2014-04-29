# Installation

You can use Appacitive as the backend for you new or existing android apps using the Appacitive Android SDK. The Appacitive Android SDK is available as a downloadable jar file which you can add as a dependency to your app.

## Prerequisites

1. [Java Development Kit](http://www.oracle.com/technetwork/java/javase/downloads/index.html) (JDK) 1.6
2. [Appacitive Android SDK](http://www.appacitive.com) jar. 
3. An IDE of your choice.

The SDK currently supports Android 2.3 (API 9) and higher.


## For Android Studio users

Add the jar file to a folder called *libs* in your module. Right click on the jar file in the IDE and select the *Add As Library...* option. Optionally, you can add the following line to the *dependencies* section in the *build.gradle* file of your app's module. 

```
compile files('libs/appacitive-android-1.0.jar') 
```


![](https://lh5.ggpht.com/oXwS_Jo1xrUhkZRxtTTvRH4Avartfj6PVjlveBMIHCryeKwV-aj_N4lpPzx37DLi5Bg=w300)


Initialize the SDK by calling the *AppacitiveContext.initialize()* method with your *API key* and the *environment* you want to use.

![](https://lh5.ggpht.com/oXwS_Jo1xrUhkZRxtTTvRH4Avartfj6PVjlveBMIHCryeKwV-aj_N4lpPzx37DLi5Bg=w300)

You can find your API Keys on the dashboard of your app in the API Keys section located in the bottom left corner.


![](https://lh5.ggpht.com/oXwS_Jo1xrUhkZRxtTTvRH4Avartfj6PVjlveBMIHCryeKwV-aj_N4lpPzx37DLi5Bg=w300)


## For Eclipse users

Similarily for Eclipse, add the Appacitive Android SDK jar file to the *libs* folder in your app's module. 

Initialize the SDK by calling the *AppacitiveContext.initialize()* method with your *API key* and the *environment* you want to use.

![](https://lh5.ggpht.com/oXwS_Jo1xrUhkZRxtTTvRH4Avartfj6PVjlveBMIHCryeKwV-aj_N4lpPzx37DLi5Bg=w300)
