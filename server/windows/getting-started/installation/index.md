## Installing the SDK via NuGet
The easiest way to install the appacitive .NET sdk in your solution is via the [NuGet package manager](http://www.nuget.org/).
Incase you do not have NuGet installed, you can find instructions on how to install it [here](http://docs.nuget.org/docs/start-here/installing-nuget).  
Once you have nuget setup, then to install the SDK via the NuGet package manager use the following steps.

### 1. Open the NuGet Package Manager console.
Open the [NuGet Package Manager console](http://docs.nuget.org/docs/start-here/using-the-package-manager-console).
Select the project that you want to add the SDK to as the `Default project` on the package manager console.

### 2. Installing the SDK
Run the following command in the package manager console window.
```
    PM> Install-Package Appacitive
```
This will install the sdk in your project.
If you have trouble accessing the package manager console, you can also install the sdk via the [Package Manager dialog](http://docs.nuget.org/docs/start-here/managing-nuget-packages-using-the-dialog).


### 3. Initializing the sdk for your app.
To start using the SDK inside your app, you need to initialize the sdk. To do this, add the following
lines in your `app.xaml.cs` file.

Import the sdk namespace.
``` csharp  
using Appacitive.Sdk;     // Import the Appacitive.Sdk namespace.
```
Initialize the SDK inside your solution.

``` csharp
// Code to execute when the application is launching (eg, from Start)
void Application_Launching(object sender, LaunchingEventArgs e)
{
    //Initializing Appacitive .Net SDK
    AppContext.Initialize(
      {appId},           // The app id for your app on appacitive.
      {apikey},          // The master or client api key for your app on appacitive.
      {environment},     // The environment that you are targetting (sandbox or live).
      {settings}         // (optional) - additional SDK settings.
    );

    //your code (if any)
}
```


## Compile and install from source code
Incase you do not want to use NuGet, you can always download and compile the sdk from source.
The source code for the .NET sdk for appacitive is open source and
is available on github under the [Apache License](https://github.com/appacitive/appacitive-dotnet-sdk/blob/master/LICENSE).

On compiling, the required binaries will be available in the `/bin` directory of the source code.

Get the source code

<a title="View on Github" class="btn btn-success <%- github %>" href="https://github.com/appacitive/appacitive-dotnet-sdk">GitHub</a>
<a title="Download the Zip file" class="btn btn-info <%- zip %>" href="https://github.com/appacitive/appacitive-dotnet-sdk/archive/master.zip"><i class="glyphicon glyphicon-download-alt"></i> .zip File</a>
