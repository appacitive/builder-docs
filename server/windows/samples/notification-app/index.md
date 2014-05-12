ASP.Net Website demonstrates ***Email*** and ***Push*** with ***Data Store*** and ***Users*** features provided by Appacitive Platform. As part of design best practice, you will learn how to model your website and bind your custom objects to the controls.

### Prerequisites

You are aware of <a target="_blank" href="http://www.visualstudio.com/">Visual Studio 2012</a>, <a target="_blank" href="http://www.nuget.org/">NuGet Package</a>, <a target="_blank" href="http://www.asp.net/">ASP.Net</a> and last but not the least <a target="_blank" href="https://portal.appacitive.com/">Appacitive Portal</a>.

**Important Note:**

In this sample we have used <i>SQLExpress</i> as State Server. If you want to change this setting, go to web.config and do necessary modifications. To read more about ASP.Net Session State Management go to <a href="http://msdn.microsoft.com/en-us/library/y5y3c2c5(v=vs.85).aspx" target="_blank">MSDN <span class="plxs glyphicon glyphicon-share-alt"></span></a>.


### Creating ASP.Net Notification Website from Scratch

Follow the step by step guide to get hands on with the ASP.Net Notification Website.

### 1. Modeling app backend on Appacitive

Following video shows how to create the model for the app on Appacitive Platform.

<iframe src="//player.vimeo.com/video/89849527?byline=0&amp;portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>



### 2. Downloading Boilerplate

To jump start, we have created a boilerplate app for you, which is fully functional with some sample data hard coded in the app. You can download the boilerplate <a title="Download boilerplate" href="https://github.com/apalsapure/web-notification/archive/boilerplate.zip">here</a>



### 3. Integrating .Net SDK

The boilerplate is built using ASP.Net 4.5. 


#### 3.1 Installing SDK

Appacitive .Net SDK is hosted on NuGet. To install Appacitive .NET SDK, run the following command in the <a href="http://docs.nuget.org/docs/start-here/using-the-package-manager-console" targe="_blank">Package Manager Console</a>.

	PM> Install-Package Appacitive

This will install Appacitive .Net SDK with all it's dependencies for ASP.Net environment.


#### 3.2 Initializing SDK

You can initialize SDK any where in your website, but we suggest to do it in `Global.asax`, by doing so SDK is available every where in the website. To initialize the SDK, open `Global.asax.cs` and inside `Application_Start` function, copy following code.

	// Code to execute when the application start
	private void Application_Start(object sender, LaunchingEventArgs e)
    {

        // Code that runs on application startup
        BundleConfig.RegisterBundles(BundleTable.Bundles);
        AuthConfig.RegisterOpenAuth();
        RouteConfig.RegisterRoutes(RouteTable.Routes);

    	//Initialize Appacitive SDK
        Appacitive.Sdk.AppContext.InitializeForAspnet(ConfigurationManager.AppSettings["app-id"], 
                                                          ConfigurationManager.AppSettings["api-key"],
                                                          Appacitive.Sdk.Environment.Sandbox);

    }

You will need to set `app-id` and `api-key` in the Web.config. To get these details, open your app on Appacitive Portal. API key for the app is available on your app's home page at the bottom. To get the App Id, open application details view by clicking on edit icon near your app's name.


#### 3.3 Working with .Net SDK Model

As part of design best practice, we suggest that you inherit your model from `APObject`. This simplifies your code by removing code required to transform Appacitive objects to your model. Additionally we will need to override default constructor by a constructor which will pass name of the type to base constructor and add another constructor which will take an instance of `APObject`. The second constructor helps SDK in type casting. Modify your code as follows

    //This class maps to email type on appacitive
    public class EmailItem : APObject
    {
        public EmailItem() : base("email") { }

        public EmailItem(APObject existing) : base(existing) { }

        //code
    }

    //This class maps to push type on appacitive
    public class PushItem : APObject
    {
        public PushItem() : base("push") { }

        public PushItem(APObject existing) : base(existing) { }

        //code
    }

Similarly, inherit `User` object from `APUser`, and remove `Id`, `Username`, `Email`, `Password`, `FirstName` and `LastName` from `User` class as they are there in `APUser`.

