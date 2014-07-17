
<h1><span class="glyphicon glyphicon-download-alt"></span> .Net SDK Downloads</h1>
<span class="muted mbm">Version 1.0.0 - Jun 01, 2014</span>

<h2> Installing the SDK via NuGet </h2>
The easiest way to install the appacitive .NET sdk in your solution is via the [NuGet package manager](http://www.nuget.org/).
Incase you do not have NuGet installed, you can find instructions on how to install it [here](http://docs.nuget.org/docs/start-here/installing-nuget).  
Once you have nuget setup, then to install the SDK via the NuGet package manager use the following steps.

<h3> 1. Open the NuGet Package Manager console. </h3>
Open the [NuGet Package Manager console](http://docs.nuget.org/docs/start-here/using-the-package-manager-console).
Select the project that you want to add the SDK to as the `Default project` on the package manager console.

<h3> 2. Installing the SDK </h3>
Run the following command in the package manager console window.
```
    PM> Install-Package Appacitive
```
This will install the sdk in your project.
If you have trouble accessing the package manager console, you can also install the sdk via the [Package Manager dialog](http://docs.nuget.org/docs/start-here/managing-nuget-packages-using-the-dialog).

## Compile and install from source code
Incase you do not want to use NuGet, you can always download and compile the sdk from source.
The source code for the .NET sdk for appacitive is open source and
is available on github under the [Apache License](https://github.com/appacitive/appacitive-dotnet-sdk/blob/master/LICENSE).

On compiling, the required binaries will be available in the `/bin` directory of the source code.

<a title="View on Github" class="btn btn-success <%- github %>" href="https://github.com/appacitive/appacitive-dotnet-sdk">GitHub</a>
<a title="Download the Zip file" class="btn btn-info <%- zip %>" href="https://github.com/appacitive/appacitive-dotnet-sdk/archive/master.zip"><i class="glyphicon glyphicon-download-alt"></i> .zip File</a>

<br/>
<div class="ptm">
To fast track your development, we have created <a href="blank-project">blank projects</a> of different project types. These blank projects has a references to .Net SDK with all it's other dependencies.
</div>

<br/>
<br/>

<h1><span class="glyphicon glyphicon-time"></span> SDK Changelog</h1>
## v 1.0.0
<span class="muted">Jun 01, 2014</span>

+   Initial release of Appacitive Kit
+   Support for users, data and resources
+   ACL Integrated
+   Support for friends API
