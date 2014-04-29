Todo List App demonstrates ***Users*** and ***Data Store***  features provided by Appacitive Platform. As part of design best practice, you will learn how to model your app and bind your custom objects to the view.

### Prerequisites

You are aware of Visual Studio 2012, NuGet Package, Windows Phone SDK and last but not the least Appacitive Portal.


### Creating Todo List App from Scratch

Follow the step by step guide to get hands on with the Movie App.

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
        Appacitive.Sdk.App.Initialize(Appacitive.Sdk.Platforms.WP7, "{{App Id}}", "{{API Key}}", Appacitive.Sdk.Environment.Sandbox);

        //your code (if any)
    }

You will need to replace {{App Id}} by your application's id and {{API Key}} by API Key. To get these details, open your app on Appacitive Portal. API key for the app is available on your app's home page at the bottom. To get the App Id, open application details view by clicking on edit icon near your app's name.


#### 3.3 Working with .Net SDK Model

As part of design best practice, we suggest that you inherit your model from `APObject`. This simplifies your code by removing code required to transform Appacitive objects to your model. Additionally we will need to override default constructor by a constructor which will pass name of the type to base constructor. Modify your code as follows

	//This class maps to movie todolist on appacitive
	public class TodoList : Appacitive.Sdk.APObject
    {
    	//override default constructor
        public TodoList()
            : base("todolist")
        { }
        //special constructor called by SDK
        public TodoList(Appacitive.Sdk.APObject existing)
            : base(existing)
        { }

    	//code
    }

    //This class maps to todoitem type on appacitive
    public class TodoItem : Appacitive.Sdk.APObject
    {
    	public TodoItem(Appacitive.Sdk.APObject existing)
            : base(existing)
        { }

    	//code
    }

Similarly, inherit `User` object from `APUser`, and remove `Id`, `Username`, `Email`, `Password`, `FirstName` and `LastName` from `User` class as they are there in `APUser`.

Now your model is aware of Appacitive Object. The last thing that needs to be changed is the properties. Instead of retrieving property value from local object, you will read it using .Net SDK helper methods. Following sample code shows how to do this
	
	// Change Name property of TodoList
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
            }
        }
    }

Similarly modify all remaining properties of `TodoList` and `TodoItem`. Remove the `Id` property from both the classes because now it is provided by the base class `APObject`.

Lastly we will map your local objects to Appacitive types in `Application_Launching` function, after .Net SDK is initialized

	//Map your model object to appacitive type
    Appacitive.Sdk.App.Types.MapObjectType<User>("user");
    Appacitive.Sdk.App.Types.MapObjectType<TodoList>("todolist");
    Appacitive.Sdk.App.Types.MapObjectType<TodoItem>("todoitem");

Now we have an application which is using Appacitive as backend. 

#### 3.4 Creating and Authenticating User

