Todo List App demonstrates ***Users*** and ***Data Store***  features provided by Appacitive Platform. As part of design best practice, you will learn how to model your app and bind your custom objects to the view.

### Prerequisites

You are aware of <a target="_blank" href="http://www.visualstudio.com/">Visual Studio 2012</a>, <a target="_blank" href="http://www.nuget.org/">NuGet Package</a>, <a target="_blank" href="https://dev.windowsphone.com/en-us/downloadsdk">Windows Phone SDK</a>, <a target="_blank" href="http://phone.codeplex.com/"> Windows Phone Toolkit</a> and last but not the least <a target="_blank" href="https://portal.appacitive.com/">Appacitive Portal</a>.


### Creating Todo List App from Scratch

Follow the step by step guide to get hands on with the Todo List App.

### 1. Modeling app backend on Appacitive

Following video shows how to create the model for the app on Appacitive Platform.

<iframe src="//player.vimeo.com/video/89849527?byline=0&amp;portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>



### 2. Downloading Boilerplate

To jump start, we have created a boilerplate app for you, which is fully functional with some sample data hard coded in the app. You can download the boilerplate <a title="Download boilerplate" href="https://github.com/apalsapure/wp-todoapp/archive/boilerplate.zip">here</a>



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
        Appacitive.Sdk.AppContext.Initialize("{{App Id}}", "{{API Key}}", Appacitive.Sdk.Environment.Sandbox);

        //your code (if any)
    }

You will need to replace {{App Id}} by your application's id and {{API Key}} by API Key. To get these details, open your app on Appacitive Portal. API key for the app is available on your app's home page at the bottom. To get the App Id, open application details view by clicking on edit icon near your app's name.


#### 3.3 Working with .Net SDK Model

As part of design best practice, we suggest that you inherit your model from `APObject`. This simplifies your code by removing code required to transform Appacitive objects to your model. Additionally we will need to override default constructor by a constructor which will pass name of the type to base constructor. Modify your code as follows

	//This class maps to todo on appacitive
	public class TodoItem : Appacitive.Sdk.APObject
    {
    	//override default constructor
        public TodoItem()
            : base("todo")
        { }
        //special constructor called by SDK
        public TodoItem(Appacitive.Sdk.APObject existing)
            : base(existing)
        { }

    	//code
    }


Similarly, inherit `User` object from `APUser`, and remove `Id`, `Username`, `Email`, `Password`, `FirstName` and `LastName` from `User` class as they are there in `APUser`.

Now your model is aware of Appacitive Object. The last thing that needs to be changed is the properties. Instead of retrieving property value from local object, you will read it using .Net SDK helper methods. Following sample code shows how to do this
	
	// Change Name property of Todo Item
	public string Name
    {
        get
        {
            return this.Get<string>("title");
        }
        set
        {
            if (value != this.Name)
            {
                this.Set<string>("title", value);
                base.FirePropertyChanged("title");
            }
        }
    }

Similarly modify all remaining properties of `TodoItem`. Remove the `Id` property from both the classes because now it is provided by the base class `APObject`.

Lastly we will map your local objects to Appacitive types in `Application_Launching` function, after .Net SDK is initialized

	//Map your model object to appacitive type
    Appacitive.Sdk.AppContext.Types.MapObjectType<User>("user");
    Appacitive.Sdk.AppContext.Types.MapObjectType<TodoItem>("todo");

Now we have an application which is using Appacitive as backend. 

#### 3.4 Creating and Authenticating User

All the logic for creating and authenticating user reside `User.cs`. First we will create user through Signup. Open the file and change `Save` function as follows

	public async Task<bool> Save()
    {
        try
        {
            //Save user in the backend
            await this.SaveAsync();
            return true;
        }
        catch { return false; }
    }

<p class="mbs mtl"><strong>Important Note</strong></p>

.Net SDK follows `async` pattern to talk to Appacitive Platform. Hence when ever you are making any call to Appacitive you will need to use `await` keyword and will have to make respective function `async`.

Read more about `async` pattern on <a target="_blank" href="http://msdn.microsoft.com/en-us/library/jj152938(v=vs.110).aspx" >MSDN <span class="plxs glyphicon glyphicon-share-alt"></span></a>.

To authenticate user we will add following code inside try catch block of `Authenticate` function

	//authenticate user on Appacitive
    var credentials = new UsernamePasswordCredentials(email, password)
    {
        TimeoutInSeconds = int.MaxValue,
        MaxAttempts = int.MaxValue
    };

    await Appacitive.Sdk.AppContext.LoginAsync(credentials);

For logging out, simply add following code to `Logout` function

	//Logout user
    Appacitive.Sdk.AppContext.LogoutAsync();

So now you know how to create, authenticate and logout user in the app using .Net SDK.

#### 3.5 Managing Todo Items

Now will we learn how to do basic CRUD operations on `TodoItem` object using .Net SDK.

**Saving TodoItem:**

First we will create a Todo Item. To do this open TodoItem.cs and modify `Save` function as follows

	public async Task<bool> Save()
    {
        try
        {
            //If Id is empty, it means to create the todo item
            //else update
            if (string.IsNullOrEmpty(this.Id))
            {
                //as we need to store this item in context of user
                //we will create a connection between todoitem and the user
                //when connection is saved, todoitem is automatically created
                await Appacitive.Sdk.APConnection
                                .New("owner")
                                .FromExistingObject("user", AppContext.UserContext.LoggedInUser.Id)
                                .ToNewObject("todo", this)
                                .SaveAsync();
            }
            else
            {
                //update the state
                await this.SaveAsync();
            }
            return true;
        }
        catch { return false; }
    }

Here we are saving TodoItem in context of user by creating a `Owner` connection between `User` and `TodoItem`.

**Fetching TodoItem:**

Now to fetch `TodoItem`, we will make `GetConnectedObjects` call on `User`, as `TodoItem` are connected to `User` we can easily fetch `TodoItem` for a given `User`. Open `MainViewModel` and remove hard coded code for adding dummy data by following code

	///get connected todo items for current user
    var result = await AppContext.UserContext.LoggedInUser.GetConnectedObjectsAsync("owner",
                                                                orderBy: "__utcdatecreated",
                                                                sortOrder: Appacitive.Sdk.SortOrder.Ascending);
    //iterate over result object and add todo item to the list 
    while (true)
    {
        result.ForEach(r => this.Items.Add(r as TodoItem));
        //check if all pages are retrieved
        if (result.IsLastPage) break;
        //fetch next page
        result = await result.NextPageAsync();
    }

**Deleting TodoItem:**

Last thing we will do with TodoItem is to delete it. To do so replace `Delete` function from TodoItem.cs by following

	public async Task<bool> Delete()
    {
        //delete list item from backend
        try
        {
            await Appacitive.Sdk.APObjects.DeleteAsync(this.Type, this.Id, true);
            return true;
        }
        catch { return false; }
    }

Here we are deleting `TodoItem` connected to the `User` with the `Owner` connection.

### Congratulation

You have created a fully functional Todo App using .Net SDK backed by Appacitive Platform. In this Todo App we have explored the **CRUD** capability of two features ***Data Store*** and **Users** provided by Appacitive Core. You also learned how to **Authenticate** user.

### What's next?
You can check out our other <a title="All Samples based on Appacitive .Net SDK" href="../">samples</a> to know more about .Net SDK and other features provided by Appacitive Platform. For complete API reference of .Net SDK go to our <a target="_blank" title="http://help.appacitive.com" href="http://help.appacitive.com/v1.0/#dotnet">help docs<span class="plxs glyphicon glyphicon-share-alt"></span></a>.