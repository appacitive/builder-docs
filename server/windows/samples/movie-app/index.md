Movie App demonstrates ***Data Store*** feature provided by Appacitive Platform. As part of design best practice, you will learn how to model your app and bind your custom objects to the view.

### Prerequisites

You are aware of <a target="_blank" href="http://www.visualstudio.com/">Visual Studio 2012</a>, <a target="_blank" href="http://www.nuget.org/">NuGet Package</a>, <a target="_blank" href="https://dev.windowsphone.com/en-us/downloadsdk">Windows Phone SDK</a>, <a target="_blank" href="http://phone.codeplex.com/"> Windows Phone Toolkit</a> and last but not the least <a target="_blank" href="https://portal.appacitive.com/">Appacitive Portal</a>.


### Creating Movie App from Scratch

Follow the step by step guide to get hands on with the Movie App.

### 1. Modeling app backend on Appacitive

Following video shows how to create the model for the app on Appacitive Platform.

<iframe src="//player.vimeo.com/video/89849527?byline=0&amp;portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>



### 2. Importing Sample Data

<div class="muted">This is an optional step.</div>

Once the model is in place you can import some sample data in your app. All the information and images for the movie and actor are taken from <a target="_blank" href="http://www.imdb.com/">IMDB <span class="plxs glyphicon glyphicon-share-alt"></span></a>.

**Retrieving API Key and Application Id**

You will require API Key and Application Id to import data, to get these details, open your app on Appacitive Portal. API key for the app is available on your app's home page at the bottom. To get the App Id, open application details view by clicking on edit icon near your app's name.

<a id="aImportTool" data-js="movie-import" class="btn btn-state btn-primary" href="javascript:void('0')">Launch Import Tool</a>



### 3. Downloading Boilerplate

To jump start, we have created a boilerplate app for you, which is fully functional with some sample data hard coded in the app. You can download the boilerplate <a title="Download boilerplate" href="https://github.com/apalsapure/wp-movieapp/archive/boilerplate.zip">here</a>



### 4. Integrating .Net SDK

The boilerplate is build for Windows Phone 7.


#### 4.1 Installing SDK

Appacitive .Net SDK is hosted on NuGet. To install Appacitive .NET SDK, run the following command in the <a href="http://docs.nuget.org/docs/start-here/using-the-package-manager-console" targe="_blank">Package Manager Console</a>.

	PM> Install-Package Appacitive

This will install Appacitive .Net SDK with all it's dependencies for Windows Phone 7.


#### 4.2 Initializing SDK

You can initialize SDK any where in your app, but we suggest to do it in `App.xaml.cs`, by doing so SDK is available every where in the app. To initialize the SDK, open `App.xaml.cs` and inside `Application_Launching` function, copy following code.

	// Code to execute when the application is launching (eg, from Start)
	private void Application_Launching(object sender, LaunchingEventArgs e)
    {
    	//Initializing Appacitive .Net SDK
        Appacitive.Sdk.AppContext.Initialize("{{App Id}}", "{{API Key}}", Appacitive.Sdk.Environment.Sandbox);

        //your code (if any)
    }

You will need to replace {{App Id}} by your application's id and {{API Key}} by API Key.


#### 4.3 Working with .Net SDK Model

As part of design best practice, we suggest that you inherit your model from `APObject`. This simplifies your code by removing code required to transform Appacitive objects to your model. Additionally we will need a special constructor which will take instance of `APObject` as parameter. Modify your code as follows

	//This class maps to movie type on appacitive
	public class MovieItemViewModel : Appacitive.Sdk.APObject
    {
    	public MovieItemViewModel(Appacitive.Sdk.APObject existing)
            : base(existing)
        { }

    	//code
    }

    //This class maps to actor type on appacitive
    public class ActorItemViewModel : Appacitive.Sdk.APObject
    {
    	public ActorItemViewModel(Appacitive.Sdk.APObject existing)
            : base(existing)
        { }

    	//code
    }

Now your model is aware of Appacitive Object. The last thing that needs to be changed is the properties. Instead of retrieving property value from local object, you will read it using .Net SDK helper methods. Following sample code shows how to do this
	
	// Change Name property of MovieItemViewModel
	public string Name
    {
        get
        {
            return this.Get<string>("name");
        }
        set
        {
            if (value != this.Name)
            {
                this.Set<string>("name", value);
                base.FirePropertyChanged("Name");
            }
        }
    }

Similarly modify all remaining properties of `MovieItemViewModel` and `ActorItemViewModel`. Remove the `Id` property from both the classes because now it is provided by the base class `APObject`.


#### 4.4 Binding Movie Listing

Now we have an application which is using Appacitive as backend. Now we will fetch data of movie from Appacitive and render it. To do this open `MainViewModel.cs` and replace the hard coded values in `LoadData` function with following code

	//Get all objects of type movie
	var results = await Appacitive.Sdk.APObjects.FindAllAsync("movie", 
															   orderBy: "__utclastupdateddate", 
															   sortOrder: Appacitive.Sdk.SortOrder.Descending);

	//Iterate over the result object till all the movies are fetched
    while (true)
    {
    	//converting appacitive object to model
        results.ForEach(r => this.Items.Add(new MovieItemViewModel(r)));

        //check if its last set of record
        if (results.IsLastPage)
            break;

        //fetch next set of record
        results = await results.NextPageAsync();
    }


<p class="mbs mtl"><strong>Important Note</strong></p>

.Net SDK follows `async` pattern to talk to Appacitive Platform. Hence when ever you are making any call to Appacitive you will need to use `await` keyword and will have to make respective function `async`. Hence `LoadData` function will look like this

	public async Task LoadData()
	{
		//code to load data
	}

Read more about `async` pattern on <a target="_blank" href="http://msdn.microsoft.com/en-us/library/jj152938(v=vs.110).aspx" >MSDN <span class="plxs glyphicon glyphicon-share-alt"></span></a>.



#### 4.5 Rendering Movie Details

Now when user tap on any movie, movie details view will be rendered. Details view asks `DetailsViewModel` to fetch data. As done earlier, we will replace the hard coded values in `LoadData` function from `DetailsViewModel.cs` file by following code

	//Get all objects of type actor
    var results = await _movie.GetConnectedObjectsAsync("acted", 
                                                         orderBy: "__utclastupdateddate", 
                                                         sortOrder: Appacitive.Sdk.SortOrder.Descending);

    //Iterate over the result object till all the actors are fetched
    while (true)
    {
        //converting appacitive object to model
        results.ForEach(r => this.Items.Add(new ActorItemViewModel(r)));

        //check if its last set of record
        if (results.IsLastPage)
            break;

        //fetch next set of record
        results = await results.NextPageAsync();
    }

And will make `LoadData` function `async`.

### Congratulation

You have created a fully functional Movie App using .Net SDK backed by Appacitive Platform. In this Movie App we have explored the **read** capability of ***Data Store*** feature provided by Appacitive Core.

### What's next?
You can check out our other <a title="All Samples based on Appacitive .Net SDK" href="../">samples</a> to know more about .Net SDK and other features provided by Appacitive Platform. For complete API reference of .Net SDK go to our <a target="_blank" title="http://help.appacitive.com" href="http://help.appacitive.com/v1.0/#dotnet">help docs<span class="plxs glyphicon glyphicon-share-alt"></span></a>.