Now your model is aware of Appacitive Object. The last thing that needs to be changed is the properties. Instead of retrieving property value from local object, you will read it using .Net SDK helper methods. Following sample code shows how to do this
    
    // Change To property of EmailItem
    public string To
    {
        get { return base.Get<string>("to"); }
        set { base.Set<string>("to", value); }
    }

Similarly modify all remaining properties of `EmailItem` and `PushItem`. Remove the `Id` property from both the classes because now it is provided by the base class `APObject`.

Lastly we will map your local objects to Appacitive types in `Application_Launching` function, after .Net SDK is initialized

    //Map your model object to appacitive type
    Appacitive.Sdk.AppContext.Types.MapObjectType<User>("user");
    Appacitive.Sdk.AppContext.Types.MapObjectType<EmailItem>("email");
    Appacitive.Sdk.AppContext.Types.MapObjectType<PushItem>("push");

Now we have an application which is using Appacitive as backend. 

#### 3.4 Creating and Authenticating User

All the logic for creating and authenticating user reside `User.cs`. First we will create user through Signup. Open the file and change `Save` function as follows

    public async Task<string> Save()
    {
        try
        {
            await this.SaveAsync();
            return null;
        }
        catch (Exception ex)
        {
            if (ExceptionPolicy.HandleException(ex))
                throw;
            return ex.Message;
        }
    }

<p class="mbs mtl"><strong>Important Note</strong></p>

.Net SDK follows `async` pattern to talk to Appacitive Platform. Hence when ever you are making any call to Appacitive you will need to use `await` keyword and will have to make respective function `async`.

Read more about `async` pattern on <a target="_blank" href="http://msdn.microsoft.com/en-us/library/jj152938(v=vs.110).aspx" >MSDN <span class="plxs glyphicon glyphicon-share-alt"></span></a>.

When user click Sign up we first check if user by same username or email exists or not, this is done in following fashion.

    //get username by email
    private async static Task<string> GetUserNameByEmail(string email)
    {
        var totalRecords = 0;
        var collection = await GetMatchingUsers(Query.Property("email").IsEqualTo(email), 0, 20);
        if (totalRecords == 0) return null;
        else
        {
            return collection[0].Username;
        }
    }

    //get user by username
    private async static Task<User> GetUser(string username, bool userIsOnline)
    {
        var totalRecords = 0;
        var collection = await GetMatchingUsers(Query.Property("username").IsEqualTo(username), 0, 20);
        if (totalRecords == 0) return null;
        else
        {
            return collection[0];
        }
    }

    //helper function which executes the given query and returns matching users
    private async static Task<List<User>> GetMatchingUsers(IQuery query, int pageIndex, int pageSize)
    {
        var users = await APUsers.FindAllAsync(query, pageNumber: pageIndex, pageSize: pageSize, orderBy: "__id", sortOrder: SortOrder.Ascending);

        var result = new List<User>();
        users.ForEach((u) =>
        {
            result.Add(u as User);
        });
        return result;
    }

Accordingly modify above functions in the boilerplate.

**Authenticating User**

To authenticate user we will add following code inside try catch block of `Authenticate` function

    //authenticate user on Appacitive
    var credentials = new UsernamePasswordCredentials(userName, password)
    {
        TimeoutInSeconds = int.MaxValue,
        MaxAttempts = int.MaxValue
    };

    await Appacitive.Sdk.AppContext.LoginAsync(credentials);


For logging out, simply add following code to `Logout` function

    //Logout user
    Appacitive.Sdk.AppContext.LogoutAsync();

**Managing User Session**

When ever user session expires, Appacitive API throws an error with a code `19036`. So if we handle this error we can easily manage the user session. In this sample we have done this in `ExceptionPolicy` class as follows
    
    //user in the context is null
    if (AppContext.UserContext.LoggedInUser == null) return LogoutUser();

    //check if exception occurred is an api error
    if (ex is AppacitiveApiException)
    {
        var appEx = ex as AppacitiveApiException;

        //user session expired
        if (appEx.Code == "19036")
            return LogoutUser();

        return false;
    }
    else if (ex is AppacitiveRuntimeException)
    {
        return true;
    }
    else return false;

So now you know how to create, authenticate and logout user in the app using .Net SDK.

#### 3.5 Managing EmailItem and Sending Email

Now we will learn how to manage `EmailItem` object using .Net SDK.