All the logic for creating and authenticating reside `User.cs`. First we will create user through Signup. Open the file and change `Save` function as follows

	public async Task<bool> Save()
    {
        try
        {
            //Save user in the backend
            await this.SaveAsync();
            Context.User = this;
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
        TimeoutInSeconds = 15 * 60,
        MaxAttempts = int.MaxValue
    };

    var userSession = await Appacitive.Sdk.App.LoginAsync(credentials);

    //Logged in user
    var user = userSession.LoggedInUser as User;
    
    Context.User = user;

For logging out, simply add following code to `Logout` function

	//Logout user
    Appacitive.Sdk.App.LogoutAsync();

So now you know how to create, authenticate and logout user in the app using .Net SDK.

#### 3.5 Managing Todo Lists

Now will we learn how do basic CRUD operations on `TodoList` object using .Net SDK.

**Saving TodoList:**

First we will create a Todo List. To do this open TodoList.cs and modify `Save` function as follows

	public async Task<bool> Save()
    {
        try
        {
            //as we need to store this list in context of user
            //we will create a connection between user and the list
            //when connection is saved, list is automatically created
            await Appacitive.Sdk.APConnection
                            .New("user_todolist")
                            .FromExistingObject("user", Context.User.Id)
                            .ToNewObject("todolist", this)
                            .SaveAsync();
            return true;
        }
        catch { return false; }
    }

Here we are saving TodoList in context of user by creating a connection between `User` and `TodoList`.

**Fetching TodoList:**

Now to fetch `TodoList`, we will make `GetConnectedObjects` call on `User`, as `TodoList` are connected to `User` we can easily fetch `TodoList` for a given `User`. Open `MainViewModel` and remove hard coded code for adding dummy data by following code

	///get connected todolist for current user
    var result = await Context.User.GetConnectedObjectsAsync("user_todolist",
                                                                orderBy: "__utcdatecreated",
                                                                sortOrder: Appacitive.Sdk.SortOrder.Ascending);
    //iterate over result object and add todolist item to the list 
    while (true)
    {
        result.ForEach(r => this.Items.Add(r as TodoList));
        //check if all pages are retrieved
        if (result.IsLastPage) break;
        //fetch next page
        result = await result.NextPageAsync();
    }

**Deleting TodoList:**

Last thing we will do with TodoList is to delete it. To do so replace `Delete` function from TodoList.cs by following

	public async Task<bool> Delete()
    {
        //get all list items
        var result = await this.GetConnectedObjectsAsync("todolist_todoitem");
        var list = new List<TodoItem>();

        //iterate over result object and add todoitem to the list 
        while (true)
        {
            result.ForEach(r => list.Add(r as TodoItem));
			//check if all pages are retrieved
            if (result.IsLastPage) break;
        	//fetch next page
            result = await result.NextPageAsync();
        }

        //delete todolist with it's user connection
        await Appacitive.Sdk.APObjects.DeleteAsync("todolist", this.Id, true);

        //delete all items from list one by one
        list.ForEach(r => r.Delete());
        return true;
    }

Here we are fetching `TodoItem` connected to the `TodoList`, so that once `TodoList` is deleted we can delete all orphan `TodoItem` objects from Appacitive.

#### 3.5 Managing Todo Items

Lastly will we learn perform CRUD operations on `TodoItem` object using .Net SDK. 

When user tap on any todo list, todo items for that list view will be rendered.

**Saving TodoItem:**

Creation of `TodoItem` is similar to `TodoList`, the only difference is `TodoItem` is connected to `TodoList` and not to `User`.

	public async Task<bool> Save()
    {
        try
        {
            //If Id is empty, it means to create the todo item
            //else update
            if (string.IsNullOrEmpty(this.Id))
            {
                //as we need to store this item in context of todolist
                //we will create a connection between todolist and the todoitem
                //when connection is saved, todoitem is automatically created
                await Appacitive.Sdk.APConnection
                                .New("todolist_todoitem")
                                .FromExistingObject("todolist", _parent.Id)
                                .ToNewObject("todoitem", this)
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

Whenever user will mark any todo item as done, same save function will be called and whatever state of the object will be saved in Appacitive Platform.

**Fetching TodoItems:**

When Details view is rendered it asks `DetailsViewModel` to fetch data. As done earlier, we will replace the hard coded values in `LoadData` function from `DetailsViewModel.cs` file by following code

	//Get all objects of type todoitem
    var results = await _movie.GetConnectedObjectsAsync("acted", 
                                                         orderBy: "__utclastupdateddate", 
                                                         sortOrder: Appacitive.Sdk.SortOrder.Ascending);

    //Iterate over the result object till all the todoitems are fetched
    while (true)
    {
        //converting appacitive object to model
        results.ForEach(r => this.Items.Add(new TodoItem(r)));

        //check if its last set of record
        if (results.IsLastPage)
            break;

        //fetch next set of record
        results = await results.NextPageAsync();
    }



**Deleting TodoItem:**

Following code shows how to delete an individual TodoItem.

	public async Task<bool> Delete()
    {
        //delete todo item from backend
        try
        {
            await Appacitive.Sdk.APObjects.DeleteAsync(this.Type, this.Id, true);
            return true;
        }
        catch { return false; }
    }


### Congratulation

You have created a fully functional Todo App using .Net SDK backed by Appacitive Platform. In this Todo App we have explored the **CRUD** capability of two features ***Data Store*** and **Users** provided by Appacitive Core. You also learned how to **Authenticate** user.

### What's next?
You can check out our other <a title="All Samples based on Appacitive .Net SDK" href="../">samples</a> to know more about .Net SDK and other features provided by Appacitive Platform. For complete API reference of .Net SDK go to our <a target="_blank" title="http://help.appacitive.com" href="http://help.appacitive.com/v1.0/#dotnet">help docs<span class="plxs glyphicon glyphicon-share-alt"></span></a>.