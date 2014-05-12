Windows Push App demonstrates ***Push*** and ***Device*** features provided by Appacitive Platform. As part of design best practice, you will learn how to add hooks to receive push notification while app is running.

### Prerequisites

You are aware of <a target="_blank" href="http://www.visualstudio.com/">Visual Studio 2012</a>, <a target="_blank" href="http://www.nuget.org/">NuGet Package</a>, <a target="_blank" href="https://dev.windowsphone.com/en-us/downloadsdk">Windows Phone SDK</a>, <a target="_blank" href="http://phone.codeplex.com/"> Windows Phone Toolkit</a> and last but not the least <a target="_blank" href="https://portal.appacitive.com/">Appacitive Portal</a>.


### Creating Windows Push App from Scratch

Follow the step by step guide to get hands on with the Windows Push App.

### 1. Usage of Push Console

Following video shows how to use Push Console on Appacitive Portal.

<iframe src="//player.vimeo.com/video/89849527?byline=0&amp;portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>



### 2. Downloading Boilerplate

To jump start, we have created a boilerplate app for you, which is fully functional with some sample data hard coded in the app. You can download the boilerplate <a title="Download boilerplate" href="https://github.com/apalsapure/wp-push/archive/boilerplate.zip">here</a>



### 3. Integrating .Net SDK

The boilerplate is build for Windows Phone 7.


#### 3.1 Installing SDK

Appacitive .Net SDK is hosted on NuGet. To install Appacitive .NET SDK, run the following command in the <a href="http://docs.nuget.org/docs/start-here/using-the-package-manager-console" targe="_blank">Package Manager Console</a>.

	PM> Install-Package Appacitive

This will install Appacitive .Net SDK with all it's dependencies for Windows Phone 7.


#### 3.2 Initializing SDK

You can initialize SDK any where in your app, but we suggest to do it in `App.xaml.cs`, by doing so SDK is available every where in the app. To initialize the SDK, open `App.xaml.cs` and inside `Application_Launching` function, copy following code.

	// Code to execute when the application is launching (eg, from Start)
	private void Application_Launching(object sender, LaunchingEventArgs e)
    {
    	//Initializing Appacitive .Net SDK
        Appacitive.Sdk.App.Initialize(Appacitive.Sdk.Platforms.WP7, "{{App Id}}", "{{API Key}}", Appacitive.Sdk.Environment.Sandbox);

        //your code (if any)
    }

You will need to replace {{App Id}} by your application's id and {{API Key}} by API Key. To get these details, open your app on Appacitive Portal. API key for the app is available on your app's home page at the bottom. To get the App Id, open application details view by clicking on edit icon near your app's name.


#### 3.3 Registering device

To register Windows Phone you will need to call `RegisterCurrentDeviceAsync` on `AppContext.DeviceContext`. This will create a unique `Device` object on Appacitive Platform for the current device. You can access registered device using `AppContext.DeviceContext.CurrentDevice`. 

In this sample we will register device in PushManager.cs inside `Init` function. 

    //register device
    await AppContext.DeviceContext.RegisterCurrentDeviceAsync();

Check out the <a target="_blank" href="http://help.appacitive.com/v1.0/index.html#dotnet/push_devices">Quick Reference</a> for the operations which you can perform on the device.

#### 3.4 Adding hooks for Push Notifications

Once you register device you can add hooks using which you can read push notifications. .Net SDK provides two events using which you can listen to Toast and Raw Push notifications in your app `ShellToastNotificationReceived` and `HttpNotificationReceived` respectively. When you registered for either of the events, SDK will create `HttpNotificationChannel` for you.

In this app we want to receive both Toast and Raw Push notifications. For this once device is registered we will add the hooks.

    //register device
    await AppContext.DeviceContext.RegisterCurrentDeviceAsync();

	//add hooks for push notifications
    AppContext.DeviceContext.Notifications.HttpNotificationReceived += OnHttpNotificationReceived;
    AppContext.DeviceContext.Notifications.ShellToastNotificationReceived += OnShellToastNotificationReceived;

**Important Note:**

If you add the event handlers without registering device, SDK will throw an exception.


### Congratulation

You have created a fully functional Push Notification enabled App using .Net SDK backed by Appacitive Platform. In this App we have explored ***Push*** and ***Device*** features provided by Appacitive Platform.

### What's next?
You can check out our other <a title="All Samples based on Appacitive .Net SDK" href="../">samples</a> to know more about .Net SDK and other features provided by Appacitive Platform. For complete API reference of .Net SDK go to our <a target="_blank" title="http://help.appacitive.com" href="http://help.appacitive.com/v1.0/#dotnet">help docs<span class="plxs glyphicon glyphicon-share-alt"></span></a>.