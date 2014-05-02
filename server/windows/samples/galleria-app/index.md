Galleria App demonstrates ***Users***, ***Data Store*** and ***Files***  features provided by Appacitive Platform. As part of design best practice, you will learn how to model your app and bind your custom objects to the view.

### Prerequisites

You are aware of <a target="_blank" href="http://www.visualstudio.com/">Visual Studio 2012</a>, <a target="_blank" href="http://www.nuget.org/">NuGet Package</a>, <a target="_blank" href="https://dev.windowsphone.com/en-us/downloadsdk">Windows Phone SDK</a>, <a target="_blank" href="http://phone.codeplex.com/"> Windows Phone Toolkit</a> and last but not the least <a target="_blank" href="https://portal.appacitive.com/">Appacitive Portal</a>.


### Creating Galleria App from Scratch

Follow the step by step guide to get hands on with the Movie App.

### 1. Modeling app backend on Appacitive

Following video shows how to create the model for the app on Appacitive Platform.

<iframe src="//www.youtube.com/embed/ui80iGH190w" frameborder="0" allowfullscreen></iframe>


### 2. Downloading Boilerplate

To jump start, we have created a boilerplate app for you, which is fully functional with some sample data hard coded in the app. You can download the boilerplate <a title="Download boilerplate" href="https://github.com/apalsapure/wp-galleria/archive/boilerplate.zip">here</a>

The sample data and images in the boilerplate are taken from <a target="_blank" href="http://phone.codeplex.com/"> Windows Phone Toolkit</a>.



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

	//This class maps to image type on appacitive
	public class ImageDetails : Appacitive.Sdk.APObject
    {
    	//override default constructor
        public ImageDetails()
            : base("image")
        { }
        //special constructor called by SDK
        public ImageDetails(Appacitive.Sdk.APObject existing)
            : base(existing)
        { }

    	//code
    }

Similarly, inherit `User` object from `APUser`, and remove `Id`, `Username`, `Email`, `Password`, `FirstName` and `LastName` from `User` class as they are there in `APUser`.

Now your model is aware of Appacitive Object. The last thing that needs to be changed is the properties. Instead of retrieving property value from local object, you will read it using .Net SDK helper methods. Following sample code shows how to do this
	
	// Change Name property of ImageDetails
	public string Title
    {
        get { return this.Get<string>("title"); }
        set
        {
            this.Set<string>("title", value);
            base.FirePropertyChanged("Title");
        }
    }

Similarly modify all remaining properties of `ImageDetails` class and remove the `Id` property from it because now it is provided by the base class `APObject`.

Lastly we will map your local objects to Appacitive types in `Application_Launching` function, after .Net SDK is initialized

	//Map your model object to appacitive type
    Appacitive.Sdk.App.Types.MapObjectType<User>("user");
    Appacitive.Sdk.App.Types.MapObjectType<ImageDetails>("image");

Now we have an application which is using Appacitive as backend. 

#### 3.4 Creating and Authenticating User

All the logic for creating and authenticating user reside `User.cs`. First we will create user through Signup. Open the file and change `Save` function as follows

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

#### 3.5 Managing Images

In this sample we will upload image from the device. To achieve this we will need to do as follows

* Upload file and get it's download URL
* Create an object of `ImageDetails` with this URL.
* Save this object in context of logged in user, by creating a connection between user and image object.


<strong class="ptm" style="display:block">Uploading Image:</strong>

The Windows Phone SDK will give us a `Stream` object which contains image data, we will rotate the image (if required) and resize it to reduce the size. 

Uploading image and retrieving it's download image are two different steps. First we will upload the image, to do so we will modify `UploadFile` function from MainPage.xaml.cs. 

	string fileName = DateTime.Now.Ticks.ToString() + ".jpg";
    var upload = new Appacitive.Sdk.FileUpload("image/jpeg", fileName, 30);
    await upload.UploadAsync(imageData);

Once file is uploaded, we will get it's public URL, which will be saved with the image.

    var download = new Appacitive.Sdk.FileDownload(fileName);
    string publicUrl = await download.GetPublicUrlAsync();


**Saving Image Details:**

Using the information provided by user and the public URL retrieved earlier construct `ImageDetails` object. Now this object we need to store in context of logged in user, to do so open ImageDetails.cs and replace `Save` function by following

    public async Task<bool> Save()
    {
        //save object here
        try
        {
            if (string.IsNullOrEmpty(this.Id))
            {                 //as we need to store this image in context of user
                //we will create a connection between user and the image
                //when connection is saved, image is automatically created
                await Appacitive.Sdk.APConnection
                                .New("author")
                                .FromExistingObject("user", Context.User.Id)
                                .ToNewObject("image", this)
                                .SaveAsync();
            }
            else
            {
                //update the object
                await this.SaveAsync();
            }
            return true;
        }
        catch { return false; }
    }

This function creates and updates the image object on Appacitive.

**Fetching Image Details**

In this app we will display images which are either uploaded by the user or are available publicly. For this we will build a simple query as follows

    //get all images which are public or uploaded by me
    var query = Appacitive.Sdk.Query.Or(new[]{
                            Appacitive.Sdk.Query.Property("ispublic").IsEqualTo(true),
                            Appacitive.Sdk.Query.Property("__createdby").IsEqualTo(Context.User.Id)
                });

Now we will pass this query to `FindAllAsync` function and retrieve the required images
    
    //fire the query
    var result = await Appacitive.Sdk.APObjects.FindAllAsync("image", query, pageSize: 50,
                                                              orderBy: "__utcdatecreated",
                                                              sortOrder: Appacitive.Sdk.SortOrder.Ascending);
    //iterate over result object and add todolist item to the list 
    while (true)
    {
        result.ForEach(r =>
        {
            var imageDetails = r as ImageDetails;
            switch (imageDetails.Category.ToLower())
            {
                case "place":
                    App.ViewModel.PlaceItems.Add(imageDetails);
                    break;
                case "people":
                    App.ViewModel.PeopleItems.Add(imageDetails);
                    break;
                default:
                    App.ViewModel.FoodItems.Add(imageDetails);
                    break;
            }
        });
        
        //check if all pages are retrieved
        if (result.IsLastPage) break;
        //fetch next page
        result = await result.NextPageAsync();
    }


**Deleting Image Details:**

Last thing we will do is to delete Image Details. To do so replace `Delete` function from ImageDetails.cs by following

	public async Task<bool> Delete()
    {
        var result = false;
        try
        {
            //deleting image details with it's connection with user
            await Appacitive.Sdk.APObjects.DeleteAsync(this.Type, this.Id, true);
            result = true;
        }
        catch { }
        return result;
    }

### Congratulation

You have created a fully functional Galleria App using .Net SDK backed by Appacitive Platform. In this Galleria App we have explored the **CRUD** capability of two features ***Data Store*** and **Users** with upload and download capability of ***File*** feature provided by Appacitive Core. You also learned how to **Authenticate** user.

### What's next?
You can check out our other <a title="All Samples based on Appacitive .Net SDK" href="../">samples</a> to know more about .Net SDK and other features provided by Appacitive Platform. For complete API reference of .Net SDK go to our <a target="_blank" title="http://help.appacitive.com" href="http://help.appacitive.com/v1.0/#dotnet">help docs<span class="plxs glyphicon glyphicon-share-alt"></span></a>.