**Sending Email:**

Appacitive platform allows you send raw and templated emails. In this sample we will send both kind of emails. You can use your SMTP settings to send these emails. 

Following code will send both raw and templated emails, add this to `SendEmail` function.

    var to = new List<string>();
    var cc = new List<string>(); ;
    to.AddRange(this.To.Split(','));
    if (string.IsNullOrEmpty(this.CC) == false) cc.AddRange(this.CC.Split(','));

    //construct the email
    var email = Email
                    .Create(this.Subject)
                    .WithRecipients(to, cc)
                    .From(this.From);

    //decide whether it's a templated or raw email
    if (string.IsNullOrEmpty(this.TemplateName))
        email = email.WithBody(this.Body, true);
    else
        email.WithTemplateBody(this.TemplateName, this.PlaceHolders, true);

    //use custom SMTP settings
    if (this.WithCustomSettings)
    {
        email.Server = new SmtpServer();
        email.Server.Username = AppContext.UserContext.LoggedInUser.GetAttribute("smtp:username");
        email.Server.Password = AppContext.UserContext.LoggedInUser.GetAttribute("smtp:password");
        email.Server.Host = AppContext.UserContext.LoggedInUser.GetAttribute("smtp:host");
        email.Server.Port = int.Parse(AppContext.UserContext.LoggedInUser.GetAttribute("smtp:port"));
        email.Server.EnableSSL = bool.Parse(AppContext.UserContext.LoggedInUser.GetAttribute("smtp:ssl"));
    }

    //send email
    await email.SendAsync();

In this sample we are storing the custom SMTP settings provided by the user inside attributes of current logged in user. This is done in `SaveSMTPSettings` function as follows

    //get the user from the context
    //and set the SMTP settings in the attribute
    var user = AppContext.UserContext.LoggedInUser;
    user.SetAttribute("smtp:username", username);
    user.SetAttribute("smtp:password", password);
    user.SetAttribute("smtp:host", host);
    user.SetAttribute("smtp:port", port.ToString());
    user.SetAttribute("smtp:ssl", enableSSL.ToString());
    await user.SaveAsync();

**Saving EmailItem:**

After sending email we will create an EmailItem and store it in backend, for maintaining history. To do this open EmailItem.cs and add following code to `Save` function

    //add placeholders into the attributes
    if (PlaceHolders != null && PlaceHolders.Count > 0)
    {
        foreach (var key in PlaceHolders.Keys)
            this.SetAttribute(key, PlaceHolders[key]);
    }

    //as we need to store this email object in context of user
    //we will create a connection between user and the email object
    //when connection is saved, email object is automatically created
    await Appacitive.Sdk.APConnection
                    .New("user_email")
                    .FromExistingObject("user", AppContext.UserContext.LoggedInUser.Id)
                    .ToNewObject("email", this)
                    .SaveAsync();


Here we are saving EamilItem in context of user by creating a connection between `User` and `EmailItem`.

**Fetching EmailItems:**

Now to fetch `EmailItem`, we will make `GetConnectedObjects` call on `User`, as `EmailItem` are connected to `User` we can easily fetch `EmailItem` for a given `User`. Open EmailItem.cs and remove hard coded code for adding dummy data from `LoadData` function by following code

    //get connected email items for current user
    var user = AppContext.UserContext.LoggedInUser;
    var result = await user.GetConnectedObjectsAsync("user_email",
                                                    fields: new[] { "to", "subject", "__utcdatecreated" },
                                                    pageNumber: pageCount + 1,
                                                    pageSize: pageSize,
                                                    orderBy: "__id",
                                                    sortOrder: SortOrder.Descending);
    result.ForEach((r) => { list.Add(r as EmailItem); });

In this call large number of objects will be fetched, so to reduce the response size we will ask APIs to return only `to`, `subject` and `__utcdatecreated` properties.

**Fetching EmailItem Details:**

In last the call we fetched only few properties, but now when we will render email details view, we will require all properties. To do so modify `Fetch` function as follows

    //get the email item details
    public async static Task<EmailItem> Fetch(string id)
    {
        try
        {
            //get the email item details
            var emailItem = await APObjects.GetAsync("email", id) as EmailItem;
            emailItem.PlaceHolders = new Dictionary<string, string>();

            //load the place holders from the attributes
            if (emailItem.Attributes != null)
            {
                foreach (var keyValue in emailItem.Attributes)
                {
                    emailItem.PlaceHolders[keyValue.Key] = keyValue.Value;
                }
            }
            return emailItem;
        }
        catch (Exception ex)
        {
            if (ExceptionPolicy.HandleException(ex))
                throw;
            return null;
        }
    }


#### 3.6 Managing PushItem and Sending Push Notifications

Managing Push Item is very similar to Email Item. But first we will see how to Send Push Notifications.

**Sending Push Notifications**

Appacitive Platform allows to send push notifications to devices powered by iOS, Android and Windows OS. Following code will demonstrate how to send push notification

    PushNotification push = null;
    var message = string.Format("{0}: {1}", this.From, this.Message);

    //depending upon type of recipients we will construct the push object
    switch (this.ToType)
    {
        case 0: push = PushNotification.ToChannels(message, this.To.Split(',')); break;
        case 1: push = PushNotification.ToDeviceIds(message, this.To.Split(',')); break;
        default: push = PushNotification.Broadcast(message); this.To = "Broadcast"; break;
    }

    //set the badge
    if (string.IsNullOrEmpty(this.Badge) == false) push = push.WithBadge(this.Badge);

    //set the expiry
    if (push.ExpiryInSeconds > 0) push = push.WithExpiry(push.ExpiryInSeconds);

    //for this sample we will send toast notification
    var toast = new ToastNotification(this.From, this.Message, "/MainPage.xaml");
    push.WithPlatformOptions(WindowsPhoneOptions.WithToast(toast));

    //send push
    await push.SendAsync();

    //using same push object we will send a tile notification
    //this will show a badge on the tile
    var tile = TileNotification.CreateNewFlipTile(new FlipTile
    {
        BackContent = this.From,
        BackTitle = "New Message",
        FrontCount = "+0"
    });
    push.WithPlatformOptions(WindowsPhoneOptions.WithTile(tile));

    //send the push notification
    await push.SendAsync();

Add above code `SendPush` function inside PushItem.cs.

**Saving PushItem:**

To save push item, open PushItem.cs and add following code to `Save` function

    //as we need to store this push object in context of user
    //we will create a connection between user and the push object
    //when connection is saved, push object is automatically created
    await Appacitive.Sdk.APConnection
                    .New("user_push")
                    .FromExistingObject("user", AppContext.UserContext.LoggedInUser.Id)
                    .ToNewObject("push", this)
                    .SaveAsync();
    await this.SaveAsync();


**Fetching PushItems:**

We will fetch the push items which are connected to current logged in user. To do so open PushItem.cs and replace the hard coded values inside `LoadData` function by following code

    //get the items from appacitive
    var user = AppContext.UserContext.LoggedInUser;
    var result = await user.GetConnectedObjectsAsync("user_push",
                                                    fields: new[] { "to", "message", "__utcdatecreated" },
                                                    pageNumber: pageCount + 1,
                                                    pageSize: pageSize,
                                                    orderBy: "__id",
                                                    sortOrder: SortOrder.Descending);
    result.ForEach((r) => { list.Add(r as PushItem); });

Again we will fetch only that much data which is required to render the view.

**Fetching PushItem Details:**

Following code shows how to fetch PushItem, replace the `Fetch` function by following code

    //get the push item details
    public async static Task<PushItem> Fetch(string id)
    {
        try
        {
            return await APObjects.GetAsync("push", id) as PushItem;
        }
        catch (Exception ex)
        {
            if (ExceptionPolicy.HandleException(ex))
                throw;
            return null;
        }
    }


### Congratulation

You have created a fully functional Notification ASP.Net Website using .Net SDK backed by Appacitive Platform. While building this website we have explored ***Push*** and ***Email*** features with ***Data Store*** and ***User*** features provided by Appacitive Platform.

### What's next?
You can check out our other <a title="All Samples based on Appacitive .Net SDK" href="../">samples</a> to know more about .Net SDK and other features provided by Appacitive Platform. For complete API reference of .Net SDK go to our <a target="_blank" title="http://help.appacitive.com" href="http://help.appacitive.com/v1.0/#dotnet">help docs<span class="plxs glyphicon glyphicon-share-alt"></span></a>.